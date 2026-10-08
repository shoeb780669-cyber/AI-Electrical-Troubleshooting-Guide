import React from 'react';
import {
  Zap,
  LayoutDashboard,
  Calendar,
  BarChart3,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  Database,
  Calculator,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'monthlyData' | 'charts' | 'troubleshoot' | 'calculators';

interface NavigationHeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  lastSavedAt: string | null;
  recordsCount: number;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onSelectTab,
  lastSavedAt,
  recordsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  AI Electrical <span className="text-cyan-400">Troubleshooting Guide</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Monthly Energy Analytics & Diagnostic Safety Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('monthlyData')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'monthlyData'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Monthly Data</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 font-mono">
                {recordsCount}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('charts')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'charts'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Interactive Charts</span>
            </button>

            <button
              onClick={() => onSelectTab('troubleshoot')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'troubleshoot'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Troubleshooting</span>
            </button>

            <button
              onClick={() => onSelectTab('calculators')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'calculators'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculators & Safety</span>
            </button>
          </nav>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved Locally</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-slate-800/80 gap-1.5 text-xs font-medium scrollbar-none">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'dashboard' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('monthlyData')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'monthlyData' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            Monthly Data ({recordsCount})
          </button>
          <button
            onClick={() => onSelectTab('charts')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'charts' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            Charts
          </button>
          <button
            onClick={() => onSelectTab('troubleshoot')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'troubleshoot' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
            }`}
          >
            AI Troubleshoot
          </button>
          <button
            onClick={() => onSelectTab('calculators')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'calculators' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            Safety Tools
          </button>
        </div>
      </div>
    </header>
  );
};
