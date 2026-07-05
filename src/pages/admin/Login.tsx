import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { LabelInput } from "@/components/spell-ui/label-input";
import { FlowButton } from "@/components/spell-ui/flow-button";
import Toast from "@/components/admin/ui/Toast";
import { Palette } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login({ email, password });
      setToast({ message: "Login successful!", type: "success" });
      setTimeout(() => navigate("/admin"), 1000);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Login failed";
      setError(message);
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0C0C0C]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#D7E2EA] uppercase tracking-wider">Admin</h1>
            <p className="text-[10px] text-[#D7E2EA]/40 uppercase tracking-[0.2em]">Portfolio Control</p>
          </div>
        </div>

        <div className="bg-[#111] border border-[#D7E2EA]/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-[#D7E2EA] mb-1">Welcome Back</h2>
          <p className="text-sm text-[#D7E2EA]/40 mb-8">Sign in to manage your portfolio</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <LabelInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@portfolio.com" ringColor="orange" required />
            <LabelInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" ringColor="orange" required />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="pt-2">
              <FlowButton type="submit" size="lg" className="w-full" borderColor="#f97316">
                {loading ? "Signing in..." : "Sign In"}
              </FlowButton>
            </div>
          </form>
        </div>

        <p className="text-center text-[10px] text-[#D7E2EA]/20 mt-6 uppercase tracking-widest">Secure Admin Access</p>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
