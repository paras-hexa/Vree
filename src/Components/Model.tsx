import { observer } from "mobx-react-lite";
import { useStore } from "../stores/StoreContext";
import { Html, useGLTF, useTexture } from "@react-three/drei";

const Model = observer(() => {
  const store = useStore();
  const { nodes } = useGLTF("/glbs/sampleModel.glb") as any;

  // textures load dynamically from store
  const frameTexture = store.frame.texture ? useTexture(store.frame.texture) : null;
  const lensTexture = store.lens.texture ? useTexture(store.lens.texture) : null;
  const templeTexture = store.temple.texture ? useTexture(store.temple.texture) : null;

  const parts = [
    { key: "frame", label: "Frame", node: nodes.frame },
    { key: "lens", label: "Lenses", node: nodes.right_lens },
    { key: "temple", label: "Temples", node: nodes.right_temple },
  ];

  return (
    <group>
      {/* Frame */}
      {nodes.frame && (
        <mesh geometry={nodes.frame.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={store.frame.color}
            map={frameTexture || undefined}   // texture from store
            roughness={store.frame.roughness}
            metalness={store.frame.metalness}
            transparent
            opacity={1 - store.frame.transparency}
          />
        </mesh>
      )}

      {/* Lenses */}
      {nodes.right_lens && (
        <mesh geometry={nodes.right_lens.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={store.lens.color}
            map={lensTexture || undefined}
            transparent
            opacity={1 - store.lens.transparency}
          />
        </mesh>
      )}
      {nodes.left_lens && (
        <mesh geometry={nodes.left_lens.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={store.lens.color}
            map={lensTexture || undefined}
            transparent
            opacity={1 - store.lens.transparency}
          />
        </mesh>
      )}

      {/* Temples */}
      {nodes.right_temple && (
        <mesh geometry={nodes.right_temple.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={store.temple.color}
            map={templeTexture || undefined}
            roughness={store.temple.roughness}
            metalness={store.temple.metalness ?? 0}
            transparent
            opacity={1 - store.temple.transparency}
          />
        </mesh>
      )}
      {nodes.left_temple && (
        <mesh geometry={nodes.left_temple.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={store.temple.color}
            map={templeTexture || undefined}
            roughness={store.temple.roughness}
            metalness={store.temple.metalness ?? 0}
            transparent
            opacity={1 - store.temple.transparency}
          />
        </mesh>
      )}
    </group>
  );
});

useGLTF.preload("/glbs/sampleModel.glb");
export default Model;
