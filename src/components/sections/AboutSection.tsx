import { useEffect, useState } from "react";
import { skillService, type Skill } from "@/services/skills";
import FadeIn from "../FadeIn";
import { GradientWaveText } from "../spell-ui/gradient-wave-text";
import { WordsStagger } from "../spell-ui/words-stagger";

const aboutText = "With more than six years of experience in video editing and motion design, i focus on cinematic storytelling, vfx compositing, and brand visuals, i truly enjoy working with businesses and creators who want their story told with impact. Let's build something incredible together!";

export default function AboutSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    skillService.getAll().then(setSkills).catch(() => {});
  }, []);

  return (
    <section id="about" className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 relative bg-[#0C0C0C]">
      {/* Decorative corner images */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none">
        <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#1a1a2e]/50 to-transparent border border-white/5" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none">
        <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-[#16213e]/50 to-transparent border border-white/5" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none">
        <div className="w-full aspect-square rounded-2xl bg-gradient-to-bl from-[#1a1a2e]/50 to-transparent border border-white/5" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none">
        <div className="w-full aspect-square rounded-2xl bg-gradient-to-tl from-[#16213e]/50 to-transparent border border-white/5" />
      </FadeIn>

      <FadeIn delay={0} y={40} className="mb-10 sm:mb-14 md:mb-16">
        <GradientWaveText align="center" className="font-black uppercase leading-none tracking-tight"
          customColors={["#646973", "#bbccd7", "#8d6869"]} speed={1}>
          <span style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>About me</span>
        </GradientWaveText>
      </FadeIn>

      <WordsStagger inView once stagger={0.03} speed={0.4}
        className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px] text-[clamp(1rem,2vw,1.35rem)] mb-16 sm:mb-20 md:mb-24">
        {aboutText}
      </WordsStagger>

      {/* Skills fetched from API */}
      {skills.length > 0 && (
        <FadeIn delay={0.4} y={20} className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 max-w-[600px]">
            {skills.map((s) => (
              <span key={s.id} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm text-[#D7E2EA]/70">
                {s.name}
              </span>
            ))}
          </div>
        </FadeIn>
      )}
    </section>
  );
}
