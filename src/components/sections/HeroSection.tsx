import FadeIn from "../FadeIn";
import Magnet from "../Magnet";
import { GradientWaveText } from "../spell-ui/gradient-wave-text";
import { SlideUpText } from "../spell-ui/slide-up-text";
import { FlowButton } from "../spell-ui/flow-button";
import Rays from "../spell-ui/light-rays";

export default function HeroSection() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex flex-col h-screen overflow-x-clip bg-[#0C0C0C]">
      <Rays raysColor={{ mode: "single", color: "#639AFF" }} intensity={8} rays={24} reach={12} position={50} backgroundColor="#0C0C0C" />

      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 relative z-10">
          {["About", "Price", "Projects", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70">
              {item}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="flex flex-col flex-1 justify-between px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 overflow-x-clip relative z-10">
        <FadeIn delay={0.15} y={40} className="overflow-hidden mt-6 sm:mt-4 md:-mt-5">
          <GradientWaveText className="font-black uppercase tracking-tight leading-none w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
            speed={1.2} customColors={["#646973", "#bbccd7", "#8d6869", "#5a8ea6"]}>
            Hi, i&apos;m Rijip
          </GradientWaveText>
        </FadeIn>

        <div className="flex justify-between items-end">
          <FadeIn delay={0.35} y={0}>
            <SlideUpText split="words" stagger={0.05} from="first" inView once
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-[clamp(0.75rem,1.4vw,1.5rem)]">
              a video editor &amp; motion designer crafting compelling stories through dynamic visuals, precise timing, and creative excellence
            </SlideUpText>
          </FadeIn>

          <FadeIn delay={0.5} y={20}>
            <FlowButton size="lg" onClick={scrollToContact} borderColor="#D7E2EA">
              Get in Touch
            </FlowButton>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <Magnet padding={150} strength={3}>
          <div className="w-full aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 200 250" className="w-3/4 h-3/4 opacity-30">
              <defs>
                <linearGradient id="portrait-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#646973" />
                  <stop offset="100%" stopColor="#bbccd7" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="80" r="50" fill="url(#portrait-grad)" />
              <ellipse cx="100" cy="200" rx="70" ry="60" fill="url(#portrait-grad)" />
            </svg>
          </div>
        </Magnet>
      </FadeIn>
    </section>
  );
}
