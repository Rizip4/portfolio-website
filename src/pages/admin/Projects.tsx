import { useEffect, useState } from "react";
import { projectService, type Project } from "@/services/projects";
import { Plus, Edit, Trash2, Eye, EyeOff, FolderOpen } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Toast from "@/components/admin/ui/Toast";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({ title: "", category: "", description: "", accent: "#ff3d00", imageUrl: "", videoUrl: "", published: false });

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try { setProjects(await projectService.getAll()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = () => { setEditingProject(null); setFormData({ title: "", category: "", description: "", accent: "#ff3d00", imageUrl: "", videoUrl: "", published: false }); setModalOpen(true); };
  const handleEdit = (p: Project) => { setEditingProject(p); setFormData({ title: p.title, category: p.category, description: p.description, accent: p.accent, imageUrl: p.imageUrl || "", videoUrl: p.videoUrl || "", published: p.published }); setModalOpen(true); };
  const handleDelete = async (id: string) => { if (!confirm("Delete this project?")) return; try { await projectService.delete(id); setToast({ message: "Project deleted", type: "success" }); loadProjects(); } catch { setToast({ message: "Failed to delete", type: "error" }); } };
  const handleTogglePublish = async (id: string) => { try { await projectService.togglePublish(id); loadProjects(); } catch { setToast({ message: "Failed to update", type: "error" }); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) { await projectService.update(editingProject.id, formData); setToast({ message: "Project updated", type: "success" }); }
      else { await projectService.create(formData); setToast({ message: "Project created", type: "success" }); }
      setModalOpen(false); loadProjects();
    } catch { setToast({ message: "Failed to save", type: "error" }); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" />New Project</Button>
      </div>
      {projects.length === 0 ? (
        <div className="bg-[#111] border border-gray-700 rounded-xl p-12 text-center">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <Button onClick={handleCreate}>Create Project</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-[#111] border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.published ? "bg-green-600/20 text-green-500" : "bg-gray-600/20 text-gray-500"}`}>{p.published ? "Published" : "Draft"}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{p.category}</p>
                  <p className="text-sm text-gray-400 line-clamp-2">{p.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleTogglePublish(p.id)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title={p.published ? "Unpublish" : "Publish"}>
                    {p.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? "Edit Project" : "New Project"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Input label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Accent Color" type="color" value={formData.accent} onChange={(e) => setFormData({ ...formData, accent: e.target.value })} />
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 rounded border-gray-700 bg-gray-900" />
              <label htmlFor="published" className="text-sm text-gray-400">Publish immediately</label>
            </div>
          </div>
          <Input label="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
          <Input label="Video URL" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://..." />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingProject ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
