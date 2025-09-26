import { observer } from "mobx-react-lite";
import { useStore } from "../stores/StoreContext";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Model = observer(() => {
  const store = useStore();
  const { nodes } = useGLTF("./glbs/sampleModel.glb") as any;

  return (
    <group>
      {/* Frame */}
      {nodes.frame && (
        <mesh geometry={nodes.frame.geometry}>
          <meshStandardMaterial
            attach="material"
            color={store.frame.color}
            roughness={store.frame.roughness}
            metalness={store.frame.metalness}
            transparent={store.frame.transparency > 0}
            opacity={1 - store.frame.transparency}
          />
        </mesh>
      )}

      {/* Lenses */}
      {nodes.right_lens && (
        <mesh geometry={nodes.right_lens.geometry}>
          <meshStandardMaterial
            attach="material"
            color={store.lens.color}
            transparent={true}
            opacity={1 - store.lens.transparency}
           
          />
        </mesh>
      )}
      {nodes.left_lens && (
        <mesh geometry={nodes.left_lens.geometry}>
          <meshStandardMaterial
            attach="material"
            color={store.lens.color}
            transparent={true}
            opacity={1 - store.lens.transparency}
           
          />
        </mesh>
      )}

      {/* Temples */}
      {nodes.right_temple && (
        <mesh geometry={nodes.right_temple.geometry}>
          <meshStandardMaterial
            attach="material"
            color={store.temple.color}
            roughness={store.temple.roughness}
            metalness={store.temple.metalness ?? 0}
          />
        </mesh>
      )}
      {nodes.left_temple && (
        <mesh geometry={nodes.left_temple.geometry}>
          <meshStandardMaterial
            attach="material"
            color={store.temple.color}
            roughness={store.temple.roughness}
            metalness={store.temple.metalness ?? 0}
          />
        </mesh>
      )}
    </group>
  );
});

useGLTF.preload("./glbs/sampleModel.glb");

export default Model