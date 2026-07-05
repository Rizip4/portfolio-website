import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-400">{label}</label>}
    <textarea ref={ref} className={cn(
      "w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none",
      error && "border-red-500 focus:ring-red-500", className
    )} {...props} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
));
Textarea.displayName = "Textarea";
export default Textarea;
