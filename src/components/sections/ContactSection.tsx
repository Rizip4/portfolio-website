import { useState } from "react";
import { GradientWaveText } from "@/components/spell-ui/gradient-wave-text";
import { LabelInput } from "@/components/spell-ui/label-input";
import { FlowButton } from "@/components/spell-ui/flow-button";
import { Spinner } from "@/components/spell-ui/spinner";
import FadeIn from "../FadeIn";

const API_URL = "https://portfolio-backend-hazel-two.vercel.app";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <div className="max-w-2xl mx-auto">
        <FadeIn delay={0} y={40}>
          <GradientWaveText align="center" className="font-black uppercase mb-4"
            customColors={["#646973", "#bbccd7", "#B600A8", "#7621B0"]}>
            <span style={{ fontSize: "clamp(2rem, 8vw, 80px)" }}>Let&apos;s Create Together</span>
          </GradientWaveText>
        </FadeIn>

        <FadeIn delay={0.2} y={20}>
          <p className="text-[#D7E2EA]/60 text-center mb-12 max-w-md mx-auto">
            Ready to bring your vision to life? Let&apos;s discuss your next project and create something extraordinary.
          </p>
        </FadeIn>

        {success ? (
          <FadeIn delay={0} y={0}>
            <div className="text-center py-12">
              <p className="text-[#D7E2EA] text-xl font-medium mb-2">Message Sent!</p>
              <p className="text-[#D7E2EA]/50">Thank you for reaching out. I&apos;ll get back to you soon.</p>
            </div>
          </FadeIn>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <LabelInput label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} ringColor="orange" required />
            <LabelInput label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} ringColor="orange" required />
            <div className="space-y-1.5">
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none min-h-[120px]"
                placeholder="Tell me about your project..." required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-center pt-4">
              <FlowButton type="submit" size="lg" borderColor="#B600A8" className="min-w-[200px]">
                {loading ? <Spinner size="sm" className="text-white" /> : "Send Message"}
              </FlowButton>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
