import { useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { settingsService, type SiteSettings } from "@/services/settings";
import { extractYouTubeId } from "@/lib/utils";
import { LabelInput } from "@/components/spell-ui/label-input";
import Button from "@/components/admin/ui/Button";
import Textarea from "@/components/admin/ui/Textarea";
import Toast from "@/components/admin/ui/Toast";
import LoadingSpinner from "@/components/admin/ui/LoadingSpinner";
import ImageUpload from "@/components/admin/ImageUpload";
import { Image, Type, FileText, Globe, Lock, ChevronDown, ChevronUp } from "lucide-react";

function Section({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-[#D7E2EA]/5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-orange-400" />
          </div>
          <span className="font-medium text-[#D7E2EA]">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#D7E2EA]/40" /> : <ChevronDown className="w-4 h-4 text-[#D7E2EA]/40" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-[#D7E2EA]/5">{children}</div>}
    </div>
  );
}

export default function Settings() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    heroImageUrl: "", heroVideoUrl: "", heroName: "", heroTagline: "", heroDescription: "",
    aboutText: "", footerCopyright: "", pageTitle: "",
  });

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    settingsService.get().then(setSettings).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await settingsService.update(settings); setToast({ message: "Settings saved successfully", type: "success" }); }
    catch { setToast({ message: "Failed to save settings", type: "error" }); }
    finally { setSaving(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setToast({ message: "Passwords don't match", type: "error" }); return; }
    if (newPassword.length < 12) { setToast({ message: "Password must be at least 12 characters", type: "error" }); return; }
    setPasswordLoading(true);
    try { await authService.changePassword(currentPassword, newPassword); setToast({ message: "Password changed", type: "success" }); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    catch { setToast({ message: "Failed to change password", type: "error" }); }
    finally { setPasswordLoading(false); }
  };

  const update = (key: keyof SiteSettings, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  if (loading) return <div className="p-6 lg:p-8"><LoadingSpinner /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#D7E2EA]">Site Settings</h2>
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save All Changes"}</Button>
      </div>

      {/* Hero Section */}
      <Section title="Hero Section" icon={Image} defaultOpen={true}>
        <div className="pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInput label="Hero Name" value={settings.heroName} onChange={(e) => update("heroName", e.target.value)} placeholder="Hi, i'm Rizip" ringColor="orange" />
            <LabelInput label="Page Title" value={settings.pageTitle} onChange={(e) => update("pageTitle", e.target.value)} placeholder="Rizip Pokharel -- Video Editor" ringColor="orange" />
          </div>
          <Textarea label="Hero Tagline" value={settings.heroTagline} onChange={(e) => update("heroTagline", e.target.value)} placeholder="a video editor & motion designer..." rows={2} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <LabelInput label="Portrait Image URL" value={settings.heroImageUrl} onChange={(e) => update("heroImageUrl", e.target.value)} placeholder="https://example.com/photo.jpg" ringColor="orange" />
              <div className="mt-2">
                <ImageUpload value={settings.heroImageUrl} onChange={(url) => update("heroImageUrl", url)} label="Or upload image" />
              </div>
            </div>
            <LabelInput label="YouTube Video URL" value={settings.heroVideoUrl} onChange={(e) => update("heroVideoUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." ringColor="orange" />
          </div>
          {/* Preview */}
          <div className="mt-4">
            <p className="text-xs text-[#D7E2EA]/40 uppercase tracking-wider mb-3">Portrait Preview</p>
            <div className="w-[160px] aspect-[4/5] rounded-2xl overflow-hidden bg-[#0C0C0C] border border-[#D7E2EA]/10">
              {settings.heroVideoUrl && extractYouTubeId(settings.heroVideoUrl) ? (
                <iframe src={`https://www.youtube.com/embed/${extractYouTubeId(settings.heroVideoUrl)}?rel=0`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              ) : settings.heroImageUrl ? (
                <img src={settings.heroImageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D7E2EA]/20 text-xs">No media</div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* About Section */}
      <Section title="About Section" icon={FileText}>
        <div className="pt-5">
          <Textarea label="About Text" value={settings.aboutText} onChange={(e) => update("aboutText", e.target.value)} placeholder="Tell visitors about yourself..." rows={4} />
        </div>
      </Section>

      {/* Footer */}
      <Section title="Footer" icon={Globe}>
        <div className="pt-5">
          <LabelInput label="Copyright Text" value={settings.footerCopyright} onChange={(e) => update("footerCopyright", e.target.value)} placeholder="© 2024 Rizip Pokharel" ringColor="orange" />
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" icon={Lock}>
        <form onSubmit={handlePasswordSubmit} className="pt-5 space-y-4">
          <LabelInput label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} ringColor="orange" required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInput label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} ringColor="orange" required />
            <LabelInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} ringColor="orange" required />
          </div>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[#D7E2EA]/40">Minimum 12 characters</p>
            <Button type="submit" disabled={passwordLoading} size="sm">{passwordLoading ? "Changing..." : "Change Password"}</Button>
          </div>
        </form>
      </Section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
