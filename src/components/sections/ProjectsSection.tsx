import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { projectService } from "@/services/projects";
import FadeIn from "../FadeIn";
import { TiltCard } from "../spell-ui/tilt-card";
import { FlowButton } from "../spell-ui/flow-button";
import { GradientWaveText } from "../spell-ui/gradient-wave-text";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

type FallbackProject = {
  num: string; name: string; category: string; description: string;
  buttonLabel: string; videoUrl?: string;
  images: string[];
};

const fallbackProjects: FallbackProject[] = [
  { num: "01", name: "Car animation", category: "CGI", description: "", buttonLabel: "Live Project",
    images: ["https://picsum.photos/seed/proj1a/600/400", "https://picsum.photos/seed/proj1b/600/500", "https://picsum.photos/seed/proj1c/800/700"] },
  { num: "02", name: "CGI car added to Real Footage", category: "CGI and VFX", description: "3D Tracked Scene, Added CGI toy car & Composited inside After Effects", buttonLabel: "Watch on YouTube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    images: ["https://picsum.photos/seed/proj2a/600/400", "https://picsum.photos/seed/proj2b/600/500", "https://picsum.photos/seed/proj2c/800/700"] },
  { num: "03", name: "Board Manage", category: "SaaS", description: "", buttonLabel: "Live Project",
    images: ["https://picsum.photos/seed/proj3a/600/400", "https://picsum.photos/seed/proj3b/600/500", "https://picsum.photos/seed/proj3c/800/700"] },
  { num: "04", name: "Insta VFX Reel", category: "Reel", description: "", buttonLabel: "Live Project",
    images: ["https://picsum.photos/seed/proj4a/600/400", "https://picsum.photos/seed/proj4b/600/500", "https://picsum.photos/seed/proj4c/800/700"] },
  { num: "05", name: "Flight Book", category: "SaaS", description: "", buttonLabel: "Live Project",
    images: ["https://picsum.photos/seed/proj5a/600/400", "https://picsum.photos/seed/proj5b/600/500", "https://picsum.photos/seed/proj5c/800/700"] },
];

function ProjectCard({ project, index, total }: { project: FallbackProject; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const youTubeId = project.videoUrl ? extractYouTubeId(project.videoUrl) : null;

  return (
    <div ref={cardRef} className="h-[85vh] relative" style={{ zIndex: index }}>
      <motion.div style={{ scale, top: `${index * 28}px` }}
        className="sticky top-24 md:top-32 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8">
        <div className="flex items-start justify-between mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-start gap-4 sm:gap-6">
            <span className="hero-heading font-black leading-none" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>
              {project.num}
            </span>
            <div>
              <span className="text-[#D7E2EA]/60 text-xs sm:text-sm uppercase tracking-widest font-medium">{project.category}</span>
              <h3 className="text-[#D7E2EA] font-medium uppercase" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>
                {project.name}
              </h3>
              {project.description && <p className="text-[#D7E2EA]/50 text-xs sm:text-sm mt-1 max-w-md">{project.description}</p>}
            </div>
          </div>
          {youTubeId ? (
            <a href={`https://www.youtube.com/watch?v=${youTubeId}`} target="_blank" rel="noopener noreferrer">
              <FlowButton size="sm" borderColor="#D7E2EA">
                Watch on YouTube
              </FlowButton>
            </a>
          ) : (
            <FlowButton size="sm" borderColor="#D7E2EA">{project.buttonLabel}</FlowButton>
          )}
        </div>
        <TiltCard className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] overflow-hidden">
          {youTubeId ? (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${youTubeId}?rel=0&modestbranding=1`}
                title={project.name}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex gap-3 sm:gap-4">
              <div className="w-[40%] flex flex-col gap-3 sm:gap-4">
                <img src={project.images[0]} alt={`${project.name} - 1`}
                  className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                  style={{ height: "clamp(130px, 16vw, 230px)" }} loading="lazy" />
                <img src={project.images[1]} alt={`${project.name} - 2`}
                  className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
                  style={{ height: "clamp(160px, 22vw, 340px)" }} loading="lazy" />
              </div>
              <div className="w-[60%]">
                <img src={project.images[2]} alt={`${project.name} - 3`}
                  className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover" loading="lazy" />
              </div>
            </div>
          )}
        </TiltCard>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getAll(true)
      .then((data) => {
        if (data.length > 0) {
          setProjects(data.map((p, i) => ({
            num: String(i + 1).padStart(2, "0"),
            name: p.title,
            category: p.category,
            description: p.description,
            buttonLabel: p.videoUrl ? "Watch on YouTube" : "Live Project",
            videoUrl: p.videoUrl,
            images: [
              p.imageUrl || `https://picsum.photos/seed/db${i}a/600/400`,
              `https://picsum.photos/seed/db${i}b/600/500`,
              `https://picsum.photos/seed/db${i}c/800/700`,
            ],
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="bg-[#0C0C0C] rounded-t-[60px] py-32"><LoadingSpinner /></div>;

  return (
    <section id="projects" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <FadeIn delay={0} y={40}>
        <GradientWaveText align="center" className="font-black uppercase mb-16 sm:mb-20 md:mb-28"
          customColors={["#646973", "#bbccd7", "#8d6869"]} speed={1}>
          <span style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>Featured Projects</span>
        </GradientWaveText>
      </FadeIn>
      <div className="max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <ProjectCard key={project.num} project={project} index={index} total={projects.length} />
        ))}
      </div>
    </section>
  );
}
