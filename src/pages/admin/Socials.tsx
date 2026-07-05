import { useEffect, useState } from "react";
import { socialService, type Social, type CreateSocialData } from "@/services/socials";
import { Plus, Trash2, Pencil, LinkIcon } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import { LabelInput } from "@/components/spell-ui/label-input";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import Toast from "@/components/admin/ui/Toast";

const iconOptions = [
  { value: "youtube", label: "YouTube" }, { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" }, { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" }, { value: "twitter", label: "X / Twitter" },
  { value: "github", label: "GitHub" }, { value: "link", label: "Other Link" },
];

export default function Socials() {
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState<CreateSocialData>({ name: "", url: "", icon: "link", order: 0 });

  useEffect(() => { loadSocials(); }, []);
  const loadSocials = async () => { try { setSocials(await socialService.getAll()); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const openAdd = () => { setEditingId(null); setForm({ name: "", url: "", icon: "link", order: socials.length }); setModalOpen(true); };
  const openEdit = (s: Social) => { setEditingId(s.id); setForm({ name: s.name, url: s.url, icon: s.icon, order: s.order }); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) return;
    try {
      if (editingId) { await socialService.update(editingId, form); setToast({ message: "Social link updated", type: "success" }); }
      else { await socialService.create(form); setToast({ message: "Social link added", type: "success" }); }
      setModalOpen(false); loadSocials();
    } catch { setToast({ message: "Failed to save", type: "error" }); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this social link?")) return;
    try { await socialService.delete(id); setToast({ message: "Social link deleted", type: "success" }); loadSocials(); }
    catch { setToast({ message: "Failed to delete", type: "error" }); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Social Links</h2>
        <Button onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Link</Button>
      </div>
      {socials.length === 0 ? (
        <div className="bg-[#111] border border-gray-700 rounded-xl p-12 text-center">
          <LinkIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-medium mb-2">No social links yet</h3>
          <Button onClick={openAdd}>Add Link</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {socials.map((s) => (
            <div key={s.id} className="flex items-center gap-4 bg-[#111] border border-gray-700 rounded-xl p-4 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 text-gray-400"><LinkIcon className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0"><div className="font-medium text-sm">{s.name}</div><div className="text-xs text-gray-500 truncate">{s.url}</div></div>
              <span className="text-xs px-2 py-1 rounded bg-gray-900 text-gray-500 capitalize">{s.icon}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(s)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-red-600/20 rounded-lg transition-colors text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Social Link" : "Add Social Link"} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabelInput label="Platform Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., YouTube" ringColor="orange" required />
          <LabelInput label="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." ringColor="orange" required />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Icon</label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500">
              {iconOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? "Save Changes" : "Add Link"}</Button>
          </div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
