import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/StoreContext";
const COLOR_IMAGES = [
    { value: "#ffffff", path: "/color/white.jpeg" },
    { value: "#f5deb3", path: "/color/sand.jpeg" },
    { value: "#ff0000", path: "/color/red.jpeg" },
    { value: "#00ff00", path: "/color/green.jpeg" },
    { value: "#0000ff", path: "/color/blue.jpeg" },
    { value: "#ffdab9", path: "/color/skin.jpeg" },

];

const TEXTURE_IMAGES = [
    "/texture/original.jpg",
    "/texture/texture1.png",
    "/texture/texture2.jpg",
    "/texture/texture3.jpg",

];

const PARTS = [
    { key: "frame", label: "Frame" },
    { key: "lens", label: "Lenses" },
    { key: "temple", label: "Temple" },
];

function getPartFromStore(store: any) {
    const sel = store.selectedPart;
    if (sel === "lens" || sel === "lenses") {
        return store.lenses ?? store.lens ?? store[sel];
    }
    return store[sel];
}

/** Thick, smooth slider with markers. Uses Tailwind; minimal inline style only for dynamic widths/positions */
function PointSlider({
    value,
    onChange,
    points = 6,
    min = 0,
    max = 1,
}: {
    value: number;
    onChange: (v: number) => void;
    points?: number;
    min?: number;
    max?: number;
}) {
    const markers = Array.from({ length: points }, (_, i) => i / (points - 1));
    const pct = Math.round(((value - min) / (max - min)) * 100);
    return (
        <div className="relative mb-6 px-1">
            {/* track background */}
            <div className="h-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden" />
            {/* filled track (dynamic width) */}
            <div
                className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-purple-700 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${pct}%` }}
            />
            {/* interactive markers */}
            <div className="absolute inset-0 pointer-events-none">
                {markers.map((m, i) => {
                    const val = min + (max - min) * m;
                    const leftPct = `${Math.round(m * 100)}%`;
                    const isActive = value >= val - 1e-6;
                    return (
                        <button
                            key={i}
                            onClick={() => onChange(parseFloat(val.toFixed(2)))}
                            className={`absolute -top-3 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-200 ${isActive
                                ? "bg-white border-purple-700 shadow-md pointer-events-auto"
                                : "bg-gray-200 dark:bg-gray-600 border-gray-300 pointer-events-auto"
                                }`}
                            style={{ left: leftPct }}
                            aria-label={`set ${val.toFixed(2)}`}
                            title={val.toFixed(2)}
                        />
                    );
                })}
            </div>

            {/* floating value bubble */}
            <div
                className="absolute -top-10 text-xs text-white px-3 py-1 rounded-full bg-purple-700 shadow-lg transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${pct}%` }}
            >
                {value.toFixed(2)}
            </div>

            {/* accessible range input (invisible but usable) */}
            <input
                type="range"
                min={min}
                max={max}
                step={(max - min) / 100}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full appearance-none bg-transparent absolute inset-0 opacity-0 cursor-pointer"
                aria-label="slider"
            />
        </div>
    );
}

