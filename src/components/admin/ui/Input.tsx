import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs font-medium text-[#D7E2EA]/60 uppercase tracking-wider">{label}</label>}
    <input ref={ref} className={cn(
      "w-full px-4 py-2.5 bg-[#0C0C0C] border border-[#D7E2EA]/10 rounded-xl text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 transition-all duration-200",
      error && "border-red-500/50 focus:ring-red-500/40", className
    )} {...props} />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Input.displayName = "Input";
export default Input;
