import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-medium text-[#D7E2EA]/60 uppercase tracking-wider">{label}</label>}
    <textarea ref={ref} className={cn(
      "w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#D7E2EA]/10 rounded-xl text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all duration-200 resize-none",
      error && "border-red-500/50 focus:ring-red-500/40", className
    )} {...props} />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Textarea.displayName = "Textarea";
export default Textarea;
