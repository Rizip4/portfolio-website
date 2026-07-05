import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <header className="h-16 bg-[#0C0C0C]/80 backdrop-blur-xl border-b border-[#D7E2EA]/10 flex items-center px-4 lg:px-6 sticky top-0 z-30">
      <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-[#D7E2EA]/5 rounded-xl transition-colors text-[#D7E2EA]/60">
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-semibold ml-4 lg:ml-0 text-[#D7E2EA]">{title}</h1>
    </header>
  );
}
