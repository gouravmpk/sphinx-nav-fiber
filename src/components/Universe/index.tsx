/* eslint-disable import/no-extraneous-dependencies */
import { AdaptiveDpr, AdaptiveEvents, Html, Loader, Preload } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Selection } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { Suspense } from 'react'
import { isDevelopment } from '~/constants'
import { useControlStore } from '~/stores/useControlStore'
import { colors } from '~/utils/colors'
import { addToGlobalForE2e } from '~/utils/tests'
import { Controls } from './Controls'
import { Graph } from './Graph'
import { Lights } from './Lights'
import { Overlay } from './Overlay'

const Content = () => {
  const { universeColor, ssaoColor } = useControls('universe', {
    universeColor: colors.black,
    ssaoColor: 'black',
  })

  return (
    <>
      <color args={[universeColor]} attach="background" />

      <Lights />

      <Controls />

      <Selection>
        <Graph />
      </Selection>
    </>
  )
}

let wheelEventTimeout: ReturnType<typeof setTimeout> | null = null

export const Universe = () => (
  <>
    <Overlay />

    <Suspense fallback={null}>
      <Canvas
        camera={{
          aspect: 1920 / 1080,
          far: 30000,
          near: 1,
          position: [1000, 0, 5],
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
              useControlStore.setState({ isUserScrollingOnHtmlPanel: true })
            }
          }

          useControlStore.setState({ isUserScrolling: true })
          useControlStore.setState({ userMovedCamera: true })

          wheelEventTimeout = setTimeout(() => {
            useControlStore.setState({ isUserScrolling: false })
            useControlStore.setState({ isUserScrollingOnHtmlPanel: false })
          }, 200)
        }}
      >
        {isDevelopment && <Perf />}
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
