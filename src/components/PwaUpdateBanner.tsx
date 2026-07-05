import { usePwaUpdate } from "@/lib/usePwaUpdate";

export default function PwaUpdateBanner() {
  const { needRefresh, updateSW } = usePwaUpdate();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-[#1a1a2e] border border-[#639AFF]/30 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4 max-w-md w-[calc(100%-2rem)]">
      <div className="flex-1">
        <p className="text-[#D7E2EA] font-medium text-sm">New version available</p>
        <p className="text-[#D7E2EA]/50 text-xs">Click update to refresh</p>
      </div>
      <button
        onClick={updateSW}
        className="px-4 py-2 bg-[#639AFF] text-[#0C0C0C] text-sm font-medium rounded-xl hover:bg-[#639AFF]/90 transition-colors"
      >
        Update
      </button>
    </div>
  );
}
