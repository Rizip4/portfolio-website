import { useEffect, useState } from "react";
import { skillService, type Skill } from "@/services/skills";
import { Plus, Trash2, Tag } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import { LabelInput } from "@/components/spell-ui/label-input";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Toast from "@/components/admin/ui/Toast";

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [newSkillName, setNewSkillName] = useState("");

  useEffect(() => { loadSkills(); }, []);
  const loadSkills = async () => { try { setSkills(await skillService.getAll()); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try { await skillService.create(newSkillName, skills.length); setToast({ message: "Skill added", type: "success" }); setNewSkillName(""); setModalOpen(false); loadSkills(); }
    catch { setToast({ message: "Failed to add", type: "error" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try { await skillService.delete(id); setToast({ message: "Skill deleted", type: "success" }); loadSkills(); }
    catch { setToast({ message: "Failed to delete", type: "error" }); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#D7E2EA]">Skills</h2>
        <Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Skill</Button>
      </div>
      {skills.length === 0 ? (
        <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl p-12 text-center">
          <Tag className="w-12 h-12 mx-auto mb-4 text-[#D7E2EA]/20" />
          <h3 className="text-lg font-medium text-[#D7E2EA]/60 mb-2">No skills yet</h3>
          <Button onClick={() => setModalOpen(true)}>Add Skill</Button>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl p-6">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <div key={s.id} className="flex items-center gap-2 px-4 py-2 bg-[#0C0C0C] border border-[#D7E2EA]/5 rounded-xl group">
                <span className="text-sm text-[#D7E2EA]/70">{s.name}</span>
                <button onClick={() => handleDelete(s.id)} className="p-1 hover:bg-red-500/10 rounded-lg transition-colors text-[#D7E2EA]/20 hover:text-red-400 opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Skill" size="sm">
        <form onSubmit={handleAdd} className="space-y-4">
          <LabelInput label="Skill Name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="e.g., Adobe Premiere Pro" ringColor="orange" required />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Skill</Button>
          </div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
