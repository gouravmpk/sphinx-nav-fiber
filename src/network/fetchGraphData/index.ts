import * as sphinx from "sphinx-bridge-kevkevinpal";
import {
  API_URL,
  isDevelopment,
  AWS_IMAGE_BUCKET_URL,
  CLOUDFRONT_IMAGE_BUCKET_URL,
} from "~/constants";
import { GraphData, Link, Moment, Node } from "~/types";
import { getLSat } from "~/utils/getLSat";

const defautData: GraphData = {
  nodes: [],
  links: [],
};

const includeTopics = false;

export const fetchGraphData = async (search: string) => {
  // @ts-ignore
  await sphinx.enable();

  try {
    return getGraphData(search);
  } catch (e) {
    return Promise.resolve(defautData);
  }
};

async function getGraphData(searchterm: string) {
  try {
    let data: Moment[] = [];

    const origin = window.location.origin;

    if (isDevelopment) {
      console.log("is dev", origin);
      let devUrl = process.env.REACT_DEV_API_URL || `${API_URL}/mock_data`;
      const res = await fetch(devUrl);
      data = await res.json();
    } else {
      const lsatToken = await getLSat();

      if (!lsatToken) {
        throw new Error("An error occured calling getLSat");
      }

      let apiRes = await fetch(`${API_URL}/search?word=${searchterm}`, {
        headers: {
          Authorization: lsatToken,
        },
      });
      if (apiRes.status >= 200 && apiRes.status <= 299) {
        data = await apiRes.json();
      } else if (apiRes.status === 402) {
        // For it to get to this block means the previous lsat has expired

        const lsat = localStorage.getItem("lsat");
        if (lsat) {
          const expiredLsat = JSON.parse(lsat);
          // @ts-ignore
          await sphinx.enable(true);
          // Update lsat on relay as expired
          // @ts-ignore
          const checker = await sphinx.updateLsat(
            expiredLsat.identifier,
            "expired"
          );

          if (checker.success) {
            // clearing local value of lsat being stored
            localStorage.removeItem("lsat");
          }
        }

        // Calling the get getGraphData method again but this time without lsat in the local storage
        getGraphData(searchterm);
      } else {
        // giving an empty data array
        data = [];
      }
    }

    const nodes: Node[] = [];
    const links: Link[] = [];

    if (data.length) {
      const topicMap: Record<string, string[]> = {};
      const guestMap: Record<string, string[]> = {};

      // Populating nodes array with podcasts and constructing a topic map
      data.forEach(async (moment) => {
        const { children, topics, guests, boost, show_title, node_type } =
          moment;

        if (!includeTopics && node_type === "topic") return;

        if (children) {
          children.forEach((childRefId: string) => {
            const link: Link = {
              source: childRefId,
              target: moment.ref_id,
            };

            links.push(link);
          });
        }

        let nodeColors: string[] = [];

        if (topics) {
          topics.forEach((topic: string) => {
            topicMap[topic] = [...(topicMap[topic] || []), show_title];
          });
        }

        if (moment.node_type === "episode") {
          guests.forEach((guest) => {
            guestMap[guest] = [...(guestMap[guest] || []), moment.ref_id];
          });
        }

        // replace aws bucket url with cloudfront, and add size indicator to end
        const smallImage = moment.image_url
          ?.replace(AWS_IMAGE_BUCKET_URL, CLOUDFRONT_IMAGE_BUCKET_URL)
          .replace(".jpg", "_s.jpg");

        nodes.push({
          weight: moment.weight,
          id: moment.ref_id,
          name:
            moment.show_title +
            ":" +
            moment.episode_title +
            ":" +
            moment.timestamp,
          label: moment.show_title,
          type: moment.type,
          node_type: moment.node_type,
          text: moment.text,
          details: { ...moment, image_url: smallImage },
          image_url: smallImage,
          colors: nodeColors,
          boost: boost,
        });
      });

      if (includeTopics) {
        Object.entries(topicMap).forEach(([topic, topicTitles], index) => {
          // dont create topic node for search term (otherwise everything will be linked to it)
          if (topic === searchterm) return;

          const scale = topicTitles.length * 2;
          const topicNodeId = "topicnode_" + index;

          // make links to children
          topicTitles.forEach((showTitle) => {
            const show = data.find(
              (f) => f.show_title === showTitle && f.node_type === "episode"
            );
            const showRefId = show?.ref_id || "";

            const link: Link = {
              source: showRefId,
              target: topicNodeId,
            };

            links.push(link);
          });

          const topicNode: Node = {
            id: topicNodeId,
            name: topic,
            weight: 0,
            label: topic,
            type: "topic",
            node_type: "topic",
            text: topic,
            scale: scale,
            colors: ["#000"],
          };

          nodes.push(topicNode);
        });
      }

      // Adds guest nodes
      Object.entries(guestMap).forEach(([guest, guestChildren], index) => {
        const scale = guestChildren.length * 2;
        const guestNodeId = "guestnode_" + index;

        // make links to children
        guestChildren.forEach((childRefId: string) => {
          const link: Link = {
            source: childRefId,
            target: guestNodeId,
          };

          links.push(link);
        });

        const guestNode: Node = {
          id: guestNodeId,
          name: guest,
          weight: 0,
          label: guest,
          type: "guest",
          node_type: "guest",
          text: guest,
          scale: scale,
          colors: ["#000"],
        };

        nodes.push(guestNode);
      });
    }

    nodes.sort((a, b) => (b.weight || 0) - (a.weight || 0));

    const n = nodes.map((n) => {
      return { ...n };
    });
    const l = links.map((n) => {
      return { ...n };
    });
    console.log("nodes", n);
    console.log("links", l);
    return { nodes, links };
  } catch (e) {
    console.error(e);
    console.log(e);
    return defautData;
  }
}
