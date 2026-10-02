import React, { useState, useEffect } from 'react';
import { Users, Coins, Sparkles, TrendingUp, Calendar, Clock, HelpCircle, BarChart3, Sliders, Layers, ArrowUpRight, TrendingDown, ExternalLink, Lightbulb, Zap, Tag, Timer, ShoppingBag, CheckCircle2, AlertTriangle, ArrowRight, Trophy, Percent, Shield, FileSpreadsheet, Flame, Activity, X, ChevronRight, Check } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon, DevExVaultIcon, RobuxGoldIcon } from './Icons';
import { sounds } from '../utils/audio';
import { calculateUkTaxBands, evaluateMilestones, Milestone } from '../utils/milestones';
import { MONETIZATION_HEATMAP, HEATMAP_COLUMNS, HeatmapRow, HeatmapCell } from '../data/monetizationHeatmapData';
import { MilestoneModal } from './MilestoneNotificationSystem';

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

  // 12-Month Projection Parameters
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<number>(10); // 10% monthly user growth
  const [monthlyChurnRate, setMonthlyChurnRate] = useState<number>(4); // 4% monthly player churn/decay
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Optimization Strategy Switchboard
  const [applyStarterPack, setApplyStarterPack] = useState<boolean>(true);
  const [applyWeekendLTO, setApplyWeekendLTO] = useState<boolean>(true);
  const [applyUIOptimization, setApplyUIOptimization] = useState<boolean>(false);

  // Financial Summary: Business Expenses Percentage (0% to 30%, default 15%)
  const [allowableExpensePercent, setAllowableExpensePercent] = useState<number>(15);

  // Heatmap State
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{
    row: HeatmapRow;
    colKey: string;
    colLabel: string;
    cell: HeatmapCell;
  } | null>({
    row: MONETIZATION_HEATMAP[2], // Gacha Spins & Luck Potions
    colKey: 'weekend',
    colLabel: 'Weekend Event',
    cell: MONETIZATION_HEATMAP[2].timelines.weekend
  });

  // Milestones State
  const [showMilestoneModal, setShowMilestoneModal] = useState<boolean>(false);
  const [activeMilestoneToast, setActiveMilestoneToast] = useState<Milestone | null>(null);
  const [prevUnlockedMilestoneIds, setPrevUnlockedMilestoneIds] = useState<string[]>([]);

  // --- MODEL 1: DAU + ARPDAU CALCULATIONS ---
  const arpdauDailyGrossRobux = Math.round(dauInput * arpdauRobux);
  const arpdauDailyNetRobux = Math.round(arpdauDailyGrossRobux * 0.7); // 70% creator share
  const arpdauMonthlyGrossRobux = arpdauDailyGrossRobux * 30;
  const arpdauMonthlyNetRobux = arpdauDailyNetRobux * 30;
  const arpdauMonthlyDevExUsd = arpdauMonthlyNetRobux * DEVEX_RATE;
  const arpdauMonthlyDevExGbp = arpdauMonthlyDevExUsd * usdToGbpRate;

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

  // Active Base Monthly Net Robux
  const activeBaseMonthlyNetRobux = calculationMode === 'arpdau' ? arpdauMonthlyNetRobux : funnelMonthlyNetRobux;

  // Live Optimization Uplift
  const totalOptimizationMultiplier = (applyStarterPack ? 0.25 : 0) + (applyWeekendLTO ? 0.30 : 0) + (applyUIOptimization ? 0.15 : 0);
  const optimizedBaseMonthlyNetRobux = Math.round(activeBaseMonthlyNetRobux * (1 + totalOptimizationMultiplier));
  const effectiveMonthlyDevExGbp = (optimizedBaseMonthlyNetRobux * DEVEX_RATE) * usdToGbpRate;

  // 12-Month Projection Array with Compounding Growth & Churn
  const netCompoundRate = (monthlyGrowthRate - monthlyChurnRate) / 100;
  const monthlyProjections = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = i + 1;
    const multiplier = Math.pow(1 + netCompoundRate, i);
    const projectedNetRobux = Math.round(optimizedBaseMonthlyNetRobux * multiplier);
    const projectedGrossRobux = Math.round(projectedNetRobux / 0.7);
    const projectedDevExUsd = projectedNetRobux * DEVEX_RATE;
    const projectedDevExGbp = projectedDevExUsd * usdToGbpRate;

    return {
      monthIndex,
      monthLabel: `M${monthIndex}`,
      monthName: `Month ${monthIndex}`,
      projectedNetRobux,
      projectedGrossRobux,
      projectedDevExUsd,
      projectedDevExGbp,
    };
  });

  // Cumulative 12-Month Totals
  const cumulativeNetRobux = monthlyProjections.reduce((sum, m) => sum + m.projectedNetRobux, 0);
  const cumulativeDevExUsd = cumulativeNetRobux * DEVEX_RATE;
  const cumulativeDevExGbp = cumulativeDevExUsd * usdToGbpRate;
  const maxProjectedNetRobux = Math.max(...monthlyProjections.map((m) => m.projectedNetRobux), 1);

  // Financial Summary Tax Calculations
  const monthlyAllowableExpenses = effectiveMonthlyDevExGbp * (allowableExpensePercent / 100);
  const monthlyTaxableProfit = Math.max(0, effectiveMonthlyDevExGbp - monthlyAllowableExpenses);
  const annualTaxableProfit = monthlyTaxableProfit * 12;
  const ukTaxReport = calculateUkTaxBands(annualTaxableProfit);
  const monthlyCleanTakeHome = monthlyTaxableProfit - ukTaxReport.monthly.totalLiability;

  // Milestone Evaluation
  const currentDau = calculationMode === 'arpdau' ? dauInput : funnelDau;
  const currentCcu = calculationMode === 'arpdau' ? Math.round(dauInput / 10) : ccu;
  const currentMilestones = evaluateMilestones({
    ccu: currentCcu,
    dau: currentDau,
    monthlyNetRobux: optimizedBaseMonthlyNetRobux,
    annualGbp: effectiveMonthlyDevExGbp * 12
  });
  const unlockedMilestonesCount = currentMilestones.filter(m => m.unlocked).length;

  useEffect(() => {
    const newlyUnlocked = currentMilestones.find(
      m => m.unlocked && !prevUnlockedMilestoneIds.includes(m.id)
    );
    if (newlyUnlocked && prevUnlockedMilestoneIds.length > 0) {
      sounds.playSuccess();
      setActiveMilestoneToast(newlyUnlocked);
    }
    setPrevUnlockedMilestoneIds(currentMilestones.filter(m => m.unlocked).map(m => m.id));
  }, [currentCcu, currentDau, optimizedBaseMonthlyNetRobux, effectiveMonthlyDevExGbp]);

  // Genre ARPDAU Benchmarks
  const arpdauPresets = [
    { name: 'Casual Obby / Tower', arpdau: 0.15, note: 'Low ARPDAU, relies on huge viral volume' },
    { name: 'Base Tycoon / Merger', arpdau: 0.55, note: 'Medium ARPDAU with auto-collect passes' },
    { name: 'Pet / Simulator', arpdau: 1.25, note: 'High ARPDAU driven by eggs & boosts' },
    { name: 'Anime RPG / Gacha', arpdau: 2.80, note: 'Very High ARPDAU driven by repeat spins' },
  ];

  const getHeatmapColor = (rate: number) => {
    if (rate >= 10.0) return 'bg-amber-950/70 text-amber-300 border-amber-500/80 font-black shadow-sm shadow-amber-950/30';
    if (rate >= 6.0) return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60 font-bold';
    if (rate >= 3.0) return 'bg-teal-950/50 text-teal-300 border-teal-600/40 font-semibold';
    if (rate >= 1.5) return 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40';
    return 'bg-slate-900/50 text-slate-400 border-slate-800/60';
  };

  return (
    <div className="space-y-6">
      {/* Milestone Modal */}
      <MilestoneModal
        isOpen={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        milestones={currentMilestones}
      />

      {/* Floating Milestone Achievement Toast */}
      {activeMilestoneToast && (
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-amber-950/90 border border-amber-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl shadow-amber-950/40 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">
                  🏆 Milestone Unlocked: {activeMilestoneToast.title}!
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {activeMilestoneToast.currentValueText}
                </span>
              </div>
              <p className="text-xs text-amber-200/90 mt-0.5 leading-relaxed">
                {activeMilestoneToast.significance}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => {
                sounds.playClick();
                setShowMilestoneModal(true);
                setActiveMilestoneToast(null);
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              View Trophy Rack
            </button>
            <button
              onClick={() => setActiveMilestoneToast(null)}
              className="p-1.5 text-amber-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header section with Mode Selector & Milestone Button */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Full-Spectrum Economy Modeling Engine</span>
            </div>
            <h1 className="text-xl font-bold text-white font-display">
              Roblox Game Economy &amp; Revenue Projection Simulator
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Model your game's real-world financial performance from concurrent players (CCU) and daily active users (DAU) directly into British Pounds (£) after Roblox's 30% platform cut and DevEx cashout rates.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Milestone Trophy Rack Trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowMilestoneModal(true);
              }}
              className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open Project Milestones & Achievement Rack"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Milestones ({unlockedMilestonesCount}/7)</span>
            </button>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCalculationMode('arpdau');
                }}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  calculationMode === 'arpdau'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Model A: DAU &amp; ARPDAU
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setCalculationMode('funnel');
                }}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  calculationMode === 'funnel'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Model B: CCU &amp; Spender Funnel
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Controls based on selected mode */}
        {calculationMode === 'arpdau' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-800/80">
            {/* Input 1: DAU */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daily Active Users (DAU)</span>
                </label>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {dauInput.toLocaleString()} players
                </span>
              </div>
              <input
                type="number"
                min="500"
                step="2500"
                value={dauInput}
                onChange={(e) => setDauInput(Math.max(100, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Indie: ~5k–10k</span>
                <span>Hit: ~50k–100k+</span>
              </div>
            </div>

            {/* Input 2: ARPDAU */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <RobuxIcon className="w-3.5 h-3.5" />
                  <span>ARPDAU (Robux / User / Day)</span>
                </label>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {arpdauRobux.toFixed(2)} R$
                </span>
              </div>
              <input
                type="number"
                min="0.05"
                max="10.0"
                step="0.05"
                value={arpdauRobux}
                onChange={(e) => setArpdauRobux(Math.max(0.01, parseFloat(e.target.value) || 0.1))}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {arpdauPresets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      sounds.playCoin();
                      setArpdauRobux(p.arpdau);
                    }}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                      arpdauRobux === p.arpdau
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {p.name.split(' ')[0]}: {p.arpdau} R$
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: USD to GBP Exchange Rate */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <SterlingCoinIcon className="w-3.5 h-3.5" />
                  <span>DevEx Rate &amp; USD to GBP</span>
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
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                Official DevEx: <strong>$0.0035 USD per Robux</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            {/* Input 1: CCU */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Concurrent Players (CCU)</label>
                <span className="text-xs font-mono text-emerald-400 font-semibold">{ccu}</span>
              </div>
              <input
                type="number"
                min="10"
                step="50"
                value={ccu}
                onChange={(e) => setCcu(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Est. Daily Players: ~{(ccu * dauRatio).toLocaleString()}</span>
            </div>

            {/* Input 2: Conversion Rate */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Spender Conversion</label>
                <span className="text-xs font-mono text-emerald-400 font-semibold">{conversionRate}%</span>
              </div>
              <input
                type="number"
                min="0.5"
                max="15.0"
                step="0.5"
                value={conversionRate}
                onChange={(e) => setConversionRate(parseFloat(e.target.value) || 1)}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Industry avg: 1.8% – 3.5%</span>
            </div>

            {/* Input 3: ARPPU */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">ARPPU (Robux / Spender)</label>
                <span className="text-xs font-mono text-emerald-400 font-semibold">{arppu} R$</span>
              </div>
              <input
                type="number"
                min="50"
                step="50"
                value={arppu}
                onChange={(e) => setArppu(Math.max(10, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Avg basket size per paying player</span>
            </div>

            {/* Input 4: Premium Share */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Roblox Premium Share</label>
                <span className="text-xs font-mono text-emerald-400 font-semibold">{premiumShare}%</span>
              </div>
              <input
                type="number"
                min="5"
                max="40"
                value={premiumShare}
                onChange={(e) => setPremiumShare(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Generates Engagement Payouts (EBP)</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Daily Revenue */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Daily Net Revenue
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              70% Creator Cut
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {(calculationMode === 'arpdau' ? arpdauDailyNetRobux : funnelDailyTotalNetRobux).toLocaleString()} <span className="text-xs text-amber-400">R$ / day</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              ~£{((calculationMode === 'arpdau' ? arpdauDailyNetRobux : funnelDailyTotalNetRobux) * DEVEX_RATE * usdToGbpRate).toFixed(2)} GBP / day
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Gross Player Spend:</span>
              <span className="font-mono text-slate-200">
                {(calculationMode === 'arpdau' ? arpdauDailyGrossRobux : dailyGrossGameRobux).toLocaleString()} R$
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Roblox 30% Platform Cut:</span>
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
              Month 1 DevEx Baseline (£)
            </span>
            <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/50">
              30 Days
            </span>
          </div>

          <div>
            <div className="text-3xl font-black font-mono text-emerald-300">
              £{effectiveMonthlyDevExGbp.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              ${(optimizedBaseMonthlyNetRobux * DEVEX_RATE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD ({optimizedBaseMonthlyNetRobux.toLocaleString()} Net R$)
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-slate-300">
            {effectiveMonthlyDevExGbp > 2500 ? (
              <span className="text-emerald-400 font-semibold">
                Surpasses average UK full-time median salary (£2,400/mo)!
              </span>
            ) : effectiveMonthlyDevExGbp > 1000 ? (
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

        {/* Card 3: Month 12 Scaled Projection */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Month 12 Exit Run-Rate
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              At {monthlyGrowthRate}% growth
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-white">
              £{monthlyProjections[11].projectedDevExGbp.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              ~{monthlyProjections[11].projectedNetRobux.toLocaleString()} Net R$ / month
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Cumulative 12-month earnings reach <strong className="text-emerald-400 font-mono">£{cumulativeDevExGbp.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</strong>.
          </div>
        </div>
      </div>

      {/* -------------------- DYNAMIC MONTHLY FINANCIAL & UK TAX SUMMARY CARD -------------------- */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>HMRC UK Tax Band Audit</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              Monthly Financial Summary &amp; Net Take-Home Pay (GBP)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregates all projected revenues, allowable business expenses, UK Income Tax bands, and Class 4 National Insurance.
            </p>
          </div>

          {/* Allowable Expenses Slider */}
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs space-y-1 self-start sm:self-auto min-w-[200px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Allowable Expenses:</span>
              <span className="font-mono text-emerald-400 font-bold">{allowableExpensePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={allowableExpensePercent}
              onChange={(e) => setAllowableExpensePercent(parseInt(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Solo)</span>
              <span>15% (Standard)</span>
              <span>35% (Team)</span>
            </div>
          </div>
        </div>

        {/* Financial Flow Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Box 1: Monthly DevEx Gross */}
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-slate-400 text-[11px] block">1. Gross DevEx Cashout</span>
            <div className="text-xl font-bold font-mono text-white">
              £{effectiveMonthlyDevExGbp.toFixed(2)}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Pre-tax revenue dispatched from Tipalti directly into UK bank account.
            </p>
          </div>

          {/* Box 2: Allowable Expenses */}
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>2. Allowable Expenses ({allowableExpensePercent}%)</span>
              <span className="text-teal-400 font-mono">Tax Deductible</span>
            </div>
            <div className="text-xl font-bold font-mono text-teal-400">
              -£{monthlyAllowableExpenses.toFixed(2)}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Hardware, Blender add-ons, software licenses &amp; test ads deducted from profit.
            </p>
          </div>

          {/* Box 3: UK Tax & National Insurance Liability */}
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>3. Total Tax &amp; Class 4 NI</span>
              <span className="text-rose-400 font-mono">{ukTaxReport.effectiveTaxRate.toFixed(1)}% Eff. Rate</span>
            </div>
            <div className="text-xl font-bold font-mono text-rose-400">
              -£{ukTaxReport.monthly.totalLiability.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
              <div>Income Tax: £{ukTaxReport.monthly.incomeTax.toFixed(2)}</div>
              <div>Class 4 NI: £{ukTaxReport.monthly.nationalInsurance.toFixed(2)}</div>
            </div>
          </div>

          {/* Box 4: True Take-Home Profit */}
          <div className="bg-emerald-950/30 border border-emerald-500/50 rounded-lg p-4 space-y-2 relative overflow-hidden">
            <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
              <span>4. True Monthly Take-Home</span>
              <span className="text-[10px] font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50">Clean Profit</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-300">
              £{monthlyCleanTakeHome.toFixed(2)}
            </div>
            <p className="text-[10px] text-emerald-200/80 leading-tight">
              Net disposable income in your personal account after all statutory liabilities.
            </p>
          </div>
        </div>

        {/* Annualized Run-Rate Meter */}
        <div className="bg-[#080c13] border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Annualized UK Tax Band Utilization (£{Math.round(annualTaxableProfit).toLocaleString()} / Year Taxable Profit)
            </span>
            <span className="text-slate-400 text-[11px] font-mono">
              Net Annual Take-Home: <strong className="text-emerald-300">£{Math.round(ukTaxReport.netAnnualTakeHome).toLocaleString()}</strong>
            </span>
          </div>

          {/* Visual Band Proportion Bar */}
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 flex">
            {/* Personal Allowance segment */}
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${Math.min(100, (Math.min(annualTaxableProfit, 12570) / Math.max(annualTaxableProfit, 12570)) * 100)}%` }}
              title="Personal Allowance (£12,570 Tax-Free)"
            />
            {/* Basic Rate segment */}
            {annualTaxableProfit > 12570 && (
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${Math.min(100, (Math.min(annualTaxableProfit - 12570, 37700) / annualTaxableProfit) * 100)}%` }}
                title="Basic Rate 20% (£12,571 - £50,270)"
              />
            )}
            {/* Higher Rate segment */}
            {annualTaxableProfit > 50270 && (
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${Math.min(100, ((annualTaxableProfit - 50270) / annualTaxableProfit) * 100)}%` }}
                title="Higher Rate 40% (Over £50,270)"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Tax-Free Personal Allowance: £{Math.min(annualTaxableProfit, ukTaxReport.personalAllowance).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Basic Rate (20%): £{Math.max(0, Math.min(annualTaxableProfit - 12570, 37700)).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              Higher Rate (40%): £{Math.max(0, annualTaxableProfit - 50270).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* -------------------- 12-MONTH PROJECTION CURVE -------------------- */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Compounding Growth Model</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              12-Month Projected Growth Curve
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate month-over-month compounding player base growth and seasonal churn to view projected earnings over a full 12-month lifecycle.
            </p>
          </div>

          {/* Growth & Churn Sliders */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg space-y-1 min-w-[150px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  Monthly Growth:
                </span>
                <span className="font-mono text-emerald-400 font-bold">{monthlyGrowthRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={monthlyGrowthRate}
                onChange={(e) => setMonthlyGrowthRate(parseInt(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg space-y-1 min-w-[150px]">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-rose-400" />
                  Monthly Churn:
                </span>
                <span className="font-mono text-rose-400 font-bold">{monthlyChurnRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={monthlyChurnRate}
                onChange={(e) => setMonthlyChurnRate(parseInt(e.target.value))}
                className="w-full accent-rose-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Cumulative Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[10px] block">Cumulative 12-Mo Net Robux</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {cumulativeNetRobux.toLocaleString()} R$
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[10px] block">Cumulative DevEx (USD)</span>
            <div className="text-base font-bold text-sky-400 mt-0.5">
              ${cumulativeDevExUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-lg p-3">
            <span className="text-emerald-300 text-[10px] block font-sans font-semibold">Cumulative Net (£ GBP)</span>
            <div className="text-base font-black text-emerald-300 mt-0.5">
              £{cumulativeDevExGbp.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[10px] block font-sans">Net Growth / Month</span>
            <div className="text-base font-bold text-teal-400 mt-0.5">
              +{monthlyGrowthRate - monthlyChurnRate}%
            </div>
          </div>
        </div>

        {/* Interactive SVG Bar Chart Visualization */}
        <div className="bg-[#080c13] border border-slate-800/80 rounded-xl p-4 sm:p-5">
          <div className="h-56 flex items-end justify-between gap-1.5 sm:gap-3 relative">
            {monthlyProjections.map((month) => {
              const heightPercent = Math.max(8, Math.round((month.projectedNetRobux / maxProjectedNetRobux) * 100));
              const isHovered = hoveredMonth === month.monthIndex;

              return (
                <div
                  key={month.monthIndex}
                  onMouseEnter={() => setHoveredMonth(month.monthIndex)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-emerald-500/60 p-2 rounded-lg text-center shadow-xl pointer-events-none whitespace-nowrap z-30 animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[10px] font-mono text-slate-400 font-semibold">{month.monthName}</div>
                      <div className="text-xs font-bold font-mono text-emerald-300">
                        £{month.projectedDevExGbp.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {month.projectedNetRobux.toLocaleString()} Net R$
                      </div>
                    </div>
                  )}

                  {/* Visual Bar with animated hover */}
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-300 shadow-md shadow-emerald-500/30'
                        : 'bg-gradient-to-t from-emerald-700/80 via-emerald-600/70 to-teal-500/70 hover:from-emerald-500 hover:to-teal-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Month Label */}
                  <div className={`text-[10px] font-mono mt-2 transition-colors ${
                    isHovered ? 'text-emerald-400 font-bold' : 'text-slate-500'
                  }`}>
                    {month.monthLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* -------------------- MONETIZATION MECHANICS VS LIFECYCLE HEATMAP -------------------- */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Lifecycle Conversion Heatmap</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              Game Mechanics vs. Player Lifecycle Conversion Rates
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any cell to inspect expected conversion rates, player spend baskets, and tactical Luau implementation advice.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800" /> &lt;1.5%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-cyan-950/60 border border-cyan-800" /> 1.5–3%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-teal-950/70 border border-teal-600" /> 3–6%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-950/80 border border-emerald-500" /> 6–10%</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-950/90 border border-amber-500" /> &gt;10%</span>
          </div>
        </div>

        {/* Heatmap Grid Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-2.5 pr-4 text-slate-300 font-semibold text-xs min-w-[200px]">Mechanic &amp; Category</th>
                {HEATMAP_COLUMNS.map((col) => (
                  <th key={col.key} className="py-2.5 px-2 text-center text-slate-400 font-mono text-[11px] min-w-[100px]">
                    <div>{col.label}</div>
                    <div className="text-[9px] text-slate-500 font-normal">{col.sub}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MONETIZATION_HEATMAP.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-2.5 pr-4">
                    <div className="font-semibold text-white text-xs">{row.mechanicName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {row.category} · {row.bestGenre}
                    </div>
                  </td>
                  {HEATMAP_COLUMNS.map((col) => {
                    const cell = row.timelines[col.key as keyof typeof row.timelines];
                    const isSelected = selectedHeatmapCell?.row.id === row.id && selectedHeatmapCell?.colKey === col.key;

                    return (
                      <td key={col.key} className="py-2 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setSelectedHeatmapCell({
                              row,
                              colKey: col.key,
                              colLabel: col.label,
                              cell
                            });
                          }}
                          className={`w-full py-2 px-1 rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center ${getHeatmapColor(cell.conversionRate)} ${
                            isSelected ? 'ring-2 ring-emerald-400 scale-105' : 'hover:scale-[1.02]'
                          }`}
                        >
                          <span className="text-xs font-mono">{cell.conversionRate}%</span>
                          <span className="text-[9px] font-mono opacity-80">~{cell.arpuRobux} R$</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Cell Deep-Dive Inspector */}
        {selectedHeatmapCell && (
          <div className="bg-[#0b0f17] border border-emerald-500/40 rounded-xl p-4 sm:p-5 space-y-2 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">
                  {selectedHeatmapCell.row.mechanicName}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  {selectedHeatmapCell.colLabel} Phase
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">
                  Conversion Rate: <strong className="text-emerald-300">{selectedHeatmapCell.cell.conversionRate}%</strong>
                </span>
                <span className="text-slate-400">
                  Basket Contribution: <strong className="text-amber-300">~{selectedHeatmapCell.cell.arpuRobux} R$</strong>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed pt-1">
              <strong className="text-emerald-400">Tactical Developer Strategy: </strong>
              {selectedHeatmapCell.cell.tacticalAdvice}
            </p>
          </div>
        )}
      </div>

      {/* -------------------- ACTIONABLE ARPDAU OPTIMIZATION STRATEGIES -------------------- */}
      {(() => {
        const currentBaseArpdau = calculationMode === 'arpdau' ? arpdauRobux : (funnelDau > 0 ? dailyGrossGameRobux / funnelDau : 0.65);
        const starterPackBoost = applyStarterPack ? 0.25 : 0;
        const weekendLTOBoost = applyWeekendLTO ? 0.30 : 0;
        const uiOptimizationBoost = applyUIOptimization ? 0.15 : 0;
        const totalBoostRate = starterPackBoost + weekendLTOBoost + uiOptimizationBoost;
        const optimizedArpdau = currentBaseArpdau * (1 + totalBoostRate);
        const baselineMonthlyGbp = calculationMode === 'arpdau' ? arpdauMonthlyDevExGbp : funnelMonthlyDevExGbp;
        const optimizedMonthlyGbp = baselineMonthlyGbp * (1 + totalBoostRate);
        const extraGainGbp = optimizedMonthlyGbp - baselineMonthlyGbp;

        return (
          <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Economy Optimization Playbook</span>
                </div>
                <h2 className="text-lg font-bold text-white font-display">
                  Live ARPDAU Optimization Strategies
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Actionable monetization levers based on your current simulation ({currentBaseArpdau.toFixed(2)} R$ ARPDAU). Toggle levers below to simulate real-time revenue expansion.
                </p>
              </div>

              {/* Optimization Uplift Metric */}
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-xl text-right shrink-0">
                <span className="text-[10px] text-emerald-300 font-mono block uppercase">Simulated Potential Uplift</span>
                <span className="text-xl font-black font-mono text-emerald-300">
                  +£{extraGainGbp.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / mo
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  ARPDAU: {currentBaseArpdau.toFixed(2)} R$ → <strong className="text-emerald-400">{optimizedArpdau.toFixed(2)} R$</strong> (+{Math.round(totalBoostRate * 100)}%)
                </span>
              </div>
            </div>

            {/* Interactive Switchboard */}
            <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                Toggle Live-Ops Optimization Levers:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setApplyStarterPack(!applyStarterPack);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    applyStarterPack
                      ? 'bg-slate-900 border-emerald-500/60 text-white shadow-sm'
                      : 'bg-[#080c13] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                      FTUE Starter Pack
                    </span>
                    <span className="font-mono text-emerald-400 text-[10px]">+25% Lift</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    29–49 R$ impulse pack within first 15 mins. Converts non-payers into lifelong spenders.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setApplyWeekendLTO(!applyWeekendLTO);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    applyWeekendLTO
                      ? 'bg-slate-900 border-emerald-500/60 text-white shadow-sm'
                      : 'bg-[#080c13] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      48h Weekend LTO Events
                    </span>
                    <span className="font-mono text-amber-400 text-[10px]">+30% Lift</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Limited-time 2x boost weekends with countdown timers to capture player traffic surges.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setApplyUIOptimization(!applyUIOptimization);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    applyUIOptimization
                      ? 'bg-slate-900 border-emerald-500/60 text-white shadow-sm'
                      : 'bg-[#080c13] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-sky-400" />
                      Store UI A/B Testing
                    </span>
                    <span className="font-mono text-sky-400 text-[10px]">+15% Lift</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Visual badge hierarchy ("Best Value", "Popular") and contextual victory prompting.
                  </p>
                </button>
              </div>
            </div>

            {/* In-Depth Actionable Strategies Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Card 1: FTUE Starter Pack */}
              <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-white mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>1. FTUE "First-Spender" Funnel</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Over 96% of Roblox players never spend real money because the psychological friction of the first purchase is immense.
                  </p>
                  <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                    <div>• <strong>Price Point:</strong> 29 R$ or 49 R$ (cost of 1 donut).</div>
                    <div>• <strong>Value Anchor:</strong> Bundle 5x value (Exclusive Pet + 3x Coins for 1 hr + Title).</div>
                    <div>• <strong>Impact:</strong> Spenders who buy a starter pack are <strong>400% more likely</strong> to buy subsequent game passes!</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-emerald-400 font-mono">
                  Recommended for: All genres under 0.80 R$ ARPDAU
                </div>
              </div>

              {/* Card 2: Seasonal & Weekend LTOs */}
              <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-white mb-1">
                    <Timer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2. 48-Hour Weekend LTO Timers</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Roblox active user numbers spike by 45%–70% from Friday 5PM to Sunday midnight GMT. Capitalize with urgency.
                  </p>
                  <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                    <div>• <strong>Mechanism:</strong> Add a flashing BillboardGui timer: "Weekend 2x Luck Ends in 18:24:12".</div>
                    <div>• <strong>Seasonal Drops:</strong> Limited holiday crates (Halloween, Winter, Summer) that never return.</div>
                    <div>• <strong>Impact:</strong> Drives 60% of entire monthly revenue during a 48-hour window!</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-emerald-400 font-mono">
                  Recommended for: Fisch, Blade Ball &amp; Simulators
                </div>
              </div>

              {/* Card 3: Store UI A/B Testing */}
              <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-white mb-1">
                    <Tag className="w-3.5 h-3.5 text-sky-400" />
                    <span>3. Store UI Hierarchy &amp; Triggers</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Where and when you prompt purchases determines your conversion rate far more than the item graphics.
                  </p>
                  <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                    <div>• <strong>Contextual Prompting:</strong> Prompt a revive or 2x coin booster right after a near-victory or boss defeat, NEVER on game join or death.</div>
                    <div>• <strong>Anchor Pricing:</strong> Display a 1,299 R$ Mega-Pass next to a 349 R$ Pass so the 349 R$ looks like a bargain.</div>
                    <div>• <strong>Highlighting:</strong> Put a glowing neon "MOST POPULAR" banner on your target item.</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-emerald-400 font-mono">
                  Recommended for: PvP arenas &amp; Tycoons
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Official Roblox Portals & Analytics Quick Link Bar */}
      <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          Official Roblox Analytics &amp; DevEx Portals
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Monitor your live game analytics (CCU, retention, ARPPU) and submit DevEx cashouts on official Roblox portals:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <a
            href="https://create.roblox.com/dashboard/creations"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#080c13] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-200 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Roblox Creator Analytics</div>
              <div className="text-[10px] text-slate-500">Track D1/D7 retention &amp; real ARPPU</div>
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
              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Official DevEx Portal</div>
              <div className="text-[10px] text-slate-500">Submit 30,000+ R$ cashout requests</div>
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
              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Tipalti Payout Portal</div>
              <div className="text-[10px] text-slate-500">Manage UK bank details &amp; W-8BEN</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
