import React from 'react';
import { DollarSign, Gamepad2, Calculator, Code2, BookOpen, ShieldCheck, ArrowRightLeft, Sparkles, Rocket, FolderDown } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'hitgames', label: 'Hit Games (Fisch, Steal...)', icon: Sparkles },
    { id: 'launch', label: '7-Day Launch Guide', icon: Rocket },
    { id: 'toolkit', label: 'Free Asset Links', icon: FolderDown },
    { id: 'roadmap', label: 'Monetization Guide', icon: BookOpen },
    { id: 'devex', label: '£ DevEx Cashout', icon: DollarSign },
    { id: 'architect', label: 'Catalog Architect', icon: Gamepad2 },
    { id: 'simulator', label: 'Economy Simulator', icon: Calculator },
    { id: 'luau', label: 'Luau Scripts', icon: Code2 },
    { id: 'uktax', label: 'UK Tax & Bank', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <button 
            onClick={() => setActiveTab('hitgames')}
            className="text-left group cursor-pointer"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors font-display">
              BloxMonetize <span className="text-emerald-400">Studio</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Medium screens secondary nav dropdown / compact strip */}
        <div className="hidden md:flex xl:hidden items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('hitgames')}
            className={`px-2.5 py-1 rounded ${activeTab === 'hitgames' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
          >
            Hit Games
          </button>
          <button
            onClick={() => setActiveTab('launch')}
            className={`px-2.5 py-1 rounded ${activeTab === 'launch' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
          >
            Launch
          </button>
          <button
            onClick={() => setActiveTab('toolkit')}
            className={`px-2.5 py-1 rounded ${activeTab === 'toolkit' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
          >
            Free Assets
          </button>
          <button
            onClick={() => setActiveTab('devex')}
            className={`px-2.5 py-1 rounded ${activeTab === 'devex' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
          >
            £ DevEx
          </button>
        </div>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('devex')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="font-mono font-bold">£</span>
            <span>DevEx Calculator</span>
          </button>
        </div>
      </div>

      {/* Mobile / Compact sub-bar */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-800/80 overflow-x-auto bg-[#080c13]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
