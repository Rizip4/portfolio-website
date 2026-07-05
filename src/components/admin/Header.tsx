import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <header className="h-16 bg-[#111] border-b border-gray-700 flex items-center px-4 lg:px-6">
      <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors">
        <Menu className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-semibold ml-4 lg:ml-0">{title}</h1>
    </header>
  );
}
