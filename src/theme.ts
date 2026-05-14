export type ColorMode = "system" | "light" | "dark";
export type ThemeId =
  | "codex"
  | "claude"
  | "google"
  | "openai"
  | "github"
  | "vercel"
  | "linear"
  | "notion"
  | "fluent"
  | "stripe";

export type ThemePalette = {
  id: ThemeId;
  name: string;
  description: string;
  preview: [string, string, string];
  light: Record<string, string>;
  dark: Record<string, string>;
};

const codexLight = {
  "color-scheme": "light",
  bg: "#f6f7f8",
  "bg-soft": "#eef3f2",
  surface: "#ffffff",
  "surface-raised": "#fbfcfc",
  topbar: "rgba(255, 255, 255, 0.88)",
  text: "#1c2024",
  "text-strong": "#0f1115",
  muted: "#667085",
  line: "#dfe5e7",
  accent: "#23847d",
  "accent-strong": "#12645f",
  "accent-soft": "#dff3f0",
  success: "#1f8a4c",
  "success-soft": "#e3f6ea",
  danger: "#d1433f",
  "danger-soft": "#fde8e7",
  warning: "#b76813",
  "warning-soft": "#fff1d6",
  "chart-a": "#23847d",
  "chart-b": "#3b82f6",
  "chart-c": "#8b5cf6",
  "on-accent": "#ffffff",
  shadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
  glow: "rgba(35, 132, 125, 0.18)",
};

const codexDark = {
  "color-scheme": "dark",
  bg: "#0f1115",
  "bg-soft": "#15191f",
  surface: "#171a20",
  "surface-raised": "#1e232b",
  topbar: "rgba(20, 23, 29, 0.88)",
  text: "#dfe5ea",
  "text-strong": "#f7f8fa",
  muted: "#9aa4b2",
  line: "#2a3038",
  accent: "#5cc8bd",
  "accent-strong": "#88ddd4",
  "accent-soft": "#173b38",
  success: "#69d28f",
  "success-soft": "#173723",
  danger: "#ff817c",
  "danger-soft": "#401e21",
  warning: "#f1b55f",
  "warning-soft": "#3b2a13",
  "chart-a": "#5cc8bd",
  "chart-b": "#7ab7ff",
  "chart-c": "#a78bfa",
  "on-accent": "#071211",
  shadow: "0 1px 2px rgba(0, 0, 0, 0.34)",
  glow: "rgba(92, 200, 189, 0.16)",
};

