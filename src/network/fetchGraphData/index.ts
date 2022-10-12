/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as sphinx from "sphinx-bridge-kevkevinpal";
import {
  AWS_IMAGE_BUCKET_URL,
  CLOUDFRONT_IMAGE_BUCKET_URL,
  isDevelopment,
} from "~/constants";
import { api } from "~/network/api";
import { GraphData, Link, Node, NodeExtended } from "~/types";
import { getLSat } from "~/utils/getLSat";

const defautData: GraphData = {
  links: [],
  nodes: [],
};

const shouldIncludeTopics = false;

export const fetchGraphData = async (search: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await sphinx.enable();

  try {
    return getGraphData(search);
  } catch (e) {
    return defautData;
  }
};

const fetchNodes = async (search: string) => {
  if (isDevelopment) {
    console.log("is dev", origin);

    return api.get<Node[]>("/mock_data");
  }

  console.log("getting prod data");

  const lsatToken = await getLSat();

  if (!lsatToken) {
    throw new Error("An error occured calling getLSat");
  }

  return api.get<Node[]>(`/search?word=${search}`, {
    Authorization: lsatToken,
  });
};

const getGraphData = async (searchterm: string) => {
  try {
    const data = await fetchNodes(searchterm);

    if (!Array.isArray(data)) {
      // For it to get to this block means the previous lsat has expired

      const lsat = localStorage.getItem("lsat");

      if (lsat) {
        const expiredLsat = JSON.parse(lsat);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        await sphinx.enable(true);

        // Update lsat on relay as expired
        // @ts-ignore
        // await sphinx.updateLsat(expiredLsat.identifier, "expired");

        // if (checker.success) {
        // clearing local value of lsat being stored
        localStorage.removeItem("lsat");
        // }
      }

      // Calling the get getGraphData method again but this time without lsat in the local storage
      return { expired: true, links: [], nodes: [] };
    }

    const nodes: NodeExtended[] = [];
    const links: Link[] = [];

    let topicMap: Record<string, string[]> = {};
    let guestMap: Record<string, string[]> = {};

    if (data.length) {
      // Populating nodes array with podcasts and constructing a topic map
      data.forEach((node) => {
        const {
          children,
          topics,
          guests,
          show_title: showTitle,
          node_type: nodeType,
        } = node;

        if (!shouldIncludeTopics && nodeType === "topic") {
          return;
        }

        children?.forEach((childRefId: string) => {
          const link: Link = {
            source: node.ref_id,
            target: childRefId,
          };

          links.push(link);
        });

        if (topics) {
          topicMap = topics.reduce((acc, topic) => {
            if (showTitle) {
              acc[topic] = [...(topicMap[topic] || []), showTitle];
            }

            return acc;
          }, {} as Record<string, string[]>);
        }

        if (node.node_type === "episode") {
          guestMap =
            guests?.reduce((acc, guest) => {
              if (guest) {
                acc[guest] = [...(guestMap[guest] || []), node.ref_id];
              }

              return acc;
            }, {} as Record<string, string[]>) || {};
        }

        // replace aws bucket url with cloudfront, and add size indicator to end
        const smallImageUrl = node.image_url
          ?.replace(AWS_IMAGE_BUCKET_URL, CLOUDFRONT_IMAGE_BUCKET_URL)
          .replace(".jpg", "_s.jpg");

        nodes.push({
          ...node,
          id: node.ref_id,
          // label: moment.show_title,
          image_url: smallImageUrl,
        });
      });

      if (shouldIncludeTopics) {
        Object.entries(topicMap).forEach(([topic, topicTitles], index) => {
          /** we dont create topic node for search term,
           *  otherwise everything will be linked to it
           */
          if (topic === searchterm) {
            return;
          }

          const scale = topicTitles.length * 2;
          const topicNodeId = `topic_node_${index}`;

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

          const topicNode: NodeExtended = {
            colors: ["#000"],
            id: topicNodeId,
            label: topic,
            name: topic,
            node_type: "topic",
            ref_id: topicNodeId,
            scale,
            show_title: topic,
            text: topic,
            weight: 0,
          };

          nodes.push(topicNode);
        });
      }

      // Adds guest nodes
      Object.entries(guestMap).forEach(([guest, guestChildren], index) => {
        const scale = guestChildren.length * 2;
        const guestNodeId = `guestnode_${index}`;

        // make links to children
        guestChildren.forEach((childRefId: string) => {
          const link: Link = {
            source: childRefId,
            target: guestNodeId,
          };

          links.push(link);
        });

        const guestNode: NodeExtended = {
          colors: ["#000"],
          id: guestNodeId,
          label: guest,
          name: guest,
          node_type: "guest",
          ref_id: guestNodeId,
          scale,
          show_title: guest,
          text: guest,
          type: "guest",
          weight: 0,
        };

        nodes.push(guestNode);
      });
    }

    nodes.sort((a, b) => (b.weight || 0) - (a.weight || 0));

    return { links, nodes };
  } catch (e) {
    console.error(e);

    return defautData;
  }
};
