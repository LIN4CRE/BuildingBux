import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Landmark, Sparkles, Coins } from 'lucide-react';

export const RobuxFlowDiagram: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Player Spends Robux',
      detail: 'Player buys GamePass, DevProduct, or spends time as a Roblox Premium player.',
      metric: '100% Gross Robux',
      icon: Coins,
      accent: 'text-amber-400 border-amber-500/20 bg-amber-500/10'
    },
    {
      num: '2',
      title: 'Roblox 30% Fee',
      detail: 'Roblox deducts a standard 30% marketplace platform fee. You keep 70% in escrow.',
      metric: '70% Net Robux',
      icon: Shield,
      accent: 'text-blue-400 border-blue-500/20 bg-blue-500/10'
    },
    {
      num: '3',
      title: '3-7 Day Fraud Escrow',
      detail: 'Earnings sit in Pending Sales to prevent chargebacks, then clear into Earned Robux balance.',
      metric: 'Cleared Earned Robux',
      icon: CheckCircle2,
      accent: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10'
    },
    {
      num: '4',
      title: 'DevEx Request (30k+ R$)',
      detail: 'Once you reach 30,000 Earned Robux, you submit a DevEx cashout via Creator Hub.',
      metric: 'Rate: $0.0035 / R$',
      icon: Sparkles,
      accent: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
    },
    {
      num: '5',
      title: 'Tipalti & W-8BEN (0% US Tax)',
      detail: 'Tipalti processes the payout. UK residents file W-8BEN (Treaty Art 12) for 0% US withholding.',
      metric: '100% Payout Retained',
      icon: Landmark,
      accent: 'text-teal-400 border-teal-500/20 bg-teal-500/10'
    },
    {
      num: '6',
      title: 'UK Bank Deposit in £',
      detail: 'Direct wire or transfer arrives in your UK bank account in British Pounds Sterling (£ GBP).',
      metric: 'Real £ in Bank',
      icon: Landmark,
      accent: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/20'
    }
  ];

  return (
    <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800/80 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white font-display">The Complete Robux-to-£ Financial Pipeline</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            How player transactions convert from virtual Roblox tokens into real British Pounds in your UK bank account
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Official DevEx Rate:</span>
          <span className="font-mono font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            $0.0035 USD / 1 R$
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-[#0b0f17] border border-slate-800/80 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono font-bold text-slate-300 flex items-center justify-center">
                    {step.num}
                  </span>
                  <div className={`p-1.5 rounded-md border ${step.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">{step.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {step.detail}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="font-mono text-emerald-400 font-medium">{step.metric}</span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block w-3 h-3 text-slate-600 -mr-4 z-10" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