export const themes = [
  {
    id: "codex",
    name: "Codex",
    description: "Neutral graphite with technical teal accents.",
    preview: ["#0f1115", "#23847d", "#5cc8bd"],
    light: codexLight,
    dark: codexDark,
  },
  {
    id: "claude",
    name: "Claude",
    description: "Warm parchment, charcoal, and terracotta.",
    preview: ["#f5eee4", "#c15f3c", "#5f6f64"],
    light: { ...codexLight, bg: "#f7f1e8", "bg-soft": "#efe4d6", surface: "#fffaf3", "surface-raised": "#fbf4ea", topbar: "rgba(255, 250, 243, 0.88)", text: "#29211d", "text-strong": "#16110f", muted: "#766b62", line: "#e1d4c6", accent: "#c15f3c", "accent-strong": "#9a4328", "accent-soft": "#f5dfd2", success: "#5f7c5e", "success-soft": "#e6f0df", warning: "#a96927", "warning-soft": "#f7ead2", glow: "rgba(193, 95, 60, 0.18)" },
    dark: { ...codexDark, bg: "#161311", "bg-soft": "#211b17", surface: "#231d19", "surface-raised": "#2b231f", topbar: "rgba(35, 29, 25, 0.88)", text: "#eee4d9", "text-strong": "#fff8ee", muted: "#b8aa9c", line: "#3a302a", accent: "#e28b67", "accent-strong": "#f1ad8d", "accent-soft": "#4b2b20", success: "#93bd80", "success-soft": "#27351f", warning: "#e0b56f", "warning-soft": "#3d2e18", glow: "rgba(226, 139, 103, 0.16)" },
  },
  {
    id: "google",
    name: "Google",
    description: "Material blue with red, yellow, and green support.",
    preview: ["#1a73e8", "#188038", "#fbbc04"],
    light: { ...codexLight, bg: "#f7f8fb", "bg-soft": "#edf3fe", accent: "#1a73e8", "accent-strong": "#0b57d0", "accent-soft": "#e8f0fe", success: "#188038", "success-soft": "#e6f4ea", danger: "#d93025", "danger-soft": "#fce8e6", warning: "#b06000", "warning-soft": "#fef7e0", "chart-a": "#1a73e8", "chart-b": "#34a853", "chart-c": "#fbbc04", glow: "rgba(26, 115, 232, 0.18)" },
    dark: { ...codexDark, bg: "#101418", "bg-soft": "#151b23", accent: "#8ab4f8", "accent-strong": "#aecbfa", "accent-soft": "#1d3458", success: "#81c995", "success-soft": "#173b25", danger: "#f28b82", "danger-soft": "#3f2020", warning: "#fdd663", "warning-soft": "#3d3213", "chart-a": "#8ab4f8", "chart-b": "#81c995", "chart-c": "#fdd663", glow: "rgba(138, 180, 248, 0.16)" },
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Quiet black, white, gray, and soft green.",
    preview: ["#111111", "#10a37f", "#f7f7f5"],
    light: { ...codexLight, bg: "#f7f7f5", "bg-soft": "#eeeeea", surface: "#ffffff", text: "#202123", "text-strong": "#111111", muted: "#6e6e73", line: "#deded9", accent: "#10a37f", "accent-strong": "#087a61", "accent-soft": "#def4ee", "chart-a": "#10a37f", "chart-b": "#6b7280", "chart-c": "#111111", glow: "rgba(16, 163, 127, 0.16)" },
    dark: { ...codexDark, bg: "#0f0f0f", "bg-soft": "#171717", surface: "#1d1d1d", "surface-raised": "#252525", topbar: "rgba(29, 29, 29, 0.88)", text: "#ececec", "text-strong": "#ffffff", muted: "#a7a7a7", line: "#333333", accent: "#31c49f", "accent-strong": "#7bd9c3", "accent-soft": "#163b33", "chart-a": "#31c49f", "chart-b": "#a7a7a7", "chart-c": "#ffffff", glow: "rgba(49, 196, 159, 0.14)" },
  },
  {
    id: "github",
    name: "GitHub",
    description: "Primer-inspired blue, green, and purple.",
    preview: ["#0969da", "#1a7f37", "#8250df"],
    light: { ...codexLight, bg: "#f6f8fa", "bg-soft": "#eef2f6", surface: "#ffffff", line: "#d0d7de", accent: "#0969da", "accent-strong": "#0550ae", "accent-soft": "#ddf4ff", success: "#1a7f37", "success-soft": "#dafbe1", danger: "#cf222e", "danger-soft": "#ffebe9", warning: "#9a6700", "warning-soft": "#fff8c5", "chart-a": "#0969da", "chart-b": "#1a7f37", "chart-c": "#8250df", glow: "rgba(9, 105, 218, 0.16)" },
    dark: { ...codexDark, bg: "#0d1117", "bg-soft": "#161b22", surface: "#161b22", "surface-raised": "#21262d", topbar: "rgba(22, 27, 34, 0.88)", text: "#c9d1d9", "text-strong": "#f0f6fc", muted: "#8b949e", line: "#30363d", accent: "#58a6ff", "accent-strong": "#79c0ff", "accent-soft": "#143b61", success: "#3fb950", "success-soft": "#193423", danger: "#ff7b72", "danger-soft": "#3d1f24", warning: "#d29922", "warning-soft": "#342a13", "chart-a": "#58a6ff", "chart-b": "#3fb950", "chart-c": "#bc8cff", glow: "rgba(88, 166, 255, 0.14)" },
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Minimal monochrome with crisp contrast.",
    preview: ["#000000", "#ffffff", "#666666"],
    light: { ...codexLight, bg: "#ffffff", "bg-soft": "#f4f4f4", surface: "#ffffff", "surface-raised": "#fafafa", topbar: "rgba(255, 255, 255, 0.9)", text: "#171717", "text-strong": "#000000", muted: "#666666", line: "#e5e5e5", accent: "#000000", "accent-strong": "#000000", "accent-soft": "#eeeeee", "chart-a": "#000000", "chart-b": "#666666", "chart-c": "#999999", "on-accent": "#ffffff", glow: "rgba(0, 0, 0, 0.08)" },
    dark: { ...codexDark, bg: "#000000", "bg-soft": "#090909", surface: "#111111", "surface-raised": "#1a1a1a", topbar: "rgba(17, 17, 17, 0.88)", text: "#ededed", "text-strong": "#ffffff", muted: "#a1a1a1", line: "#2a2a2a", accent: "#ffffff", "accent-strong": "#ffffff", "accent-soft": "#2a2a2a", "chart-a": "#ffffff", "chart-b": "#a1a1a1", "chart-c": "#666666", "on-accent": "#000000", glow: "rgba(255, 255, 255, 0.1)" },
  },
  {
    id: "linear",
    name: "Linear",
    description: "Graphite surfaces with violet-blue emphasis.",
    preview: ["#5e6ad2", "#8b5cf6", "#111318"],
    light: { ...codexLight, bg: "#f7f7fb", "bg-soft": "#efeff8", accent: "#5e6ad2", "accent-strong": "#4b55bd", "accent-soft": "#e8e9ff", "chart-a": "#5e6ad2", "chart-b": "#8b5cf6", "chart-c": "#14b8a6", glow: "rgba(94, 106, 210, 0.18)" },
    dark: { ...codexDark, bg: "#0f1016", "bg-soft": "#171821", surface: "#181922", "surface-raised": "#20212c", topbar: "rgba(24, 25, 34, 0.88)", text: "#e7e8ee", "text-strong": "#ffffff", muted: "#a1a4b5", line: "#2c2e3a", accent: "#8b8ff8", "accent-strong": "#acaeff", "accent-soft": "#272a56", "chart-a": "#8b8ff8", "chart-b": "#a78bfa", "chart-c": "#2dd4bf", glow: "rgba(139, 143, 248, 0.16)" },
  },
  {
    id: "notion",
    name: "Notion",
    description: "Paper white, ink black, and warm gray.",
    preview: ["#fbfbfa", "#37352f", "#787774"],
    light: { ...codexLight, bg: "#fbfbfa", "bg-soft": "#f1f1ef", surface: "#ffffff", "surface-raised": "#fbfbfa", text: "#37352f", "text-strong": "#191711", muted: "#787774", line: "#e5e5e2", accent: "#4c6a8a", "accent-strong": "#31516f", "accent-soft": "#e8eff5", "chart-a": "#4c6a8a", "chart-b": "#9b6a43", "chart-c": "#5f7a68", glow: "rgba(76, 106, 138, 0.14)" },
    dark: { ...codexDark, bg: "#191919", "bg-soft": "#202020", surface: "#242424", "surface-raised": "#2a2a2a", topbar: "rgba(36, 36, 36, 0.88)", text: "#e6e6e3", "text-strong": "#ffffff", muted: "#aaa8a4", line: "#373737", accent: "#8fb7dc", "accent-strong": "#b7d2ea", "accent-soft": "#253847", "chart-a": "#8fb7dc", "chart-b": "#d2a274", "chart-c": "#9dc5a8", glow: "rgba(143, 183, 220, 0.12)" },
  },
  {
    id: "fluent",
    name: "Microsoft Fluent",
    description: "Blue-violet gradients with soft neutral panels.",
    preview: ["#2563eb", "#7c3aed", "#0f766e"],
    light: { ...codexLight, bg: "#f5f7fb", "bg-soft": "#eef3ff", accent: "#2563eb", "accent-strong": "#1d4ed8", "accent-soft": "#dfe8ff", success: "#0f766e", "success-soft": "#dff7f3", "chart-a": "#2563eb", "chart-b": "#7c3aed", "chart-c": "#0f766e", glow: "rgba(37, 99, 235, 0.18)" },
    dark: { ...codexDark, bg: "#0c1020", "bg-soft": "#12182a", surface: "#151b2e", "surface-raised": "#1d2540", topbar: "rgba(21, 27, 46, 0.88)", text: "#e6ecff", "text-strong": "#ffffff", muted: "#a8b3cf", line: "#2b3654", accent: "#7aa2ff", "accent-strong": "#a8c1ff", "accent-soft": "#243868", success: "#5eead4", "success-soft": "#143b39", "chart-a": "#7aa2ff", "chart-b": "#c4b5fd", "chart-c": "#5eead4", glow: "rgba(122, 162, 255, 0.16)" },
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Indigo, cyan, and violet for vivid simulations.",
    preview: ["#635bff", "#00d4ff", "#7a35ff"],
    light: { ...codexLight, bg: "#f7f8ff", "bg-soft": "#edf4ff", accent: "#635bff", "accent-strong": "#4f46e5", "accent-soft": "#e9e7ff", success: "#00a88f", "success-soft": "#dcf8f4", "chart-a": "#635bff", "chart-b": "#00a3ff", "chart-c": "#7a35ff", glow: "rgba(99, 91, 255, 0.18)" },
    dark: { ...codexDark, bg: "#0d1021", "bg-soft": "#151a33", surface: "#181d38", "surface-raised": "#202647", topbar: "rgba(24, 29, 56, 0.88)", text: "#edf0ff", "text-strong": "#ffffff", muted: "#aeb7df", line: "#30395f", accent: "#9b94ff", "accent-strong": "#c4bfff", "accent-soft": "#2b2b67", success: "#34e4c2", "success-soft": "#123e3d", "chart-a": "#9b94ff", "chart-b": "#67e8f9", "chart-c": "#c084fc", glow: "rgba(155, 148, 255, 0.16)" },
  },
] as const satisfies readonly ThemePalette[];

export const defaultThemeId: ThemeId = "codex";
export const defaultColorMode: ColorMode = "system";

export function isThemeId(value: string | null): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

export function isColorMode(value: string | null): value is ColorMode {
  return value === "system" || value === "light" || value === "dark";
}
