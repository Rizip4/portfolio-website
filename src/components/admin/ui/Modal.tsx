import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "relative bg-[#111] border border-gray-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden",
        size === "sm" && "max-w-md", size === "md" && "max-w-lg", size === "lg" && "max-w-2xl", size === "xl" && "max-w-4xl"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">{children}</div>
      </div>
    </div>
  );
}
