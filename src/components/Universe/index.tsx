/* eslint-disable import/no-extraneous-dependencies */
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Html,
  Loader,
  Preload,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Outline,
  Selection,
  SSAO,
} from "@react-three/postprocessing";
import { Suspense } from "react";
import { colors } from "~/utils/colors";
import { Controls } from "./Controls";
import { Graph } from "./Graph";
import { Lights } from "./Lights";

const NODE_SELECTED_COLOR = 0x00ff00;

const Content = () => (
  <>
    <color args={[colors.black]} attach="background" />

    <Lights />

    <Controls />

    <Selection>
      <Graph />

      <EffectComposer autoClear={false} multisampling={8}>
        <SSAO
          color="black"
          intensity={150}
          luminanceInfluence={0.5}
          radius={0.05}
        />

        <Bloom luminanceThreshold={1} mipmapBlur />

        <Outline blur edgeStrength={5} visibleEdgeColor={NODE_SELECTED_COLOR} />
      </EffectComposer>
    </Selection>
  </>
);

export const Universe = () => (
  <>
    <div id="tooltip-portal" />

    <Suspense fallback={null}>
      <Canvas
        camera={{
          aspect: 1920 / 1080,
          far: 8000,
          near: 1,
          position: [1000, 0, 5],
        }}
        id="universe-canvas"
      >
        <Suspense
          fallback={
            <Html>
              <Loader />
            </Html>
          }
        >
          <Preload />

          <AdaptiveDpr />

          <AdaptiveEvents />

          <Content />
        </Suspense>
      </Canvas>
    </Suspense>
  </>
);
