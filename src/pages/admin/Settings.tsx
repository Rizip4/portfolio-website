import { useState } from "react";
import { authService } from "@/services/auth";
import { LabelInput } from "@/components/spell-ui/label-input";
import Button from "@/components/admin/ui/Button";
import Toast from "@/components/admin/ui/Toast";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setToast({ message: "Passwords don't match", type: "error" }); return; }
    if (newPassword.length < 12) { setToast({ message: "Password must be at least 12 characters", type: "error" }); return; }
    setLoading(true);
    try { await authService.changePassword(currentPassword, newPassword); setToast({ message: "Password changed successfully", type: "success" }); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    catch { setToast({ message: "Failed to change password", type: "error" }); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="bg-[#111] border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabelInput label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} ringColor="orange" required />
          <LabelInput label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} ringColor="orange" required />
          <LabelInput label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} ringColor="orange" required />
          <div className="pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Changing..." : "Change Password"}</Button>
          </div>
        </form>
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-400">Password must be at least 12 characters long.</p>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
