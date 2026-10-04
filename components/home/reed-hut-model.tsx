'use client';

import { Component, Suspense, useMemo, useEffect, type ReactNode } from 'react';
import { useThree } from '@react-three/fiber';
import { useFBX, Center, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

export const REED_HUT_MODEL_PATH = '/models/reed-hut/lowpoly_Reed_Hut_01.fbx';

const THATCH_COLOR = '#c4a574';
const WOOD_COLOR = '#6b4f3a';

const PANORAMA_DISTANCE = 11;
const ZOOM_MIN = 4;
const ZOOM_MAX = 18;

interface ReedHutModelProps {
  mouse: { x: number; y: number };
  scrollProgress?: number;
}

function normalizeMaterials(mesh: THREE.Mesh) {
  const sourceMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

  const newMats = sourceMats.map((mat) => {
    const baseColor =
      mat && 'color' in mat && mat.color instanceof THREE.Color
        ? mat.color
        : new THREE.Color(THATCH_COLOR);

    const hsl = { h: 0, s: 0, l: 0 };
    baseColor.getHSL(hsl);
    const isWood = mesh.name.toLowerCase().includes('wood') || hsl.l < 0.35;

    return new THREE.MeshStandardMaterial({
      color: isWood ? WOOD_COLOR : THATCH_COLOR,
      roughness: 0.88,
      metalness: 0.03,
      side: THREE.DoubleSide
    });
  });

  mesh.material = newMats.length === 1 ? newMats[0]! : newMats;
}

function PanoramaCameraRig() {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;

  useEffect(() => {
    if (!controls || !(camera instanceof THREE.PerspectiveCamera)) return;

    controls.target.set(0, 0.55, 0);
    controls.minDistance = ZOOM_MIN;
    controls.maxDistance = ZOOM_MAX;
    controls.minPolarAngle = THREE.MathUtils.degToRad(18);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(72);

    const offset = new THREE.Vector3(0.85, 0.38, 1)
      .normalize()
      .multiplyScalar(PANORAMA_DISTANCE);
    camera.position.copy(controls.target).add(offset);
    camera.lookAt(controls.target);
    controls.update();
  }, [camera, controls]);

  return null;
}

/** Simple placeholder hut if the FBX fails to load */
export function FallbackHut() {
  return (
    <group rotation={[0, -Math.PI * 0.22, 0]} position={[0, -0.15, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.9, 1.1]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <coneGeometry args={[1.35, 1.1, 6]} />
        <meshStandardMaterial color={THATCH_COLOR} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial color="#0c4a6e" roughness={1} />
      </mesh>
    </group>
  );
}

class ModelErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <FallbackHut />;
    return this.props.children;
  }
}

function ReedHutMesh() {
  const fbx = useFBX(REED_HUT_MODEL_PATH);

  const scene = useMemo(() => {
    const clone = fbx.clone(true);

    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      normalizeMaterials(mesh);
    });

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    clone.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) clone.scale.setScalar(2.4 / maxDim);

    return clone;
  }, [fbx]);

  return (
    <Center>
      <primitive object={scene} rotation={[0, -Math.PI * 0.22, 0]} />
    </Center>
  );
}

export function ReedHutSceneContent(_props: ReedHutModelProps) {
  return (
    <>
      <color attach="background" args={['#0f2744']} />
      <hemisphereLight args={['#7dd3fc', '#1e3a5f', 0.75]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 10, 5]} intensity={1.8} color="#fff8e7" />
      <directionalLight position={[-5, 4, 6]} intensity={0.6} color="#7dd3fc" />
      <directionalLight position={[0, 2, -7]} intensity={0.4} color="#38bdf8" />

      <ModelErrorBoundary>
        <Suspense fallback={<FallbackHut />}>
          <ReedHutMesh />
        </Suspense>
      </ModelErrorBoundary>

      <OrbitControls
        makeDefault
        enableZoom
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        zoomSpeed={1.1}
        rotateSpeed={0.5}
        autoRotate
        autoRotateSpeed={0.35}
      />
      <PanoramaCameraRig />
    </>
  );
}

useFBX.preload(REED_HUT_MODEL_PATH);
