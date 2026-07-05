import { useState, useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import { settingsService, type SiteSettings } from "@/services/settings";

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings>({
    heroImageUrl: "", heroVideoUrl: "", heroName: "", heroTagline: "", heroDescription: "",
    aboutText: "", footerCopyright: "© 2024 Rizip Pokharel. All rights reserved.", pageTitle: "",
  });

  useEffect(() => {
    settingsService.get().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (settings.pageTitle) {
      document.title = settings.pageTitle;
    }
  }, [settings.pageTitle]);

  return (
    <div style={{ overflowX: "clip", background: "#0C0C0C" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <footer className="bg-[#0C0C0C] py-8 text-center border-t border-white/5">
        <p className="text-[#D7E2EA]/40 text-sm">{settings.footerCopyright}</p>
      </footer>
    </div>
  );
}
