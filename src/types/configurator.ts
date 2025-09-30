export type Part = 'frame' | 'lens' | 'temple';

export interface FrameProps {
    color: string;
    texture: string|null ;
    metalness: number;
    roughness: number;
    transparency: number;
}

export interface LensProps {
    color: string;
    transparency: number;
}

export interface TempleProps {
    color: string;
    texture: string | null;
    metalness: number;
    roughness: number;
    transparency: number;
}

export interface UiProps {
    selectedPart: Part;
    theme: "Light" | "Dark";

}

export interface ConfigJSON {
    glbUrl: string;
    groups: {
        displayName: string;
        meshNode: string[];
        selectedTexture: string | null;
        selectedColor: string | null;
        roughness: number;
        metalness: number;
        transparency: number;
        availableTextures?: string[];
    }[];
    textures: string[];
    colors: (string | "Custom")[];
}