import React, { useState } from 'react';
import {
  Zap,
  LayoutDashboard,
  Database,
  Cpu,
  AlertTriangle,
  DollarSign,
  Sliders,
  Lightbulb,
  Briefcase,
  FileText,
  Info,
  Bot,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'dashboard'
  | 'energyData'
  | 'aiAnalysis'
  | 'wastage'
  | 'cost'
  | 'simulator'
  | 'recommendations'
  | 'management'
  | 'reports'
  | 'about';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAiScan: () => void;
  onToggleAiChat: () => void;
  isAiChatOpen: boolean;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Zap },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'energyData', label: 'Energy Data', icon: Database },
  { id: 'aiAnalysis', label: 'AI Analysis', icon: Cpu },
  { id: 'wastage', label: 'Wastage Detection', icon: AlertTriangle },
  { id: 'cost', label: 'Cost Analytics', icon: DollarSign },
  { id: 'simulator', label: 'Savings Simulator', icon: Sliders },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  { id: 'management', label: 'Management Center', icon: Briefcase },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'about', label: 'About Project', icon: Info },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAiScan,
  onToggleAiChat,
  isAiChatOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-tight">
                  Energy<span className="text-cyan-400">IQ</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  MBA AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Smart Business Analytics
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/80 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Primary "Analyse with AI" trigger */}
            <button
              onClick={onOpenAiScan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analyse with AI</span>
              <span className="sm:hidden">Scan AI</span>
            </button>

            {/* AI Assistant Drawer Toggle */}
            <button
              onClick={onToggleAiChat}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isAiChatOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 ring-1 ring-cyan-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Ask AI</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/98 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700 font-bold'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
