import { useEffect, useState } from "react";
import { skillService, type Skill } from "@/services/skills";
import FadeIn from "../FadeIn";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";

const serviceDescriptions: Record<string, string> = {
  "VFX": "Visual effects compositing that blends CGI, live footage, and practical elements into one seamless shot.",
  "After Effects": "Motion graphics, tracking, and animated title work that adds energy and polish to every frame.",
  "Premiere Pro": "Narrative editing, pacing, and final assembly that turns raw footage into a compelling story.",
  "Compositing": "Layering visual elements together with precise color and light matching for a believable final image.",
  "Motion Design": "Kinetic typography and animated brand assets that bring products and stories to life.",
  "Blender": "3D modeling and rendering for CGI elements dropped seamlessly into real footage.",
};

export default function ServicesSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillService.getAll()
      .then((data) => setSkills(data.length > 0 ? data : [
        { id: "1", name: "VFX", order: 0, createdAt: "" },
        { id: "2", name: "After Effects", order: 1, createdAt: "" },
        { id: "3", name: "Premiere Pro", order: 2, createdAt: "" },
        { id: "4", name: "Compositing", order: 3, createdAt: "" },
        { id: "5", name: "Motion Design", order: 4, createdAt: "" },
        { id: "6", name: "Blender", order: 5, createdAt: "" },
      ]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="bg-white rounded-t-[60px] py-32"><LoadingSpinner /></div>;

  return (
    <section id="price" className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <h2 className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
        Skills &amp; Tools
      </h2>

      <div className="max-w-5xl mx-auto">
        {skills.map((skill, i) => (
          <FadeIn key={skill.id} delay={i * 0.1}>
            <div className="flex items-start gap-6 sm:gap-8 md:gap-10 py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)]">
              <span className="font-black text-[#0C0C0C] flex-shrink-0"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-2 sm:pt-4 md:pt-6">
                <h3 className="font-medium uppercase mb-2" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>
                  {skill.name}
                </h3>
                <p className="font-light leading-relaxed max-w-2xl opacity-60"
                  style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}>
                  {serviceDescriptions[skill.name] || "Professional creative services and expertise."}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
