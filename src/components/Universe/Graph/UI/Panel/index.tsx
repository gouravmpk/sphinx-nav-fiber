import { Float, Text, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Color, Group, Mesh, Vector3 } from 'three'
import { defaultBoostAmount, notify } from '~/components/Booster'
import { BOOST_ERROR_BUDGET, BOOST_SUCCESS } from '~/constants'
import { useAppStore } from '~/stores/useAppStore'
import { useDataStore, useSelectedNode } from '~/stores/useDataStore'
import { boost } from '~/utils/boost'
import { fontProps } from '../../Cubes/Text/constants'
import { stopBubbling } from '../constants'
import { AudioPlayer } from './AudioPlayer'
import { VideoPlayer } from './VideoPlayer'
import { getNodeSearchableName, noBoostNodeTypes } from './constants'

// The Panel component, will always stay at the top of the screen

const panelWidth = 40
const panelHeight = 10

const renderOrder = 99999999

const panelColor = new Color('blue')
const boostedColor = new Color('yellow')
const white = new Color('white')

export const Panel = () => {
  const panelRef = useRef<Group>(null)

  const panelTextRef = useRef<Mesh>(null)
  const boostIconRef = useRef<Mesh>(null)

  const panelBoardRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState('')
  const [boosting, setBoosting] = useState(false)
  const [boosted, setBoosted] = useState(false)
  const [boostColor] = useState(new Color('#49c998'))

  const setSelectedNode = useDataStore((s) => s.setSelectedNode)

  const setCurrentSearch = useAppStore((s) => s.setCurrentSearch)
  const setGuiRef = useDataStore((s) => s.setGuiRef)

  const offset = useMemo(() => {
    return new Vector3(0, 28, -100)
  }, []) // Offset from the camera's position

  const selectedNode = useSelectedNode()

  const boltTexture = useTexture('icons/bolt_white.svg')
  const closeTexture = useTexture('icons/close_white.svg')

  useLayoutEffect(() => {
    setGuiRef(panelRef)
  }, [])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  useFrame(({ camera }) => {
    if (panelRef.current) {
      // Create a new copy of the offset
      const offsetCopy = offset.clone()

      // Apply the camera's rotation to the offset copy
      offsetCopy.applyQuaternion(camera.quaternion)

      // Copy the camera's position and rotation to the panel
      panelRef.current.position.copy(camera.position)
      panelRef.current.quaternion.copy(camera.quaternion)

      // Add the rotated offset to the panel's position
      panelRef.current.position.add(offsetCopy)
    }
  })

  const searchableName = useMemo(() => {
    if (selectedNode) {
      return getNodeSearchableName(selectedNode)
    }

    return ''
  }, [selectedNode])

  const panelText = useMemo(() => {
    let text = selectedNode?.node_type || ''
    if (hovered === 'boost') {
      text = 'boost node'
    } else if (hovered === 'search') {
      text = 'search'
    }

    return text.toUpperCase()
  }, [selectedNode, hovered])

  const boostEnabled = useMemo(() => !noBoostNodeTypes.includes(selectedNode?.node_type || ''), [selectedNode])

  const doBoost = async () => {
    if (boosting || !selectedNode?.ref_id) {
      return
    }

    setBoosting(true)

    // eslint-disable-next-line no-useless-catch
    try {
      await boost(selectedNode?.ref_id, defaultBoostAmount)
      setBoosted(true)
      notify(BOOST_SUCCESS)
    } catch (e) {
      notify(BOOST_ERROR_BUDGET)
    }

    setBoosting(true)
  }

  const boostIconColor = useMemo(() => {
    if (boosted) {
      return boostedColor
    }
    if (hovered === 'boost') {
      return white
    }
    return boostColor
  }, [hovered, boosted])

  const {} = selectedNode || {}

  return (
    <group
      ref={panelRef}
      visible={!!selectedNode}
      onClick={stopBubbling}
      onPointerDown={stopBubbling}
      onPointerUp={stopBubbling}
    >
      <Float floatIntensity={0.1} speed={1}>
        <group position-y={-50}>
          <VideoPlayer />
          <AudioPlayer />
        </group>
      </Float>

      <Float floatIntensity={10} speed={6}>
        <mesh
          renderOrder={renderOrder}
          ref={panelBoardRef}
          receiveShadow
          onPointerEnter={() => {
            setHovered('search')
          }}
          onPointerLeave={() => {
            setHovered('')
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
            setCurrentSearch(searchableName || '')
          }}
        >
          <planeGeometry args={[panelWidth, panelHeight]} />
          <meshStandardMaterial color={panelColor} transparent opacity={hovered === 'search' ? 0.9 : 0.4} />
        </mesh>

        <group position-z={2}>
          <group position-y={-0.1}>
            <Text renderOrder={renderOrder} {...fontProps} lineHeight={0.5} fontSize={4}>
              {searchableName}
            </Text>
          </group>

          <group position-y={9}>
            <Text position-y={-0.2} ref={panelTextRef} renderOrder={renderOrder} {...fontProps} fontSize={2.5}>
              {panelText}
            </Text>

            <group position-x={panelWidth / 2 - 4} scale={2}>
              <mesh
                onPointerEnter={() => {
                  setHovered('close')
                }}
                onPointerLeave={() => {
                  setHovered('')
                }}
                onPointerDown={() => {
                  setSelectedNode(null)
                }}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <circleGeometry args={[1.5, 40]} />
                <meshBasicMaterial alphaMap={closeTexture} color={white} map={closeTexture} transparent />
              </mesh>
            </group>

            {boostEnabled && (
              <group position-x={-(panelWidth / 2) + 4} scale={2}>
                <mesh
                  visible={!boosted && hovered === 'boost'}
                  onPointerEnter={() => {
                    setHovered('boost')
                  }}
                  onPointerLeave={() => {
                    setHovered('')
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    doBoost()
                  }}
                  onPointerUp={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <circleGeometry args={[1.8, 30]} />
                  <meshBasicMaterial color={boostColor} />
                </mesh>

                <mesh renderOrder={renderOrder} ref={boostIconRef}>
                  <circleGeometry args={[1.5, 40]} />
                  <meshBasicMaterial color={boostIconColor} map={boltTexture} alphaMap={boltTexture} transparent />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </Float>
    </group>
  )
}
