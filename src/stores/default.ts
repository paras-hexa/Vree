// src/stores/defaults.ts
import type { FrameProps, LensProps, TempleProps, UiProps } from "../types/configurator";

export const DEFAULTS: {
  frame: FrameProps;
  lenses: LensProps;
  temple: TempleProps;
  ui: UiProps;
} = {
  frame: {
    color: "#111827",
    texture: "./texture/original.jpg",
    metalness: 0.4,
    roughness: 0.6,
    transparency: 0,
  },
  lenses: {
    color: "#1f2937",
    transparency: 0.5,
  },
  temple: {
     color: "#111827",
    texture: "./texture/original.jpg",
    metalness: 0.4,
    roughness: 0.6,
    transparency: 0,
  },
  ui: {
    selectedPart: "frame",
    theme: "Dark",
  },
};
