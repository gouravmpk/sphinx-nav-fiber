import { Segments } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3-force-3d";
import { useEffect, useRef } from "react";
import { useGraphData } from "~/components/DataRetriever";
import { useDataStore } from "~/stores/useDataStore";
import { GraphData, NodeExtended } from "~/types";
import { Cubes } from "./Cubes";
import { Segment } from "./Segment";

const layout = forceSimulation()
  .numDimensions(3)
  .force(
    "link",
    forceLink()
      .distance((d: { source: NodeExtended; target: NodeExtended }) => {
        const sourceType = d.source.node_type;
        const targetType = d.target.node_type;

        if (sourceType === "show") {
          return 500;
        }

        switch (targetType) {
          case "show":
            return 200;
          case "topic":
            return 1000;
          case "guest":
            return 300;
          case "clip":
            return 100;
          case "episode":
            return 150;
          default:
            return 100;
        }
      })
      .strength(0.4)
  )
  .force("center", forceCenter().strength(0.1))
  .force("charge", forceManyBody())
  .force("dagRadial", null)
  .velocityDecay(0.2)
  .alphaDecay(0.0228)
  .stop();

const maxTicks = 200;
let currentTick: number;

// Time in seconds
const timeLimit = 5;

export const Graph = () => {
  const data = useGraphData();
  const [graphRadius, setGraphRadius] = useDataStore((s) => [s.graphRadius, s.setGraphRadius]);

  const { clock } = useThree();

  useEffect(() => {
    clock.stop();

    layout.stop().nodes(data.nodes);

    layout
      .force("link")
      .id((d: NodeExtended) => d.id)
      .links(data.links);

    // re-heat the simulation
    layout.alpha(1).restart();

    if (graphRadius) {
      setGraphRadius(null);
    }

    layout.tick([200]);

    clock.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock, data]);

  useFrame(() => {
    if (layout.alpha() < 1e-2) {

      if (!graphRadius) {
        const nodes = layout.nodes();

        let radius = Math.max(...[Math.abs(nodes[0].x), Math.max(nodes[0].y), Math.max(nodes[0].z)]);

        for (let i = 1; i < nodes.length; i += 1) {
          const { x, y, z } = nodes[i];

          if (Math.abs(x) > radius) {
            radius = Math.abs(x);
          }

          if (Math.abs(y) > radius) {
            radius = Math.abs(y);
          }

          if (Math.abs(z) > radius) {
            radius = Math.abs(z);
          }
        }

        setGraphRadius(radius);
      }
    }
  });

  return (
    <>
      <Cubes />

      <Segments
        /** NOTE: using the key in this way the segments re-mounts
         *  everytime the data.links count changes
         * */
        key={`links-${data.links.length}`}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fog
        limit={data.links.length}
        lineWidth={0.15}
      >
        {(data.links as unknown as GraphData<NodeExtended>["links"])
          .map((link, index) => (
          <Segment
            // eslint-disable-next-line react/no-array-index-key
            key={index.toString()}
            link={link}
          />
        ))}
      </Segments>
    </>
  );
};

Segments.displayName = "Segments";
