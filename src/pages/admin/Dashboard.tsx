import { useEffect, useState } from "react";
import { projectService, type Project } from "@/services/projects";
import { skillService, type Skill } from "@/services/skills";
import { FolderOpen, Tag, Eye, EyeOff, ExternalLink } from "lucide-react";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectService.getAll(), skillService.getAll()])
      .then(([p, s]) => { setProjects(p); setSkills(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const published = projects.filter((p) => p.published).length;
  const drafts = projects.filter((p) => !p.published).length;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderOpen, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Published", value: published, icon: Eye, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Drafts", value: drafts, icon: EyeOff, color: "text-[#D7E2EA]/40", bg: "bg-[#D7E2EA]/5" },
    { label: "Skills", value: skills.length, icon: Tag, color: "text-blue-400", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#D7E2EA]">Dashboard</h2>
          <p className="text-sm text-[#D7E2EA]/40 mt-1">Welcome back, Rizip</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#D7E2EA]/10 rounded-xl text-[#D7E2EA]/60 hover:text-[#D7E2EA] hover:border-[#D7E2EA]/20 transition-all text-sm">
          <ExternalLink className="w-4 h-4" />
          View Site
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-[#D7E2EA]">{stat.value}</div>
            <div className="text-xs text-[#D7E2EA]/40 uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent + Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#D7E2EA] uppercase tracking-wider mb-4">Recent Projects</h3>
          {projects.length === 0 ? (
            <p className="text-[#D7E2EA]/30 text-sm">No projects yet</p>
          ) : (
            <div className="space-y-2">
              {projects.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-[#0C0C0C] rounded-xl border border-[#D7E2EA]/5">
                  <div>
                    <div className="font-medium text-sm text-[#D7E2EA]">{p.title}</div>
                    <div className="text-xs text-[#D7E2EA]/30">{p.category}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-medium ${p.published ? "bg-green-500/10 text-green-400" : "bg-[#D7E2EA]/5 text-[#D7E2EA]/40"}`}>
                    {p.published ? "Live" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#D7E2EA] uppercase tracking-wider mb-4">Skills</h3>
          {skills.length === 0 ? (
            <p className="text-[#D7E2EA]/30 text-sm">No skills yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="px-3 py-1.5 bg-[#0C0C0C] border border-[#D7E2EA]/5 rounded-lg text-xs text-[#D7E2EA]/60">
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
