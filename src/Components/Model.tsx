import { useGLTF, useTexture, Html, useProgress } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/StoreContext";
import { DEFAULTS } from "../stores/default";
import { useMemo, Suspense, useRef, useEffect } from "react";

/* ------------------ Loader Component ------------------ */
const Loader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center">
        <img
          src="./icons/loader.svg"
          alt="Loading..."
          className="w-16 h-16 animate-spin"
        />
        <p className="mt-3 text-sm text-gray-200 font-medium">
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
};

const ModelContent = observer(() => {
  const store = useStore();
  const { nodes } = useGLTF("/glbs/sampleModel.glb") as any;

  const frameTextureUrl = store.frame.texture || DEFAULTS.frame.texture;
  const templeTextureUrl = store.temple.texture || DEFAULTS.temple.texture;

  const frameTexture = useTexture(frameTextureUrl);
  const templeTexture = useTexture(templeTextureUrl);

  const frameMap = useMemo(
    () =>
      store.frame.texture && store.frame.texture !== "none" ? frameTexture : null,
    [store.frame.texture, frameTexture]
  );

  const templeMap = useMemo(
    () =>
      store.temple.texture && store.temple.texture !== "none" ? templeTexture : null,
    [store.temple.texture, templeTexture]
  );

  // ✅ refs for materials
  const frameMatRef = useRef<any>(null);
  const rightTempleMatRef = useRef<any>(null);
  const leftTempleMatRef = useRef<any>(null);

  // ✅ force update material when texture is removed/switched
  useEffect(() => {
    if (frameMatRef.current) {
      frameMatRef.current.map = frameMap || null;
      frameMatRef.current.needsUpdate = true;
    }
  }, [frameMap]);

  useEffect(() => {
    if (rightTempleMatRef.current) {
      rightTempleMatRef.current.map = templeMap || null;
      rightTempleMatRef.current.needsUpdate = true;
    }
    if (leftTempleMatRef.current) {
      leftTempleMatRef.current.map = templeMap || null;
      leftTempleMatRef.current.needsUpdate = true;
    }
  }, [templeMap]);

  useGLTF.preload("/glbs/sampleModel.glb");

  return (
    <group>
      {/* FRAME */}
      {nodes.frame && (
        <mesh geometry={nodes.frame.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            ref={frameMatRef}
            color={store.frame.color || "#cccccc"}
            map={frameMap}
            roughness={store.frame.roughness}
            metalness={store.frame.metalness}
            transparent
            opacity={1 - store.frame.transparency}
          />
          <Html position={[-0.01, 0, 0]} wrapperClass="label">
            <div>
              <label>
                <input
                  type="radio"
                  value="frame"
                  name="active"
                  checked={store.selectedPart == "frame"}
                  onChange={() => {
                    store.selectPart("frame");
                  }}
                  radioGroup="active"
                />
                Frame
              </label>
            </div>
          </Html>
        </mesh>
      )}

      {/* LENSES */}
      {nodes.right_lens && (
        <mesh geometry={nodes.right_lens.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={store.lens.color || "#a0c8ff"}
            transparent
            opacity={1 - store.lens.transparency}
          />
          <Html position={[0.6, 0.1, 0]} wrapperClass="label">
            <div>
              <label>
                <input
                  type="radio"
                  value="lens"
                  name="active"
                  checked={store.selectedPart == "lens"}
                  onChange={() => {
                    store.selectPart("lens");
                  }}
                />
                Lens
              </label>
            </div>
          </Html>
        </mesh>
      )}
      {nodes.left_lens && (
        <mesh geometry={nodes.left_lens.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            color={store.lens.color || "#a0c8ff"}
            transparent
            opacity={1 - store.lens.transparency}
          />
        </mesh>
      )}

      {/* TEMPLES */}
      {nodes.right_temple && (
        <mesh geometry={nodes.right_temple.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            ref={rightTempleMatRef}
            color={store.temple.color || "#cccccc"}
            map={templeMap}
            roughness={store.temple.roughness}
            metalness={store.temple.metalness ?? 0}
            transparent
            opacity={1 - store.temple.transparency}
          />
          <Html position={[1, 0.1, -1.2]} wrapperClass="label">
            <div>
              <label>
                <input
                  type="radio"
                  value="temple"
                  name="active"
                  checked={store.selectedPart == "temple"}
                  onChange={() => {
                    store.selectPart("temple");
                  }}
                />
                Temple
              </label>
            </div>
          </Html>
        </mesh>
      )}
      {nodes.left_temple && (
        <mesh geometry={nodes.left_temple.geometry} castShadow receiveShadow>
          <meshStandardMaterial
            ref={leftTempleMatRef}
            color={store.temple.color || "#cccccc"}
            map={templeMap}
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

const Model = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ModelContent />
    </Suspense>
  );
};

export default Model;
