import api from "./api";

export interface SiteSettings {
  // Hero
  heroImageUrl: string;
  heroVideoUrl: string;
  heroName: string;
  heroTagline: string;
  heroDescription: string;

  // About
  aboutText: string;

  // Footer
  footerCopyright: string;

  // Page
  pageTitle: string;
}

const defaults: SiteSettings = {
  heroImageUrl: "",
  heroVideoUrl: "",
  heroName: "Hi, i'm Rizip",
  heroTagline: "a video editor & motion designer crafting compelling stories through dynamic visuals, precise timing, and creative excellence",
  heroDescription: "",
  aboutText: "With more than six years of experience in video editing and motion design, i focus on cinematic storytelling, vfx compositing, and brand visuals, i truly enjoy working with businesses and creators who want their story told with impact. Let's build something incredible together!",
  footerCopyright: "© 2024 Rizip Pokharel. All rights reserved.",
  pageTitle: "Rizip Pokharel -- Video Editor & Motion Designer",
};

export const settingsService = {
  async get(): Promise<SiteSettings> {
    try {
      const response = await api.get<{ data: SiteSettings }>("/settings");
      return { ...defaults, ...response.data.data };
    } catch {
      return defaults;
    }
  },
  async update(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const response = await api.put<{ data: SiteSettings }>("/settings", data);
    return response.data.data;
  },
};
