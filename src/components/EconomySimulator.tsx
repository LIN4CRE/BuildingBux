import React, { useState } from 'react';
import { Users, Coins, Sparkles, TrendingUp, Calendar, Clock, HelpCircle, BarChart3, Sliders, Layers } from 'lucide-react';

export const EconomySimulator: React.FC = () => {
  // Mode switcher: 'arpdau' (DAU & ARPDAU Model) vs 'funnel' (CCU & Spender Funnel Model)
  const [calculationMode, setCalculationMode] = useState<'arpdau' | 'funnel'>('arpdau');

  // Common Financial Constants
  const DEVEX_RATE = 0.0035; // $0.0035 USD per 1 Earned Robux
  const [usdToGbpRate, setUsdToGbpRate] = useState<number>(0.78); // £0.78 per $1 USD

  // Model 1: DAU & ARPDAU Parameters
  const [dauInput, setDauInput] = useState<number>(25000); // 25,000 DAU
  const [arpdauRobux, setArpdauRobux] = useState<number>(0.65); // 0.65 Robux per DAU

  // Model 2: CCU & Spender Funnel Parameters
  const [ccu, setCcu] = useState<number>(250); // Concurrent players
  const [dauRatio, setDauRatio] = useState<number>(10); // Daily unique players = CCU * 10
  const [conversionRate, setConversionRate] = useState<number>(2.5); // 2.5% of players spend Robux
  const [arppu, setArppu] = useState<number>(280); // Average Robux spent by paying user
  const [premiumShare, setPremiumShare] = useState<number>(18); // 18% of players have Roblox Premium
  const [avgSessionMins, setAvgSessionMins] = useState<number>(16); // Average session length in minutes

  // --- MODEL 1: DAU + ARPDAU CALCULATIONS ---
  const arpdauDailyGrossRobux = Math.round(dauInput * arpdauRobux);
  const arpdauDailyNetRobux = Math.round(arpdauDailyGrossRobux * 0.7); // 70% creator share
  const arpdauMonthlyGrossRobux = arpdauDailyGrossRobux * 30;
  const arpdauMonthlyNetRobux = arpdauDailyNetRobux * 30;
  const arpdauMonthlyDevExUsd = arpdauMonthlyNetRobux * DEVEX_RATE;
  const arpdauMonthlyDevExGbp = arpdauMonthlyDevExUsd * usdToGbpRate;
  const arpdauAnnualDevExGbp = arpdauMonthlyDevExGbp * 12;

  // --- MODEL 2: CCU FUNNEL CALCULATIONS ---
  const funnelDau = ccu * dauRatio;
  const dailySpenders = Math.round(funnelDau * (conversionRate / 100));
  const dailyGrossGameRobux = dailySpenders * arppu;
  const totalDailyHours = funnelDau * (avgSessionMins / 60);
  const dailyPremiumHours = totalDailyHours * (premiumShare / 100);
  const dailyPremiumRobux = Math.round((dailyPremiumHours / 1000) * 380);
  const dailyNetStoreRobux = Math.round(dailyGrossGameRobux * 0.7);
  const funnelDailyTotalNetRobux = dailyNetStoreRobux + dailyPremiumRobux;
  const funnelMonthlyNetRobux = funnelDailyTotalNetRobux * 30;
  const funnelMonthlyDevExUsd = funnelMonthlyNetRobux * DEVEX_RATE;
  const funnelMonthlyDevExGbp = funnelMonthlyDevExUsd * usdToGbpRate;
  const funnelAnnualDevExGbp = funnelMonthlyDevExGbp * 12;

  // Genre ARPDAU Benchmarks
  const arpdauPresets = [
    { name: 'Casual Obby / Tower', arpdau: 0.15, note: 'Low ARPDAU, relies on huge viral volume' },
    { name: 'Base Tycoon / Merger', arpdau: 0.55, note: 'Medium ARPDAU with auto-collect passes' },
    { name: 'Pet / Simulator', arpdau: 1.25, note: 'High ARPDAU driven by eggs & boosts' },
    { name: 'Anime RPG / Gacha', arpdau: 2.80, note: 'Very High ARPDAU driven by repeat spins' },
  ];

  return (
    <div className="space-y-6">
      {/* Header section with Mode Selector */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white font-display">
              Roblox Game Economy & Revenue Simulator
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Forecast your projected monthly and annual DevEx earnings in British Pounds (£) using either estimated Daily Active Users (DAU) & ARPDAU or the CCU Spender Funnel.
            </p>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start md:self-auto">
            <button
              onClick={() => setCalculationMode('arpdau')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                calculationMode === 'arpdau'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>DAU & ARPDAU Engine</span>
            </button>
            <button
              onClick={() => setCalculationMode('funnel')}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                calculationMode === 'funnel'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>CCU Spender Funnel</span>
            </button>
          </div>
        </div>

        {/* -------------------- MODE 1: DAU & ARPDAU ENGINE -------------------- */}
        {calculationMode === 'arpdau' && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daily Active Users (DAU) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Estimated Daily Active Users (DAU)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{dauInput.toLocaleString()} DAU</span>
                </div>
                <input
                  type="number"
                  min="500"
                  max="500000"
                  step="2500"
                  value={dauInput}
                  onChange={(e) => setDauInput(Math.max(100, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <button onClick={() => setDauInput(5000)} className="hover:text-emerald-400">5k (Small)</button>
                  <button onClick={() => setDauInput(25000)} className="hover:text-emerald-400">25k (Growing)</button>
                  <button onClick={() => setDauInput(100000)} className="hover:text-emerald-400">100k (Front Page)</button>
                </div>
              </div>

              {/* ARPDAU in Robux */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    ARPDAU (Average Robux / DAU)
                  </span>
                  <span className="font-mono text-amber-400 font-bold">{arpdauRobux.toFixed(2)} R$ / user</span>
                </div>
                <input
                  type="number"
                  min="0.05"
                  max="10.0"
                  step="0.05"
                  value={arpdauRobux}
                  onChange={(e) => setArpdauRobux(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
                <div className="text-[11px] text-slate-400">
                  Equivalent to <span className="font-mono text-emerald-400 font-semibold">£{(arpdauRobux * 0.7 * DEVEX_RATE * usdToGbpRate).toFixed(4)}</span> net GBP earned per daily player.
                </div>
              </div>

              {/* USD to GBP Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">USD to GBP (£) Conversion</span>
                  <span className="font-mono text-slate-400">$1 = £{usdToGbpRate.toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  min="0.5"
                  max="1.2"
                  step="0.01"
                  value={usdToGbpRate}
                  onChange={(e) => setUsdToGbpRate(parseFloat(e.target.value) || 0.78)}
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
                <div className="text-[10px] text-slate-500">
                  DevEx Rate: fixed at $0.0035 USD per Earned Robux.
                </div>
              </div>
            </div>

            {/* Quick Benchmark Preset Buttons */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Or Select Industry ARPDAU Benchmark:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {arpdauPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setArpdauRobux(preset.arpdau)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      Math.abs(arpdauRobux - preset.arpdau) < 0.01
                        ? 'bg-slate-800 border-emerald-500/60 text-white'
                        : 'bg-[#0b0f17] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{preset.name}</span>
                      <span className="font-mono text-amber-400">{preset.arpdau} R$</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{preset.note}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------- MODE 2: CCU FUNNEL ENGINE -------------------- */}
        {calculationMode === 'funnel' && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CCU Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    Concurrent Players (CCU)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{ccu.toLocaleString()} CCU</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="5000"
                  step="10"
                  value={ccu}
                  onChange={(e) => setCcu(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10 (Indie)</span>
                  <span>500 (Hit)</span>
                  <span>5,000 (Front Page)</span>
                </div>
              </div>

              {/* Conversion % */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Spender Conversion Rate
                  </span>
                  <span className="font-mono text-amber-400 font-bold">{conversionRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.5% (Low)</span>
                  <span>2.5% (Avg)</span>
                  <span>5.0%+ (High)</span>
                </div>
              </div>

              {/* ARPPU */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                    Avg Robux Per Spender (ARPPU)
                  </span>
                  <span className="font-mono text-sky-400 font-bold">{arppu} R$</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={arppu}
                  onChange={(e) => setArppu(parseInt(e.target.value))}
                  className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>50 R$</span>
                  <span>280 R$</span>
                  <span>1,000 R$</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Daily Revenue */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Daily Earnings
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {calculationMode === 'arpdau' ? `${dauInput.toLocaleString()} Daily Players` : '24-hour cycle'}
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {(calculationMode === 'arpdau' ? arpdauDailyNetRobux : funnelDailyTotalNetRobux).toLocaleString()}{' '}
              <span className="text-xs text-emerald-400">Net R$ / day</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              ~<span className="text-emerald-300 font-semibold">
                £{((calculationMode === 'arpdau' ? arpdauDailyNetRobux : funnelDailyTotalNetRobux) * DEVEX_RATE * usdToGbpRate).toFixed(2)}
              </span> / day via DevEx
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Gross Player Spend:</span>
              <span className="font-mono text-slate-200">
                {(calculationMode === 'arpdau' ? arpdauDailyGrossRobux : dailyGrossGameRobux).toLocaleString()} R$
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Roblox 30% Marketplace Cut:</span>
              <span className="font-mono text-rose-400">
                -{((calculationMode === 'arpdau' ? arpdauDailyGrossRobux : dailyGrossGameRobux) * 0.3).toFixed(0)} R$
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Projected Monthly DevEx (£) */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Calendar className="w-3.5 h-3.5" />
              Projected Monthly DevEx (£)
            </span>
            <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/50">
              30 Days
            </span>
          </div>

          <div>
            <div className="text-3xl font-black font-mono text-emerald-300">
              £{(calculationMode === 'arpdau' ? arpdauMonthlyDevExGbp : funnelMonthlyDevExGbp).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              ${(calculationMode === 'arpdau' ? arpdauMonthlyDevExUsd : funnelMonthlyDevExUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD ({(calculationMode === 'arpdau' ? arpdauMonthlyNetRobux : funnelMonthlyNetRobux).toLocaleString()} Net R$)
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-slate-300">
            {(calculationMode === 'arpdau' ? arpdauMonthlyDevExGbp : funnelMonthlyDevExGbp) > 2500 ? (
              <span className="text-emerald-400 font-semibold">
                Surpasses average UK full-time median salary (£2,400/mo)!
              </span>
            ) : (calculationMode === 'arpdau' ? arpdauMonthlyDevExGbp : funnelMonthlyDevExGbp) > 1000 ? (
              <span className="text-teal-300 font-medium">
                Solid side income. Exceeds HMRC £1k allowance.
              </span>
            ) : (
              <span className="text-slate-400">
                Great launch foundation. Scale DAU via weekend updates!
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Annualized Run-Rate */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Annualized Run Rate
            </span>
            <span className="text-[11px] font-mono text-slate-500">12 Months</span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-white">
              £{(calculationMode === 'arpdau' ? arpdauAnnualDevExGbp : funnelAnnualDevExGbp).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              ~{((calculationMode === 'arpdau' ? arpdauMonthlyNetRobux : funnelMonthlyNetRobux) * 12).toLocaleString()} Net R$ / Year
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Assumes consistent retention. Live-ops weekend updates typically cause 2x-3x spikes!
          </div>
        </div>
      </div>

      {/* ARPDAU Mathematical Breakdown Box */}
      <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5">
        <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          The DAU & ARPDAU Monetization Formula Explained
        </h2>
        <div className="text-xs text-slate-400 space-y-2">
          <p className="leading-relaxed">
            <strong>ARPDAU</strong> (Average Revenue Per Daily Active User) is the gold-standard metric top game studios use to measure monetization health regardless of player count:
          </p>
          <div className="p-3 bg-[#080c13] border border-slate-800 rounded font-mono text-emerald-300 text-xs overflow-x-auto">
            Monthly DevEx (£) = DAU × ARPDAU (in R$) × 30 days × 0.70 (Creator Cut) × $0.0035 (DevEx) × £0.78 (Exchange Rate)
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            For example: At <strong>25,000 DAU</strong> with an ARPDAU of <strong>0.65 R$</strong>, your game generates <strong>487,500 Gross Robux</strong>/month. After Roblox's 30% platform fee, you net <strong>341,250 Robux</strong>, which cashes out via DevEx into <strong>$1,194.38 USD (~£931.61 GBP)</strong> every month.
          </p>
        </div>
      </div>
    </div>
  );
};
