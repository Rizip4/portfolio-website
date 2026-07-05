import { useState, useRef } from "react";
import { uploadImage } from "@/services/upload";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      setError("Upload failed. Check your Cloudinary config.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-[120px] h-[120px] rounded-xl overflow-hidden border border-[#D7E2EA]/10">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg hover:bg-red-600/80 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 bg-[#0C0C0C] border border-[#D7E2EA]/10 rounded-xl text-[#D7E2EA]/60 hover:text-[#D7E2EA] hover:border-[#D7E2EA]/20 transition-all text-sm disabled:opacity-50"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? "Uploading..." : label}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
