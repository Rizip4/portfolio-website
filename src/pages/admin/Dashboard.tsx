import { useEffect, useState } from "react";
import { projectService, type Project } from "@/services/projects";
import { skillService, type Skill } from "@/services/skills";
import { FolderOpen, Tag, Eye, EyeOff } from "lucide-react";
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
    { label: "Total Projects", value: projects.length, icon: FolderOpen, color: "text-orange-500" },
    { label: "Published", value: published, icon: Eye, color: "text-green-500" },
    { label: "Drafts", value: drafts, icon: EyeOff, color: "text-gray-500" },
    { label: "Skills", value: skills.length, icon: Tag, color: "text-blue-500" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#111] border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2"><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
          {projects.length === 0 ? <p className="text-gray-500">No projects yet</p> : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div><div className="font-medium">{p.title}</div><div className="text-sm text-gray-500">{p.category}</div></div>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.published ? "bg-green-600/20 text-green-500" : "bg-gray-600/20 text-gray-500"}`}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-[#111] border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>
          {skills.length === 0 ? <p className="text-gray-500">No skills yet</p> : (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => <span key={s.id} className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm">{s.name}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
