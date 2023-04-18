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

import { useControlStore } from "~/stores/useControlStore";
import { useControls } from "leva";

const NODE_SELECTED_COLOR = 0x00ff00;

const Content = () => {
  const {universeColor, ssaoColor} = useControls('universe', {
    universeColor: colors.black,
    ssaoColor: "black",
  })

  return (
    <>
      <color args={[universeColor]} attach="background" />

      <Lights />

      <Controls />

      <Selection>
        <Graph />

        <EffectComposer autoClear={false} multisampling={8}>
          <SSAO
            color={ssaoColor}
            intensity={150}
            luminanceInfluence={0.5}
            radius={0.05}
          />

          <Bloom luminanceThreshold={1} mipmapBlur />

          <Outline blur edgeStrength={5} visibleEdgeColor={NODE_SELECTED_COLOR} />
        </EffectComposer>
      </Selection>
    </>
  )
};

let wheelEventTimeout: ReturnType<typeof setTimeout> | null = null

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
        onWheel={() => {
          if (wheelEventTimeout) {
            clearTimeout(wheelEventTimeout);
          }

          useControlStore.setState({ isUserScrolling: true })

          wheelEventTimeout = setTimeout(() => {
            useControlStore.setState({ isUserScrolling: false })
          }, 200)
        }}
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
  )
