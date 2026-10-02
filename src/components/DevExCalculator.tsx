import React, { useState, useEffect } from 'react';
import { DollarSign, AlertCircle, CheckCircle2, TrendingUp, HelpCircle, ArrowUpRight, ArrowLeftRight, Sparkles, X, ExternalLink, PartyPopper, Plus, Trash2, Calendar, History, BarChart2, Globe, Coins, Settings2, RotateCcw } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon, DevExVaultIcon, RobuxGoldIcon } from './Icons';
import { sounds } from '../utils/audio';
import { EstimatedIncomeTaxWidget } from './EstimatedIncomeTaxWidget';
import { PayoutTrendChart } from './PayoutTrendChart';

export interface PayoutRecord {
  id: string;
  date: string;
  robux: number;
  note: string;
}

export const BENCHMARK_PAYOUT_TEMPLATE: PayoutRecord[] = [
  { id: 'p1', date: '2026-05-12', robux: 35000, note: 'First 30k DevEx Milestone' },
  { id: 'p2', date: '2026-06-25', robux: 85000, note: 'Summer Launch Update' },
  { id: 'p3', date: '2026-07-20', robux: 190000, note: 'Trade Hub & Aura Rolling Spike' },
  { id: 'p4', date: '2026-08-30', robux: 340000, note: 'Weekend 2x Luck Event LTO' },
  { id: 'p5', date: '2026-09-28', robux: 520000, note: 'Autumn Raid Boss Expansion' },
];

const DEFAULT_PAYOUT_HISTORY: PayoutRecord[] = [];

interface DevExCalculatorProps {
  onBalanceChange?: (netRobux: number) => void;
}

