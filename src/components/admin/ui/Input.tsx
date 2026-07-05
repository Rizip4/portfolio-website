import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-400">{label}</label>}
    <input ref={ref} className={cn(
      "w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors",
      error && "border-red-500 focus:ring-red-500", className
    )} {...props} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));
Input.displayName = "Input";
export default Input;
