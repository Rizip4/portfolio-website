import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button ref={ref} className={cn(
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-[#0C0C0C] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    variant === "primary" && "bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 shadow-lg shadow-orange-600/20",
    variant === "secondary" && "bg-[#1a1a2e] text-[#D7E2EA] border border-[#D7E2EA]/10 hover:bg-[#1a1a2e]/80 hover:border-[#D7E2EA]/20",
    variant === "danger" && "bg-red-600/90 text-white hover:bg-red-600 shadow-lg shadow-red-600/20",
    variant === "ghost" && "bg-transparent text-[#D7E2EA]/70 hover:bg-[#D7E2EA]/5 hover:text-[#D7E2EA]",
    size === "sm" && "px-3 py-1.5 text-xs",
    size === "md" && "px-4 py-2 text-sm",
    size === "lg" && "px-6 py-2.5 text-sm",
    className
  )} {...props} />
));
Button.displayName = "Button";
export default Button;
