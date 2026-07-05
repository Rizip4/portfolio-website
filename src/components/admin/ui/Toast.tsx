import { useEffect, useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setIsVisible(false); setTimeout(onClose, 300); }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = { success: <Check className="w-5 h-5" />, error: <X className="w-5 h-5" />, warning: <AlertCircle className="w-5 h-5" /> };
  const colors = { success: "bg-green-600", error: "bg-red-600", warning: "bg-yellow-600" };

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300", colors[type], isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
