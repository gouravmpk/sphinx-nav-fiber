import { useMemo } from "react";
import * as THREE from "three";
import { MeshStandardMaterial } from "three";

const loader = new THREE.TextureLoader();

const cachedMaterials: Record<string, THREE.MeshStandardMaterial> = {};

export const useMaterial = (url: string, highlight: boolean) => {


  const material = useMemo(() => {
    const map = loader.load(url);

    const materialProp = highlight  ?
      {
        emissive: "green",
        emissiveIntensity: 20,
        map,
        opacity: 0.5,
        toneMapped: false,
        transparent: true,
      } : { map };

    const m = new MeshStandardMaterial(materialProp);

    cachedMaterials[url] = m;

    return m;
  }, [url, highlight]);

  return material;
};
