import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button ref={ref} className={cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0C0C0C] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    variant === "primary" && "bg-orange-600 text-white hover:bg-orange-700",
    variant === "secondary" && "bg-gray-800 text-white hover:bg-gray-700",
    variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
    variant === "ghost" && "bg-transparent text-white hover:bg-gray-800",
    size === "sm" && "px-3 py-1.5 text-sm",
    size === "md" && "px-4 py-2 text-sm",
    size === "lg" && "px-6 py-3 text-base",
    className
  )} {...props} />
));
Button.displayName = "Button";
export default Button;
