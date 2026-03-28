import * as themeEven from "jsonresume-theme-even";

const themeModules: Record<string, typeof themeEven> = {
  even: themeEven,
};

export const AVAILABLE_THEMES = [
  { id: "even", name: "Even" },
] as const;

export function getInstalledThemes() {
  return AVAILABLE_THEMES.filter((t) => t.id in themeModules);
}

export function loadTheme(themeId: string) {
  const mod = themeModules[themeId];
  if (!mod) throw new Error(`Unknown theme: ${themeId}`);
  return mod;
}
