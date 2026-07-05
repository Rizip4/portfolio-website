import { Marquee } from "@/components/spell-ui/marquee";

const row1Images = Array.from({ length: 11 }, (_, i) => `https://picsum.photos/seed/rijip1-${i}/420/270`);
const row2Images = Array.from({ length: 10 }, (_, i) => `https://picsum.photos/seed/rijip2-${i}/420/270`);

export default function MarqueeSection() {
  return (
    <section className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex flex-col gap-3">
        <Marquee duration={40} pauseOnHover fade fadeAmount={80}>
          {row1Images.map((src, i) => (
            <img key={i} src={src} alt={`Work sample ${i + 1}`}
              className="w-[420px] h-[270px] rounded-2xl object-cover mx-1.5 flex-shrink-0" loading="lazy" />
          ))}
        </Marquee>
        <Marquee duration={35} direction="right" pauseOnHover fade fadeAmount={80}>
          {row2Images.map((src, i) => (
            <img key={i} src={src} alt={`Work sample ${i + 12}`}
              className="w-[420px] h-[270px] rounded-2xl object-cover mx-1.5 flex-shrink-0" loading="lazy" />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
