import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useTexture } from "@react-three/drei";
import Model from "./Model";
import { useRef } from "react";
import * as THREE from "three";
import { ShadowMaterial } from "three";

function ShadowPlane({ size = 4, y = -0.02, opacity = 0.6 }) {
  // load your shadow texture (a soft radial png or jpg)
  const shadowTexture = useTexture("/texture/shadow.jpg");
  // ensure correct encoding for color textures (optional)
  if (shadowTexture) shadowTexture.encoding = THREE.sRGBEncoding;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, y, 0]}
      receiveShadow
    >
      <planeGeometry args={[size, size]} />
      {/* Use meshStandardMaterial so lighting/shadows blend nicely.
          The texture should be a dark radial/soft shadow image with transparency. */}
      <shadowMaterial
        map={shadowTexture}
        transparent
        opacity={opacity}
        depthWrite={false} // prevents z-fighting with model
        toneMapped={false} // keep shadow appearance consistent
      />
    </mesh>
  );
}

export default function ModelViewer() {
  const dirRef = useRef();

  return (
    <div className="flex-1 ">
      <Canvas
        shadows
        camera={{ position: [0, 1.4, 3.5], fov: 50 }}
      >
        {/* Ambient to lift shadows a bit */}
        <ambientLight intensity={0.35} />

        {/* Directional light for crisp shadows */}
        <directionalLight
          ref={dirRef}
          position={[3, 6, 3]}
          intensity={1.0}
          castShadow
          // shadow map resolution
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          // bias to reduce shadow acne
          shadow-bias={-0.0005}
          // tune camera to cover model area (orthographic camera used for directional light shadows)
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
        />

        {/* Optionally add a subtle spot or fill */}
        <pointLight position={[-5, 2, -5]} intensity={0.2} />

        <OrbitControls makeDefault enableDamping />

        {/* Place your model slightly above the shadow plane origin */}
        <group position={[0, 0.02, 0]}>
          <Model />
        </group>

        {/* Static shadow decal plane — tweak size/position to match model */}
        <ShadowPlane size={3.2} y={-0.4} opacity={0.2} />

        {/* Environment for reflections */}
       <Environment
      files="./environment/brown_photostudio_02_1k.hdr"
  
    />
      </Canvas>
    </div>
  );
}
