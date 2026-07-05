import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { LabelInput } from "@/components/spell-ui/label-input";
import { FlowButton } from "@/components/spell-ui/flow-button";
import Toast from "@/components/admin/ui/Toast";

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
        <div className="bg-[#111] border border-gray-700 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 mb-8">Sign in to manage your portfolio</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <LabelInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@portfolio.com" ringColor="orange" required />
            <LabelInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" ringColor="orange" required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <FlowButton type="submit" size="lg" className="w-full" borderColor="#f97316">
              {loading ? "Signing in..." : "Sign In"}
            </FlowButton>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">Default: admin@portfolio.com / admin123</p>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
