"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type RingColor = "muted" | "primary" | "orange" | "blue" | "green" | "red" | "purple" | "pink";

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  ringColor?: RingColor;
  containerClassName?: string;
}

const ringColorMap: Record<RingColor, string> = {
  muted: "focus:ring-gray-500",
  primary: "focus:ring-orange-500",
  orange: "focus:ring-orange-600",
  blue: "focus:ring-blue-600",
  green: "focus:ring-green-600",
  red: "focus:ring-red-600",
  purple: "focus:ring-purple-600",
  pink: "focus:ring-pink-600",
};

export function LabelInput({ label = "", ringColor = "orange", containerClassName, className, type = "text", placeholder = "", ...props }: LabelInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType ? (isVisible ? "text" : "password") : type;

  return (
    <div className={cn("group relative w-full", className, containerClassName)}>
      <input
        className={cn(
          "block outline-none peer w-full px-3.5 h-10 text-sm rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:border-transparent transition-colors",
          isPasswordType && "pr-9",
          ringColorMap[ringColor],
        )}
        placeholder={placeholder}
        type={inputType}
        {...props}
      />
      <label className="absolute block inset-y-0 px-2 bg-gray-900 text-sm left-[7px] h-fit text-nowrap my-auto -translate-y-[19px] peer-focus:-translate-y-[19px] text-gray-400 pointer-events-none transition-transform duration-200 scale-[.8] origin-top-left peer-placeholder-shown:scale-100 peer-focus:scale-[.8] peer-placeholder-shown:translate-y-0">
        {label}
      </label>
      {isPasswordType && (
        <button
          className="text-gray-400 hover:text-white absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-colors outline-none"
          type="button" onClick={() => setIsVisible(!isVisible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}

export default LabelInput;
