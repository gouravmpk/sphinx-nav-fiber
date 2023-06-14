/* eslint-disable import/no-extraneous-dependencies */
import { AdaptiveDpr, AdaptiveEvents, Html, Loader, Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Outline, Selection, Vignette } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { BlendFunction, Resolution } from 'postprocessing'
import { Perf } from 'r3f-perf'
import { Suspense, useMemo } from 'react'
import { isDevelopment } from '~/constants'
import { useControlStore } from '~/stores/useControlStore'
import { useSelectedNode } from '~/stores/useDataStore'
import { colors } from '~/utils/colors'
import { addToGlobalForE2e } from '~/utils/tests'
import { Controls } from './Controls'
import { initialCameraPosition } from './Controls/CameraAnimations/constants'
import { Graph } from './Graph'
import { getNodeColorByType } from './Graph/Cubes/constants'
import { Lights } from './Lights'
import { Overlay } from './Overlay'
import { outlineEffectColor } from './constants'

const Content = () => {
  const { universeColor } = useControls('universe', {
    universeColor: colors.black,
  })

  const selectedNode = useSelectedNode()

  const outlineColor: number = useMemo(() => {
    return selectedNode?.node_type ? (getNodeColorByType(selectedNode.node_type) as number) : outlineEffectColor
  }, [selectedNode])

  return (
    <>
      <color args={[universeColor]} attach="background" />

      <Lights />

      <Controls />

      <Selection>
        <EffectComposer autoClear={false} multisampling={8}>
          <Vignette eskil={false} offset={0.05} darkness={0.5} />

          <Bloom
            luminanceThreshold={1} // luminance threshold. Raise this value to mask out darker elements in the scene.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mipmapBlur
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
          <Outline
            blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
            blur
            edgeStrength={8}
            hiddenEdgeColor={outlineColor}
            visibleEdgeColor={outlineColor} // the color of visible edges
          />
        </EffectComposer>

        <Graph />
      </Selection>
    </>
  )
}

let wheelEventTimeout: ReturnType<typeof setTimeout> | null = null

export const Universe = () => {
  const [setIsUserScrollingOnHtmlPanel, setIsUserScrolling, setUserMovedCamera] = [
    useControlStore((s) => s.setIsUserScrollingOnHtmlPanel),
    useControlStore((s) => s.setIsUserScrolling),
    useControlStore((s) => s.setUserMovedCamera),
  ]

  return (
    <>
      <Overlay />

      <Suspense fallback={null}>
        <Canvas
          camera={{
            aspect: 1920 / 1080,
            far: 30000,
            near: 1,
            position: [initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z],
          }}
          id="universe-canvas"
          onCreated={(s) => addToGlobalForE2e(s, 'threeState')}
          onWheel={(e: React.WheelEvent) => {
            const { target } = e
            const { offsetParent } = target as HTMLDivElement

            if (wheelEventTimeout) {
              clearTimeout(wheelEventTimeout)
            }

            if (offsetParent?.classList?.contains('html-panel')) {
              // if overflowing on y, disable camera controls to scroll on div
              if (offsetParent.clientHeight < offsetParent.scrollHeight) {
                setIsUserScrollingOnHtmlPanel(true)
              }
            }

            setIsUserScrolling(true)
            setUserMovedCamera(true)

            wheelEventTimeout = setTimeout(() => {
              setIsUserScrolling(false)
              setIsUserScrollingOnHtmlPanel(false)
            }, 200)
          }}
        >
          {isDevelopment && <Perf position="top-left" />}

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
}
