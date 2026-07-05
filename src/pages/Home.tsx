import HeroSection from "@/components/sections/HeroSection";
import MarqueeSection from "@/components/sections/MarqueeSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div style={{ overflowX: "clip", background: "#0C0C0C" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <footer className="bg-[#0C0C0C] py-8 text-center border-t border-white/5">
        <p className="text-[#D7E2EA]/40 text-sm">&copy; 2024 Rijip Pokharel. All rights reserved.</p>
      </footer>
    </div>
  );
}
