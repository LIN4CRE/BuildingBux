import React, { useState } from 'react';
import { DollarSign, Gamepad2, Calculator, Code2, BookOpen, ShieldCheck, Sparkles, Rocket, FolderDown, Volume2, VolumeX, HelpCircle, Trophy, FolderKanban, MessageSquare } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon } from './Icons';
import { sounds } from '../utils/audio';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMilestones?: () => void;
  unlockedMilestonesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenMilestones, unlockedMilestonesCount = 3 }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.enabled);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundEnabled(sounds.enabled);
    if (sounds.enabled) {
      sounds.playCoin();
    }
  };

  const handleTabClick = (tabId: string) => {
    sounds.playClick();
    setActiveTab(tabId);
  };

  const navItems = [
    { id: 'hitgames', label: 'Hit Games (Fisch, Steal...)', icon: Sparkles },
    { id: 'portfolio', label: 'Game Portfolio', icon: FolderKanban },
    { id: 'polls', label: 'Community Polls', icon: MessageSquare },
    { id: 'launch', label: '7-Day Launch Guide', icon: Rocket },
    { id: 'toolkit', label: 'Free Asset Links', icon: FolderDown },
    { id: 'roadmap', label: 'Monetization Guide', icon: BookOpen },
    { id: 'devex', label: '£ DevEx Cashout', icon: DollarSign },
    { id: 'architect', label: 'Catalog Architect', icon: Gamepad2 },
    { id: 'simulator', label: 'Economy Simulator', icon: Calculator },
    { id: 'luau', label: 'Luau Scripts', icon: Code2 },
    { id: 'uktax', label: 'UK Tax & Bank', icon: ShieldCheck },
    { id: 'faq', label: 'Creator FAQ', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070b12]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with custom Robux emblem */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleTabClick('hitgames')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400/50 transition-all shadow-sm shadow-emerald-500/10">
              <RobuxIcon className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors font-display">
              BloxMonetize <span className="text-emerald-400 font-semibold">Studio</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/90 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Medium screens secondary nav compact strip */}
        <div className="hidden md:flex xl:hidden items-center gap-1 text-xs">
          <button
            onClick={() => handleTabClick('hitgames')}
            className={`px-2.5 py-1 rounded cursor-pointer ${activeTab === 'hitgames' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
          >
            Hit Games
          </button>
          <button
            onClick={() => handleTabClick('launch')}
            className={`px-2.5 py-1 rounded cursor-pointer ${activeTab === 'launch' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
          >
            Launch
          </button>
          <button
            onClick={() => handleTabClick('toolkit')}
            className={`px-2.5 py-1 rounded cursor-pointer ${activeTab === 'toolkit' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
          >
            Assets
          </button>
          <button
            onClick={() => handleTabClick('devex')}
            className={`px-2.5 py-1 rounded cursor-pointer ${activeTab === 'devex' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
          >
            £ DevEx
          </button>
        </div>

        {/* Zone 3: Primary actions & sound toggle */}
        <div className="flex items-center gap-2">
          {/* Milestone Trophy Rack Button */}
          {onOpenMilestones && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenMilestones();
              }}
              className="px-2.5 py-1.5 rounded-lg text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="View Project Milestones & Achievement Rack"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">{unlockedMilestonesCount}/7</span>
            </button>
          )}

          {/* Audio toggle button */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Studio tactile sounds' : 'Enable Studio tactile sounds'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          <button
            onClick={() => handleTabClick('devex')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer"
          >
            <SterlingCoinIcon className="w-3.5 h-3.5" />
            <span>DevEx Calculator</span>
          </button>
        </div>
      </div>

      {/* Mobile / Compact sub-bar */}
      <div className="xl:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-800/80 overflow-x-auto bg-[#070b12]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
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
