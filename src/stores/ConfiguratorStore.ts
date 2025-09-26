// src/stores/ConfiguratorStore.ts
import { makeAutoObservable } from "mobx";
import { DEFAULTS } from "./default";
import type { FrameProps, LensProps, TempleProps, Part, UiProps, ConfigJSON } from "../types/configurator";

export default class ConfiguratorStore {
  frame: FrameProps = { ...DEFAULTS.frame };
  lens: LensProps = { ...DEFAULTS.lenses };
  temple: TempleProps = { ...DEFAULTS.temple };
  selectedPart: Part = DEFAULTS.ui.selectedPart;
  theme: UiProps["theme"] = DEFAULTS.ui.theme;

  constructor() {
    makeAutoObservable(this);
  }

  // selection
  selectPart(part: Part) {
    this.selectedPart = part;
  }

  // generic update
updatePartProp<
  T extends "frame" | "lens" | "temple",
  K extends keyof ConfiguratorStore[T]
>(
  part: T,
  key: K,
  value: ConfiguratorStore[T][K]
) {
  (this as ConfiguratorStore)[part] = {
    ...this[part],
    [key]: value,
  } as ConfiguratorStore[T];
}

  // reset single part
  resetPart(part: Part) {
    if (part === "frame") this.frame = { ...DEFAULTS.frame };
    if (part === "lens") this.lens = { ...DEFAULTS.lenses };
    if (part === "temple") this.temple = { ...DEFAULTS.temple };
  }

  // reset everything
  resetAll() {
    this.frame = { ...DEFAULTS.frame };
    this.lens = { ...DEFAULTS.lenses };
    this.temple = { ...DEFAULTS.temple };
    this.selectedPart = DEFAULTS.ui.selectedPart;
    this.theme = DEFAULTS.ui.theme;
  }

  // theme
  toggleTheme() {
    this.theme = this.theme === "Dark" ? "Light" : "Dark";
    this._applyThemeToDocument();
  }

  setTheme(t: "Dark" | "Light") {
    this.theme = t;
    this._applyThemeToDocument();
  }

  private _applyThemeToDocument() {
    try {
      const root = document.documentElement;
      if (this.theme === "Dark") {
        root.classList.add("theme-dark");
        root.classList.remove("theme-light");
      } else {
        root.classList.add("theme-light");
        root.classList.remove("theme-dark");
      }
    } catch {
      // ignore if no DOM
    }
  }

  // export JSON
  saveToJson(filename = "goggles-config.json") {
    const payload = this.toJSON();
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // get plain object
  toJSON() {
    return {
      frame: this.frame,
      lenses: this.lens,
      temple: this.temple,
      selectedPart: this.selectedPart,
      theme: this.theme,
      meta: {
        createdAt: new Date().toISOString(),
        version: "1.0",
      },
    };
  }

  // load JSON
  loadFromObject(obj: Partial<ReturnType<ConfiguratorStore["toJSON"]>>) {
    if (obj.frame) this.frame = { ...this.frame, ...obj.frame };
    if (obj.lenses) this.lens = { ...this.lens, ...obj.lenses };
    if (obj.temple) this.temple = { ...this.temple, ...obj.temple };
    if (obj.selectedPart) this.selectedPart = obj.selectedPart as Part;
    if (obj.theme) this.setTheme(obj.theme as "Dark" | "Light");
  }

  // apply preset
  applyPreset(preset: Partial<ReturnType<ConfiguratorStore["toJSON"]>>) {
    if (!preset) return;
    this.loadFromObject(preset);
  }
}
