// src/stores/defaults.ts
import type { FrameProps, LensProps, TempleProps, UiProps } from "../types/configurator";

export const DEFAULTS: {
  frame: FrameProps;
  lenses: LensProps;
  temple: TempleProps;
  ui: UiProps;
} = {
  frame: {
    color: "#ffffff",
    texture: "/texture/original.jpg",
    metalness: 0.2,
    roughness: 0.1,
    transparency: 0,
  },
  lenses: {
    color: "#ffffff",
    transparency: 0.8,
  },
  temple: {
     color: "#ffffff",
    texture: "/texture/original.jpg",
    metalness: 0.1,
    roughness: 0.2,
    transparency: 0,
  },
  ui: {
    selectedPart: "frame",
    theme: "Dark",
  },
};
