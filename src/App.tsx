import "./App.css";
import { observer } from "mobx-react-lite";
import { useStore } from "./stores/StoreContext";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";

import Model from "./Components/Model";
const App = observer(() => {
  const store = useStore();
  const current = store[store.selectedPart];
  const model = useGLTF('./glbs/sampleModel.glb')
  if (!current) {
    return <div>Loading store...</div>;
  }

  return (<>

   <Canvas>
    <ambientLight intensity={5}/>
    <OrbitControls/>
<Model/>
   </Canvas>




    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        background: store.theme === "Dark" ? "#1f2937" : "#f9fafb",
        color: store.theme === "Dark" ? "#f9fafb" : "#111827",
        minHeight: "100vh",
      }}
    >
      <h1>Configurator Test</h1>

      {/* Theme Toggle */}
      <button
        onClick={() => store.toggleTheme()}
        style={{
          padding: "8px 16px",
          marginBottom: "20px",
          cursor: "pointer",
          borderRadius: "8px",
          border: "none",
          background: store.theme === "Dark" ? "#374151" : "#e5e7eb",
          color: store.theme === "Dark" ? "#f9fafb" : "#111827",
        }}
      >
        Switch to {store.theme === "Dark" ? "Light" : "Dark"} Mode
      </button>

      {/* Part Selector */}
      <label>
        Select Part:
        <select
          value={store.selectedPart}
          onChange={(e) => store.selectPart(e.target.value as any)}
          style={{ marginLeft: "10px" }}
        >
          <option value="frame">Frame</option>
          <option value="lens">Lens</option>
          <option value="temple">Temple</option>
        </select>
      </label>

      {/* Color Picker */}
      <div style={{ marginTop: "20px" }}>
        <label>
          Color:
          <input
            type="color"
            value={current.color}
            onChange={(e) =>
              store.updatePartProp(
                store.selectedPart,
                "color",
                (e.target as HTMLInputElement).value
              )
            }
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      {/* Roughness + Metalness only for frame & temple */}
      {("roughness" in current || "metalness" in current) && (
        <div style={{ marginTop: "20px" }}>
          {"roughness" in current && (
            <label>
              Roughness: {current.roughness}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={current.roughness as number}
                onChange={(e) =>
                  store.updatePartProp(
                    store.selectedPart,
                    "roughness",
                    parseFloat((e.target as HTMLInputElement).value)
                  )
                }
                style={{ marginLeft: "10px" }}
              />
            </label>
          )}

          {"metalness" in current && (
            <label style={{ marginLeft: "20px" }}>
              Metalness: {current.metalness}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={current.metalness as number}
                onChange={(e) =>
                  store.updatePartProp(
                    store.selectedPart,
                    "metalness",
                    parseFloat((e.target as HTMLInputElement).value)
                  )
                }
                style={{ marginLeft: "10px" }}
              />
            </label>
          )}
        </div>
      )}

      {/* Transparency (if available) */}
      {"transparency" in current && (
        <div style={{ marginTop: "20px" }}>
          <label>
            Transparency: {current.transparency}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={current.transparency as number}
              onChange={(e) =>
                store.updatePartProp(
                  store.selectedPart,
                  "transparency",
                  parseFloat((e.target as HTMLInputElement).value)
                )
              }
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
      )}

      {/* Debug JSON */}
      <pre
        style={{
          marginTop: "20px",
          background: store.theme === "Dark" ? "#374151" : "#e5e7eb",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {JSON.stringify(store.toJSON(), null, 2)}
      </pre>
    </div>
    </>
  );
});

export default App;
