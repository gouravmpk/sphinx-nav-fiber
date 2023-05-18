import { useEffect, useState } from 'react'
import { MeshStandardMaterial, TextureLoader } from 'three'

const loader = new TextureLoader()

type materialRecord = {
  texture: THREE.Texture
  material: THREE.MeshStandardMaterial
}

const cachedMaterials: Record<string, materialRecord> = {}

const noImageTexture = loader.load('noimage.jpeg')
const noImageMaterial = new MeshStandardMaterial({ map: noImageTexture })

export const useMaterial = (url: string) => {
  const [texture, setTexture] = useState(noImageTexture)
  const [material, setMaterial] = useState(noImageMaterial)

  useEffect(() => {
    const cashPath = `${url}`

    if (cachedMaterials[cashPath]) {
      setTexture(cachedMaterials[cashPath].texture)
      setMaterial(cachedMaterials[cashPath].material)

      return
    }

    const map = loader.load(url, undefined, undefined, () => {
      // on error, set blank meterial
      cachedMaterials[cashPath].texture = noImageTexture
      cachedMaterials[cashPath].material = noImageMaterial
      setTexture(noImageTexture)
      setMaterial(noImageMaterial)
    })

    if (map) {
      const newMaterial = new MeshStandardMaterial({ map })

      cachedMaterials[cashPath] = {
        texture: map,
        material: newMaterial,
      }

      setTexture(map)
      setMaterial(newMaterial)
    }
  }, [url])

  useEffect(
    () =>
      function cleanup() {
        texture.dispose()
        material.dispose()
      },
    [texture, material],
  )

  return material
}
