import React, { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, CheckCircle2, TrendingUp, HelpCircle, ArrowUpRight, ArrowLeftRight, Sparkles, X, ExternalLink, PartyPopper } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon, DevExVaultIcon, RobuxGoldIcon } from './Icons';
import { sounds } from '../utils/audio';

export const DevExCalculator: React.FC = () => {
  // Gross Robux in-game sales
  const [grossRobux, setGrossRobux] = useState<number>(100000);
  const [usdToGbpRate, setUsdToGbpRate] = useState<number>(0.78); // £0.78 per $1 USD (~ £1 = $1.28 USD)
  const [isGrossInput, setIsGrossInput] = useState<boolean>(true); // true = gross sales, false = net earned robux

  // Target Reverse Calculator
  const [targetGbp, setTargetGbp] = useState<number>(1000); // e.g. "I want to earn £1,000/mo"

  // Calculate Net Earned Robux
  const netRobux = isGrossInput ? Math.round(grossRobux * 0.7) : grossRobux;
  const robloxMarketplaceCut = isGrossInput ? Math.round(grossRobux * 0.3) : Math.round((grossRobux / 0.7) * 0.3);

  // Official DevEx Rate: $0.0035 USD per 1 Earned Robux
  const DEVEX_RATE_USD = 0.0035;
  const MIN_DEVEX_THRESHOLD = 30000; // 30,000 Robux is the official minimum threshold

  const devexUsd = netRobux * DEVEX_RATE_USD;
  const devexGbp = devexUsd * usdToGbpRate;
  const qualifies = netRobux >= MIN_DEVEX_THRESHOLD;

  // Threshold Toast Notification State
  const [showThresholdToast, setShowThresholdToast] = useState<boolean>(qualifies);
  const [prevQualifies, setPrevQualifies] = useState<boolean>(qualifies);

  useEffect(() => {
    if (qualifies && !prevQualifies) {
      sounds.playSuccess();
      setShowThresholdToast(true);
    }
    setPrevQualifies(qualifies);
  }, [qualifies, prevQualifies]);

  // Reverse Math: Target GBP -> Required Net Robux -> Required Gross Sales
  const targetUsd = targetGbp / usdToGbpRate;
  const requiredNetRobux = Math.ceil(targetUsd / DEVEX_RATE_USD);
  const requiredGrossRobux = Math.ceil(requiredNetRobux / 0.7);

  // Preset Milestones
  const presets = [
    { label: '30,000 R$ (Min)', netVal: 30000 },
    { label: '50,000 R$', netVal: 50000 },
    { label: '100,000 R$', netVal: 100000 },
    { label: '500,000 R$', netVal: 500000 },
    { label: '1,000,000 R$', netVal: 1000000 },
    { label: '5,000,000 R$', netVal: 5000000 },
  ];

  // UK Tax estimation
  const tradingAllowance = 1000;
  const taxableGbp = Math.max(0, devexGbp - tradingAllowance);
  const estimatedBasicTax = taxableGbp * 0.20;
  const netGbpAfterTax = devexGbp - estimatedBasicTax;

  const handlePresetClick = (netTarget: number) => {
    sounds.playCoin();
    if (isGrossInput) {
      setGrossRobux(Math.round(netTarget / 0.7));
    } else {
      setGrossRobux(netTarget);
    }
  };

  // Next Tier Progress calculation
  const nextMilestone = netRobux < 30000 ? 30000 : netRobux < 100000 ? 100000 : netRobux < 1000000 ? 1000000 : 5000000;
  const progressToNext = Math.min(100, Math.round((netRobux / nextMilestone) * 100));

  return (
    <div className="space-y-6">
      {/* Celebratory 30,000 Threshold Toast Notification */}
      {showThresholdToast && qualifies && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-emerald-950/80 border border-emerald-500/50 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-emerald-950/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-display">
                  🎉 DevEx Threshold Unlocked (≥ 30,000 Earned Robux)!
                </h3>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  Ready to Cash Out
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                Your current balance qualifies for an official cashout of <strong className="text-white">${devexUsd.toFixed(2)} USD (~£{devexGbp.toFixed(2)} GBP)</strong>! You can now submit your request on the Roblox Creator Hub.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <a
              href="https://create.roblox.com/dashboard/devex"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Open DevEx Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setShowThresholdToast(false)}
              className="p-1.5 text-emerald-300 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-emerald-900/40"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
              <DevExVaultIcon className="w-4 h-4" />
              <span>Official Roblox Developer Exchange Formula</span>
            </div>
            <h1 className="text-xl font-bold text-white font-display">
              Roblox DevEx to British Pounds (£) Calculator
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Calculate exact cashouts from Roblox Developer Exchange directly into GBP (£) based on the official fixed exchange rate ($0.0035 USD per Robux).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Mode:</span>
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsGrossInput(true);
                }}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  isGrossInput ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In-Game Sales (Gross)
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsGrossInput(false);
                }}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  !isGrossInput ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Earned Robux (Net)
              </button>
            </div>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <RobuxIcon className="w-3.5 h-3.5" />
                <span>{isGrossInput ? 'Gross In-Game Robux Sales' : 'Net Earned Robux (DevEx Balance)'}</span>
              </label>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {grossRobux.toLocaleString()} R$
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="5000"
                value={grossRobux}
                onChange={(e) => setGrossRobux(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Enter Robux amount..."
              />
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePresetClick(p.netVal)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RobuxGoldIcon className="w-3 h-3" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <SterlingCoinIcon className="w-3.5 h-3.5" />
                <span>USD to GBP (£) Rate</span>
              </label>
              <span className="text-xs font-mono text-slate-400">
                $1.00 = £{usdToGbpRate.toFixed(2)}
              </span>
            </div>
            <input
              type="number"
              min="0.5"
              max="1.2"
              step="0.01"
              value={usdToGbpRate}
              onChange={(e) => setUsdToGbpRate(parseFloat(e.target.value) || 0.78)}
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Tipalti automatically converts at wholesale bank rates directly into your UK bank.
            </p>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/60">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">
              Progress to {nextMilestone.toLocaleString()} R$ Milestone
            </span>
            <span className="font-mono text-emerald-400 font-semibold">{progressToNext}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Sales */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <RobuxGoldIcon className="w-3.5 h-3.5" />
              In-Game Gross Sales
            </span>
            <span className="text-[10px] text-slate-500 font-mono">100% Vol</span>
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {(isGrossInput ? grossRobux : Math.round(grossRobux / 0.7)).toLocaleString()} <span className="text-xs text-amber-400">R$</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
            Roblox 30% Fee: <span className="font-mono text-rose-400">-{robloxMarketplaceCut.toLocaleString()} R$</span>
          </div>
        </div>

        {/* Card 2: Net Earned Robux */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <RobuxIcon className="w-3.5 h-3.5" />
              Net Earned Robux
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">70% Creator Cut</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {netRobux.toLocaleString()} <span className="text-xs">R$</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
            {qualifies ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Eligible for DevEx (≥ 30k)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Need {(MIN_DEVEX_THRESHOLD - netRobux).toLocaleString()} more R$
              </span>
            )}
          </div>
        </div>

        {/* Card 3: DevEx Payout in USD */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-sky-400" />
              DevEx Payout (USD)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">$0.0035/R$</span>
          </div>
          <div className="text-xl font-bold font-mono text-sky-400 tabular-nums">
            ${devexUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
            Form W-8BEN: <span className="text-teal-300 font-medium">0% US Tax Withheld</span>
          </div>
        </div>

        {/* Card 4: Net Payout in British Pounds */}
        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 relative overflow-hidden shadow-lg shadow-emerald-950/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          <div className="text-xs text-emerald-300/80 flex items-center justify-between mb-1">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <SterlingCoinIcon className="w-3.5 h-3.5" />
              Net British Pounds (£)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50">UK Bank</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300 tabular-nums">
            £{devexGbp.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-300 mt-2 pt-2 border-t border-emerald-500/20">
            Direct Wire / BACS Transfer into UK Account
          </div>
        </div>
      </div>

      {/* Reverse Calculator: "I want to earn £X/mo - How much Robux do I need?" */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              Target Earnings Planner (Reverse DevEx Calculator)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Enter your desired monthly income in British Pounds (£) to see exactly how much Robux your game must generate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Target Monthly £:</span>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-emerald-400 font-bold">£</span>
              <input
                type="number"
                min="100"
                step="250"
                value={targetGbp}
                onChange={(e) => setTargetGbp(Math.max(10, parseInt(e.target.value) || 0))}
                className="w-28 bg-[#0b0f17] border border-slate-700 rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[11px] block mb-1">Required Net Earned Robux</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {requiredNetRobux.toLocaleString()} <span className="text-xs">R$</span>
            </div>
            <span className="text-[10px] text-slate-500">Credited after Roblox 30% fee</span>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[11px] block mb-1">Required Gross Player Spending</span>
            <div className="text-lg font-bold font-mono text-amber-400">
              {requiredGrossRobux.toLocaleString()} <span className="text-xs">R$</span>
            </div>
            <span className="text-[10px] text-slate-500">Total in-game store sales volume</span>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[11px] block mb-1">Required Daily Traffic (at 0.65 R$ ARPDAU)</span>
            <div className="text-lg font-bold font-mono text-sky-400">
              ~{Math.round(requiredGrossRobux / (0.65 * 30)).toLocaleString()} <span className="text-xs">DAU</span>
            </div>
            <span className="text-[10px] text-slate-500">Estimated ~{Math.round(requiredGrossRobux / (0.65 * 30 * 10))} Concurrent (CCU)</span>
          </div>
        </div>
      </div>

      {/* Official Roblox Portals & Analytics Quick Link Bar */}
      <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          Official Roblox & UK Financial Portals
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Quick links to official Roblox developer portals and UK tax documentation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          <a
            href="https://create.roblox.com/dashboard/creations"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#080c13] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Roblox Analytics Hub</div>
              <div className="text-[10px] text-slate-500">Track D1/D7 retention &amp; ARPPU</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </a>

          <a
            href="https://create.roblox.com/dashboard/devex"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#080c13] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Roblox DevEx Portal</div>
              <div className="text-[10px] text-slate-500">Official cashout submission</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </a>

          <a
            href="https://suppliers.tipalti.com/roblox"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#080c13] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Tipalti Supplier Portal</div>
              <div className="text-[10px] text-slate-500">Bank wire &amp; W-8BEN treaty form</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </a>

          <a
            href="https://devforum.roblox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#080c13] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Roblox DevForum</div>
              <div className="text-[10px] text-slate-500">Official developer community</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
