import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RobuxFlowDiagram } from './components/RobuxFlowDiagram';
import { DevExCalculator } from './components/DevExCalculator';
import { MasterGuide } from './components/MasterGuide';
import { MonetizationBuilder } from './components/MonetizationBuilder';
import { EconomySimulator } from './components/EconomySimulator';
import { CodeGenerator } from './components/CodeGenerator';
import { UkTaxGuide } from './components/UkTaxGuide';
import { DollarSign, Gamepad2, Calculator, Code2, BookOpen, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('roadmap');

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
              <div className="text-xs text-slate-400">Developer Exchange (DevEx) & Studio Growth Suite</div>
              <h1 className="text-sm sm:text-base font-bold text-white font-display">
                Earn Real Money from Roblox Games & Cash Out into British Pounds (£ GBP)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:block text-right">
              <span className="text-[11px] text-slate-400 block">DevEx Exchange Rate</span>
              <span className="font-mono text-emerald-400 font-bold">$0.0035 USD / 1 R$</span>
            </div>
            <div className="h-7 w-px bg-slate-800 hidden sm:block" />
            <div className="hidden sm:block text-right">
              <span className="text-[11px] text-slate-400 block">Min Threshold</span>
              <span className="font-mono text-slate-200 font-bold">30,000 R$ (~£82)</span>
            </div>
            <div className="h-7 w-px bg-slate-800 hidden sm:block" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">US-UK Treaty (W-8BEN)</span>
              <span className="font-mono text-teal-300 font-bold">0% US Tax</span>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Body */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <RobuxFlowDiagram />
            <MasterGuide />
            
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('devex')}
                className="p-4 bg-[#101726] border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-xs font-bold text-white mb-1">DevEx £ Calculator</div>
                <p className="text-[11px] text-slate-400">Calculate net British Pounds from gross Robux sales and test different cashout amounts.</p>
              </button>

              <button
                onClick={() => setActiveTab('architect')}
                className="p-4 bg-[#101726] border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-xs font-bold text-white mb-1">Catalog Architect</div>
                <p className="text-[11px] text-slate-400">Design high-converting game passes, consumable potions, and recurring subscriptions.</p>
              </button>

              <button
                onClick={() => setActiveTab('luau')}
                className="p-4 bg-[#101726] border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="text-xs font-bold text-white mb-1">Luau Code Generator</div>
                <p className="text-[11px] text-slate-400">Copy server-authoritative MarketplaceService scripts with bulletproof ProcessReceipt.</p>
              </button>
            </div>
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
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#080c13] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">BloxMonetize Studio</span>
            <span>·</span>
            <span>Roblox Developer Exchange (DevEx) & Monetization Suite</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>DevEx Rate: $0.0035 / R$</span>
            <span>·</span>
            <span>Platform Fee: 30%</span>
            <span>·</span>
            <span>UK Form W-8BEN Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