export const DevExCalculator: React.FC<DevExCalculatorProps> = ({ onBalanceChange }) => {
  // Gross Robux in-game sales
  const [grossRobux, setGrossRobux] = useState<number>(100000);
  const [usdToGbpRate, setUsdToGbpRate] = useState<number>(0.78); // £0.78 per $1 USD (~ £1 = $1.28 USD)
  const [isGrossInput, setIsGrossInput] = useState<boolean>(true); // true = gross sales, false = net earned robux

  // Global Multi-Currency Rates (per $1.00 USD)
  const [usdToEurRate, setUsdToEurRate] = useState<number>(0.92); // €0.92 per $1 USD
  const [usdToCadRate, setUsdToCadRate] = useState<number>(1.36); // CA$1.36 per $1 USD
  const [usdToAudRate, setUsdToAudRate] = useState<number>(1.52); // AU$1.52 per $1 USD
  const [usdToJpyRate, setUsdToJpyRate] = useState<number>(152.0); // ¥152 per $1 USD
  const [showFxSettings, setShowFxSettings] = useState<boolean>(false);

  // Target Reverse Calculator
  const [targetGbp, setTargetGbp] = useState<number>(1000); // e.g. "I want to earn £1,000/mo"

  // Payout History Tracker State
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('blox_devex_payout_history');
      return saved ? JSON.parse(saved) : DEFAULT_PAYOUT_HISTORY;
    } catch {
      return DEFAULT_PAYOUT_HISTORY;
    }
  });

  const [newPayoutDate, setNewPayoutDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newPayoutRobux, setNewPayoutRobux] = useState<number>(50000);
  const [newPayoutNote, setNewPayoutNote] = useState<string>('Game Update Spike');
  const [showAddPayoutForm, setShowAddPayoutForm] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('blox_devex_payout_history', JSON.stringify(payoutHistory));
    } catch (e) {
      console.warn(e);
    }
  }, [payoutHistory]);

  // Calculate Net Earned Robux
  const netRobux = isGrossInput ? Math.round(grossRobux * 0.7) : grossRobux;
  const robloxMarketplaceCut = isGrossInput ? Math.round(grossRobux * 0.3) : Math.round((grossRobux / 0.7) * 0.3);

  // Official DevEx Rate: $0.0035 USD per 1 Earned Robux
  const DEVEX_RATE_USD = 0.0035;
  const MIN_DEVEX_THRESHOLD = 30000; // 30,000 Robux is the official minimum threshold

  const devexUsd = netRobux * DEVEX_RATE_USD;
  const devexGbp = devexUsd * usdToGbpRate;
  const qualifies = netRobux >= MIN_DEVEX_THRESHOLD;

  useEffect(() => {
    try {
      localStorage.setItem('blox_projected_devex_robux', netRobux.toString());
    } catch (e) {
      console.warn(e);
    }
    if (onBalanceChange) {
      onBalanceChange(netRobux);
    }
  }, [netRobux, onBalanceChange]);

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

  // Payout History Calculations
  const totalHistoryRobux = payoutHistory.reduce((sum, p) => sum + p.robux, 0);
  const totalHistoryUsd = totalHistoryRobux * DEVEX_RATE_USD;
  const totalHistoryGbp = totalHistoryUsd * usdToGbpRate;
  const avgHistoryGbp = payoutHistory.length > 0 ? totalHistoryGbp / payoutHistory.length : 0;
  const maxHistoryRobux = Math.max(...payoutHistory.map(p => p.robux), 30000);

  const handleAddPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPayoutRobux < 30000) {
      alert('DevEx minimum threshold is 30,000 Earned Robux.');
      return;
    }
    sounds.playSuccess();
    const newRecord: PayoutRecord = {
      id: `payout-${Date.now()}`,
      date: newPayoutDate,
      robux: newPayoutRobux,
      note: newPayoutNote || 'DevEx Payout'
    };
    const updated = [...payoutHistory, newRecord].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setPayoutHistory(updated);
    setShowAddPayoutForm(false);
    setNewPayoutNote('');
  };

  const handleDeletePayout = (id: string) => {
    sounds.playClick();
    setPayoutHistory(prev => prev.filter(p => p.id !== id));
  };

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
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-white font-display">
                Roblox DevEx to British Pounds (£) Calculator
              </h1>
              {/* Subtle 30,000 Robux Threshold Status Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold transition-all border ${
                  qualifies
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-900 border-slate-700/80 text-slate-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    qualifies
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-slate-500'
                  }`}
                />
                <span>
                  {qualifies
                    ? `30k Met (${netRobux.toLocaleString()} R$ · £${devexGbp.toFixed(2)})`
                    : `Below 30k Threshold (${netRobux.toLocaleString()} / 30,000 R$)`}
                </span>
              </div>
            </div>
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

      {/* -------------------- DYNAMIC GLOBAL CURRENCY CONVERTER MATRIX -------------------- */}
      {(() => {
        const devexEur = devexUsd * usdToEurRate;
        const devexCad = devexUsd * usdToCadRate;
        const devexAud = devexUsd * usdToAudRate;
        const devexJpy = devexUsd * usdToJpyRate;

        const currencies = [
          {
            code: 'GBP',
            symbol: '£',
            name: 'British Pound Sterling',
            amount: devexGbp,
            badge: 'UK Home Bank',
            rateText: `£${usdToGbpRate.toFixed(2)} per $1 USD`,
            color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/20'
          },
          {
            code: 'USD',
            symbol: '$',
            name: 'United States Dollar',
            amount: devexUsd,
            badge: 'DevEx Base Rate',
            rateText: '$0.0035 per Earned R$',
            color: 'text-sky-300 border-sky-500/30 bg-sky-950/20'
          },
          {
            code: 'EUR',
            symbol: '€',
            name: 'European Euro',
            amount: devexEur,
            badge: 'EU / SEPA Bank',
            rateText: `€${usdToEurRate.toFixed(2)} per $1 USD`,
            color: 'text-blue-300 border-blue-500/30 bg-blue-950/20'
          },
          {
            code: 'CAD',
            symbol: 'CA$',
            name: 'Canadian Dollar',
            amount: devexCad,
            badge: 'Canada Direct',
            rateText: `$${usdToCadRate.toFixed(2)} per $1 USD`,
            color: 'text-red-300 border-red-500/30 bg-red-950/20'
          },
          {
            code: 'AUD',
            symbol: 'AU$',
            name: 'Australian Dollar',
            amount: devexAud,
            badge: 'Australia Wire',
            rateText: `$${usdToAudRate.toFixed(2)} per $1 USD`,
            color: 'text-amber-300 border-amber-500/30 bg-amber-950/20'
          },
          {
            code: 'JPY',
            symbol: '¥',
            name: 'Japanese Yen',
            amount: devexJpy,
            badge: 'Asia-Pacific',
            rateText: `¥${usdToJpyRate.toFixed(0)} per $1 USD`,
            color: 'text-purple-300 border-purple-500/30 bg-purple-950/20'
          }
        ];

        return (
          <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Global DevEx Currency Converter</span>
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  Global Multi-Currency Payout Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  See your net DevEx payout value ({netRobux.toLocaleString()} R$) converted in real-time across major world currencies.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowFxSettings(!showFxSettings);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{showFxSettings ? 'Close FX Rates' : 'Adjust FX Rates'}</span>
              </button>
            </div>

            {/* Expandable FX Settings Panel */}
            {showFxSettings && (
              <div className="bg-[#0b0f17] border border-slate-800 p-4 rounded-xl space-y-3 animate-in fade-in duration-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    Custom Foreign Exchange Pegs (Per $1.00 USD):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setUsdToGbpRate(0.78);
                      setUsdToEurRate(0.92);
                      setUsdToCadRate(1.36);
                      setUsdToAudRate(1.52);
                      setUsdToJpyRate(152.0);
                    }}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Defaults</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">GBP (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={usdToGbpRate}
                      onChange={(e) => setUsdToGbpRate(parseFloat(e.target.value) || 0.78)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">EUR (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={usdToEurRate}
                      onChange={(e) => setUsdToEurRate(parseFloat(e.target.value) || 0.92)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">CAD (CA$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={usdToCadRate}
                      onChange={(e) => setUsdToCadRate(parseFloat(e.target.value) || 1.36)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">AUD (AU$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={usdToAudRate}
                      onChange={(e) => setUsdToAudRate(parseFloat(e.target.value) || 1.52)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">JPY (¥)</label>
                    <input
                      type="number"
                      step="1"
                      value={usdToJpyRate}
                      onChange={(e) => setUsdToJpyRate(parseFloat(e.target.value) || 152)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Currencies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {currencies.map((curr) => (
                <div
                  key={curr.code}
                  className={`border rounded-xl p-3 flex flex-col justify-between transition-all hover:scale-[1.02] ${curr.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold font-mono text-white">{curr.code}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-slate-400">
                        {curr.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{curr.name}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60">
                    <div className="text-base sm:text-lg font-bold font-mono text-white tabular-nums">
                      {curr.code === 'JPY'
                        ? `¥${Math.round(curr.amount).toLocaleString()}`
                        : `${curr.symbol}${curr.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                      {curr.rateText}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

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

      {/* -------------------- ESTIMATED INCOME TAX & UK BAND SHIFT WIDGET -------------------- */}
      <EstimatedIncomeTaxWidget
        currentCashoutGbp={devexGbp}
        currentNetRobux={netRobux}
      />

      {/* -------------------- DEVEX PAYOUT HISTORY & GROWTH TRACKER -------------------- */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <History className="w-3.5 h-3.5" />
              <span>Personal Financial Ledger</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              DevEx Payout History &amp; Growth Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Log your historical Roblox cashouts to visualize your real-money earnings growth over time.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setShowAddPayoutForm(!showAddPayoutForm);
            }}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddPayoutForm ? 'Cancel' : 'Log Past Payout'}</span>
          </button>
        </div>

        {/* Add Payout Record Form */}
        {showAddPayoutForm && (
          <form onSubmit={handleAddPayoutSubmit} className="bg-[#0b0f17] border border-emerald-500/40 p-4 rounded-xl space-y-4 animate-in fade-in duration-200">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Record New DevEx Payout</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Payout Date</label>
                <input
                  type="date"
                  value={newPayoutDate}
                  onChange={(e) => setNewPayoutDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-400">Earned Robux Amount</label>
                  <span className="font-mono text-emerald-400 font-semibold">{newPayoutRobux.toLocaleString()} R$</span>
                </div>
                <input
                  type="number"
                  min="30000"
                  step="5000"
                  value={newPayoutRobux}
                  onChange={(e) => setNewPayoutRobux(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
                <div className="flex gap-1 mt-1 text-[10px] text-slate-500 font-mono">
                  <button type="button" onClick={() => setNewPayoutRobux(30000)} className="hover:text-emerald-400 cursor-pointer">30k</button>
                  <span>·</span>
                  <button type="button" onClick={() => setNewPayoutRobux(100000)} className="hover:text-emerald-400 cursor-pointer">100k</button>
                  <span>·</span>
                  <button type="button" onClick={() => setNewPayoutRobux(500000)} className="hover:text-emerald-400 cursor-pointer">500k</button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Milestone Note</label>
                <input
                  type="text"
                  value={newPayoutNote}
                  onChange={(e) => setNewPayoutNote(e.target.value)}
                  placeholder="e.g. Summer Game Update Spike"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
              <span className="font-mono text-emerald-400">
                Calculated Value: ${(newPayoutRobux * DEVEX_RATE_USD).toFixed(2)} USD = £{(newPayoutRobux * DEVEX_RATE_USD * usdToGbpRate).toFixed(2)} GBP
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save Payout Record
              </button>
            </div>
          </form>
        )}

        {/* Lifetime Payout Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[11px] block mb-1">Total Robux Cashed Out</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {totalHistoryRobux.toLocaleString()} <span className="text-xs">R$</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{payoutHistory.length} payouts total</span>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[11px] block mb-1">Total Received in USD ($)</span>
            <div className="text-lg font-bold font-mono text-sky-400">
              ${totalHistoryUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-teal-300 font-mono">0% US Tax Withheld</span>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3">
            <span className="text-emerald-300 text-[11px] block mb-1">Total in UK Bank (£ GBP)</span>
            <div className="text-lg font-black font-mono text-emerald-300">
              £{totalHistoryGbp.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Net BACS Deposited</span>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[11px] block mb-1">Average Payout Amount</span>
            <div className="text-lg font-bold font-mono text-white">
              £{avgHistoryGbp.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Per cashout cycle</span>
          </div>
        </div>

        {/* Payout Trend Visualization (Growth in Real-World Currency) */}
        <PayoutTrendChart
          payoutHistory={payoutHistory}
          usdToGbpRate={usdToGbpRate}
          devexRateUsd={DEVEX_RATE_USD}
        />

        {/* Ledger Table or Clean Empty State */}
        {payoutHistory.length === 0 ? (
          <div className="bg-[#0b0f17] border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <History className="w-5 h-5" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-sm font-bold text-white font-display">
                No Past Payouts Recorded
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log your real DevEx cashouts to track your actual GBP bank earnings, or load the reference benchmark trajectory to explore the trend visualization.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowAddPayoutForm(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Past Payout</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playSuccess();
                  setPayoutHistory(BENCHMARK_PAYOUT_TEMPLATE);
                }}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Load Benchmark Trajectory
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Milestone / Update Note</th>
                  <th className="pb-2">Earned Robux</th>
                  <th className="pb-2">DevEx (USD)</th>
                  <th className="pb-2">Bank Payout (£)</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payoutHistory.map((rec) => {
                  const usd = rec.robux * DEVEX_RATE_USD;
                  const gbp = usd * usdToGbpRate;
                  return (
                    <tr key={rec.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 font-mono text-slate-300">{rec.date}</td>
                      <td className="py-2.5 text-white font-medium">{rec.note}</td>
                      <td className="py-2.5 font-mono text-emerald-400">{rec.robux.toLocaleString()} R$</td>
                      <td className="py-2.5 font-mono text-sky-400">${usd.toFixed(2)}</td>
                      <td className="py-2.5 font-mono text-emerald-300 font-bold">£{gbp.toFixed(2)}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleDeletePayout(rec.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