const Sidebar: React.FC = observer(() => {
    const store = useStore();
    const current = getPartFromStore(store) ?? {};

    console.log(store);


    const selectTexture = (t: string) => store.updatePartProp(store.selectedPart, 'texture', t);
    const selectColor = (c: string) => store.updatePartProp(store.selectedPart, "color", c);
    const updateNumeric = (k: string, v: number) => store.updatePartProp(store.selectedPart, k, v);

    // compact theme helpers — store.theme expected to be 'dark'/'light' or similar
    const isDark = (store.theme ?? "").toString().toLowerCase() === "dark";

    return (
        <aside
            className={`
        basis-full lg:basis-2/5
        max-h-[calc(100vh-4rem)]
        mb-10 lg:my-8
        overflow-y-auto
        p-6 lg:p-8
        rounded-lg lg:rounded-none
        flex flex-col
        w-full lg:w-2/5 lg:max-w-[450px] overflow-auto
      `}
            style={{ backgroundImage: isDark ? "url('./background/sidebarbg.png')" : "url('./background/whitebg.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}
        >
            {/* Tabs */}
            <div className="flex gap-3 mb-6">
                {PARTS.map((p) => {
                    const active =
                        store.selectedPart === p.key ||
                        (p.key === "lens" && store.selectedPart === "lens");
                    return (
                        <button
                            key={p.key}
                            onClick={() => store.selectPart(p.key as any)}
                            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-shadow duration-200 ${active
                                ? "bg-gradient-to-r from-purple-700 to-pink-500 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                }`}
                        >
                            {p.label}
                        </button>
                    );
                })}
            </div>

            {/* Texture */}
            {(store.selectedPart === "frame" || store.selectedPart === "temple") && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-200">Texture</h3>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => selectTexture(null)}
                            className={`w-14 h-14 flex items-center justify-center rounded-lg cursor-pointer transition-shadow ${current.texture === null
                                ? "ring-2 ring-purple-600 bg-gradient-to-r from-purple-700 to-pink-500 text-white shadow-lg"
                                : "border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                }`}
                            title="No texture"
                        >
                            <span className="text-lg">⦸</span>
                        </button>

                        {TEXTURE_IMAGES.map((t) => {

                            const active = current.texture === "/texture/original.jpg"
                                ?  t === "/texture/original.jpg"
                                : current.texture === t;
                            console.log(current.texture , t);
                            
                            return (
                                <button
                                    key={t}
                                    onClick={() => selectTexture(t)}
                                    className={`w-14 h-14 rounded-lg bg-cover bg-center cursor-pointer transition-all ${active ? "ring-2 ring-purple-600 shadow-lg scale-105" : "border border-gray-200 dark:border-gray-700"
                                        }`}
                                    style={{ backgroundImage: `url(${t})` }}
                                    aria-pressed={active}
                                    title={t.split("/").pop()}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
            {/* Colors */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-200">Color</h3>
                <div className="flex gap-4 flex-wrap items-center">
                    {COLOR_IMAGES.map((c) => {
                        const active = current.color === "#ffffff" ? c.value === '#ffffff' : current.color===c.value;
                     
                        return (
                            <button
                                key={c.value}
                                onClick={() => selectColor(c.value)}
                                className={`w-10 h-10 rounded-full bg-cover bg-center cursor-pointer transition-all ${active ? "ring-2 ring-purple-600 shadow-md scale-105" : "border border-gray-200 dark:border-gray-700"
                                    }`}
                                style={{ backgroundImage: `url(${c.path})` }}
                                aria-pressed={active}
                                title={c.path.split("/").pop()}
                            />
                        );
                    })}

                    {/* custom color */}
                    <div className="flex items-center gap-3 ml-1">
                        <input
                            type="color"
                            
                            onChange={(e) => selectColor(e.target.value)}
                            className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer p-0"
                            aria-label="pick custom color"
                            style={{backgroundImage:"url('texture/custom.png"}}
                        />

                        <span className="text-xs text-gray-600 dark:text-gray-400">Custom</span>
                    </div>
                </div>
            </div>

            {/* Material Properties */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-200">Material Properties</h3>

                {"metalness" in current && (
                    <>
                        <div className="text-xs font-bold text-white  mb-5">Metallic</div>
                        <PointSlider value={Number(current.metalness ?? 0)} onChange={(v) => updateNumeric("metalness", v)} />
                    </>
                )}

                {"roughness" in current && (
                    <>
                        <div className="text-xs  font-bold text-white mb-5">Roughness</div>
                        <PointSlider value={Number(current.roughness ?? 0.5)} onChange={(v) => updateNumeric("roughness", v)} />
                    </>
                )}

                {"transparency" in current && (
                    <>
                        <div className="text-xs  font-bold text-white mb-5">Transparency</div>
                        <PointSlider value={Number(current.transparency ?? 0)} onChange={(v) => updateNumeric("transparency", v)} />
                    </>
                )}
            </div>

            {/* Bottom actions */}
            <div className="mt-auto flex gap-3 pt-4">
                <button
                    onClick={() => store.resetAll()}
                    className="flex-1 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    Reset
                </button>

                <button
                    onClick={() => store.saveToJson?.()}
                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-pink-500 text-white shadow hover:opacity-95 transition"
                >
                    Save
                </button>
            </div>
        </aside>
    );
});

export default Sidebar;
