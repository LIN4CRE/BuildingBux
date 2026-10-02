import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RobuxFlowDiagram } from './components/RobuxFlowDiagram';
import { DevExCalculator } from './components/DevExCalculator';
import { MasterGuide } from './components/MasterGuide';
import { MonetizationBuilder } from './components/MonetizationBuilder';
import { EconomySimulator } from './components/EconomySimulator';
import { CodeGenerator } from './components/CodeGenerator';
import { UkTaxGuide } from './components/UkTaxGuide';
import { HitGamesGuide } from './components/HitGamesGuide';
import { PublishingGuide } from './components/PublishingGuide';
import { FreeToolkit } from './components/FreeToolkit';
import { CreatorFaq } from './components/CreatorFaq';
import { DollarSign, Gamepad2, Calculator, Code2, BookOpen, ShieldCheck, ArrowRight, Sparkles, Rocket, FolderDown, HelpCircle } from 'lucide-react';
import { sounds } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('hitgames');

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Contract */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Hero Trust Strip */}
        <section className="bg-gradient-to-r from-slate-900/90 via-[#101726] to-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Zero-Cost Studio Guide & £ DevEx Engine</div>
              <h1 className="text-sm sm:text-base font-bold text-white font-display">
                How to Build Hit Roblox Games (Fisch, Blade Ball, Steal Games) for Free & Cash Out to £
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:block text-right">
              <span className="text-[11px] text-slate-400 block">DevEx Rate</span>
              <span className="font-mono text-emerald-400 font-bold">$0.0035 USD / 1 R$</span>
            </div>
            <div className="h-7 w-px bg-slate-800 hidden sm:block" />
            <div className="hidden sm:block text-right">
              <span className="text-[11px] text-slate-400 block">Development Cost</span>
              <span className="font-mono text-emerald-300 font-bold">100% Free Tools</span>
            </div>
            <div className="h-7 w-px bg-slate-800 hidden sm:block" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">US-UK Treaty (W-8BEN)</span>
              <span className="font-mono text-teal-300 font-bold">0% US Tax</span>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Body */}
        {activeTab === 'hitgames' && (
          <div className="space-y-8">
            <HitGamesGuide />
            
            {/* Quick action jump grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('launch');
                }}
                className="p-4 bg-[#101726] border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-xs font-bold text-white mb-1">7-Day Step-by-Step Launch</div>
                <p className="text-[11px] text-slate-400">How to get your prototype on Roblox in 7 days without paying for ads.</p>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('toolkit');
                }}
                className="p-4 bg-[#101726] border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <FolderDown className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-xs font-bold text-white mb-1">Free 3D & Audio Links</div>
                <p className="text-[11px] text-slate-400">Kenney CC0 assets, Quaternius 3D models, Photopea, and Roblox free APM music.</p>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('devex');
                }}
                className="p-4 bg-[#101726] border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-xs font-bold text-white mb-1">DevEx £ Cashout Engine</div>
                <p className="text-[11px] text-slate-400">Calculate Robux conversion into real British Pounds (£) directly in your bank.</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'launch' && (
          <div className="space-y-8">
            <PublishingGuide />
          </div>
        )}

        {activeTab === 'toolkit' && (
          <div className="space-y-8">
            <FreeToolkit />
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <RobuxFlowDiagram />
            <MasterGuide />
          </div>
        )}

        {activeTab === 'devex' && (
          <div className="space-y-8">
            <RobuxFlowDiagram />
            <DevExCalculator />
          </div>
        )}

        {activeTab === 'architect' && (
          <div className="space-y-8">
            <MonetizationBuilder />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-8">
            <EconomySimulator />
          </div>
        )}

        {activeTab === 'luau' && (
          <div className="space-y-8">
            <CodeGenerator />
          </div>
        )}

        {activeTab === 'uktax' && (
          <div className="space-y-8">
            <UkTaxGuide />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-8">
            <CreatorFaq />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#080c13] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">BloxMonetize Studio</span>
            <span>·</span>
            <span>Zero-Cost Roblox Game Development & £ DevEx Engine</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Free Tools</span>
            <span>·</span>
            <span>DevEx Rate: $0.0035 / R$</span>
            <span>·</span>
            <span>UK Form W-8BEN (0% US Tax)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
