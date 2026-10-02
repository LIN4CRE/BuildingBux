import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, HelpCircle, CheckCircle2, Building2, Coins, ArrowRight, Info, Calculator, Percent } from 'lucide-react';
import { SterlingCoinIcon, RobuxIcon } from './Icons';
import { sounds } from '../utils/audio';

interface EstimatedIncomeTaxWidgetProps {
  currentCashoutGbp: number;
  currentNetRobux: number;
}

export const EstimatedIncomeTaxWidget: React.FC<EstimatedIncomeTaxWidgetProps> = ({
  currentCashoutGbp,
  currentNetRobux
}) => {
  // Other Annual Income (e.g. part-time job, full-time employment)
  const [otherAnnualIncome, setOtherAnnualIncome] = useState<number>(18000);
  // Frequency: 'annualized' (12x monthly) vs 'single' (one-off cashout)
  const [calculationMode, setCalculationMode] = useState<'annualized' | 'single'>('annualized');
  // Allowable business expenses percentage (default 15%)
  const [expensesPercent, setExpensesPercent] = useState<number>(15);

  const robloxAnnualGbp = calculationMode === 'annualized' ? currentCashoutGbp * 12 : currentCashoutGbp;
  const allowableExpenses = robloxAnnualGbp * (expensesPercent / 100);
  const robloxTaxableProfit = Math.max(0, robloxAnnualGbp - allowableExpenses);

  const totalCombinedIncome = otherAnnualIncome + robloxTaxableProfit;

  // UK Tax Band Constants (2024/25)
  const PERSONAL_ALLOWANCE = 12570;
  const BASIC_RATE_LIMIT = 50270;
  const HIGHER_RATE_LIMIT = 125140;

  // Helper: compute pure income tax given taxable profit and starting baseline income
  const computeIncomeTax = (startIncome: number, addedIncome: number) => {
    let tax = 0;
    const endIncome = startIncome + addedIncome;

    // Segment in Basic Rate (£12,570 to £50,270)
    const basicStart = Math.max(PERSONAL_ALLOWANCE, startIncome);
    const basicEnd = Math.min(BASIC_RATE_LIMIT, endIncome);
    if (basicEnd > basicStart) {
      tax += (basicEnd - basicStart) * 0.20;
    }

    // Segment in Higher Rate (£50,270 to £125,140)
    const higherStart = Math.max(BASIC_RATE_LIMIT, startIncome);
    const higherEnd = Math.min(HIGHER_RATE_LIMIT, endIncome);
    if (higherEnd > higherStart) {
      tax += (higherEnd - higherStart) * 0.40;
    }

    // Segment in Additional Rate (Over £125,140)
    const additionalStart = Math.max(HIGHER_RATE_LIMIT, startIncome);
    const additionalEnd = Math.max(HIGHER_RATE_LIMIT, endIncome);
    if (additionalEnd > additionalStart) {
      tax += (additionalEnd - additionalStart) * 0.45;
    }

    // 60% trap: Personal allowance reduction between £100,000 and £125,140
    // Every £2 over £100,000 loses £1 allowance, effectively adding 20% extra tax
    const trapStart = Math.max(100000, startIncome);
    const trapEnd = Math.min(125140, endIncome);
    if (trapEnd > trapStart) {
      tax += (trapEnd - trapStart) * 0.20; // 40% + 20% = 60% effective
    }

    return tax;
  };

  // 1. Tax on Other Income alone
  const baseIncomeTax = computeIncomeTax(0, otherAnnualIncome);

  // 2. Incremental Tax specifically on Roblox DevEx
  const incrementalIncomeTax = computeIncomeTax(otherAnnualIncome, robloxTaxableProfit);

  // 3. Class 4 National Insurance on Roblox Trading Profit (Sole Trader)
  // 6% between £12,570 and £50,270, 2% above £50,270
  let robloxClass4NI = 0;
  const niStart = otherAnnualIncome;
  const niEnd = totalCombinedIncome;

  const niBand1Start = Math.max(PERSONAL_ALLOWANCE, niStart);
  const niBand1End = Math.min(BASIC_RATE_LIMIT, niEnd);
  if (niBand1End > niBand1Start) {
    robloxClass4NI += (niBand1End - niBand1Start) * 0.06;
  }

  const niBand2Start = Math.max(BASIC_RATE_LIMIT, niStart);
  const niBand2End = Math.max(BASIC_RATE_LIMIT, niEnd);
  if (niBand2End > niBand2Start) {
    robloxClass4NI += (niBand2End - niBand2Start) * 0.02;
  }

  // Combined Roblox Tax Liability & Take-Home
  const totalRobloxTaxLiability = incrementalIncomeTax + robloxClass4NI;
  const robloxNetTakeHome = Math.max(0, robloxAnnualGbp - allowableExpenses - totalRobloxTaxLiability);
  const marginalTaxRate = robloxAnnualGbp > 0 ? (totalRobloxTaxLiability / robloxAnnualGbp) * 100 : 0;

  // Determine which tax band(s) the Roblox DevEx spans
  let currentBandHeadline = 'Basic Rate (20%)';
  let bandShiftWarning: string | null = null;

  if (otherAnnualIncome < PERSONAL_ALLOWANCE && totalCombinedIncome <= PERSONAL_ALLOWANCE) {
    currentBandHeadline = 'Tax-Free Personal Allowance (0%)';
  } else if (otherAnnualIncome >= HIGHER_RATE_LIMIT) {
    currentBandHeadline = 'Additional Rate (45%)';
    bandShiftWarning = 'High-Earner Alert: Your total income exceeds £125,140. Roblox DevEx profits are taxed at 45% + 2% NI. Setting up a UK Limited Company (Ltd) will cap your rate at 25% Corporation Tax.';
  } else if (totalCombinedIncome > HIGHER_RATE_LIMIT) {
    currentBandHeadline = 'Crosses into Additional Rate (45%)';
    bandShiftWarning = 'Roblox earnings push your total annual earnings into the top 45% Additional Rate bracket.';
  } else if (totalCombinedIncome > 100000 && otherAnnualIncome < 100000) {
    currentBandHeadline = 'Crosses into 60% Taper Zone';
    bandShiftWarning = '⚠️ The £100k–£125k Tax Trap: Because your combined income exceeds £100,000, HMRC reduces your Personal Allowance by £1 for every £2 earned, creating an effective 60% marginal tax rate on this slice of income!';
  } else if (totalCombinedIncome > BASIC_RATE_LIMIT && otherAnnualIncome <= BASIC_RATE_LIMIT) {
    currentBandHeadline = 'Pushes into Higher Rate (40%)';
    bandShiftWarning = `Your other job (£${otherAnnualIncome.toLocaleString()}) combined with Roblox DevEx (£${Math.round(robloxAnnualGbp).toLocaleString()}) crosses the £50,270 threshold into the 40% Higher Rate band. Every £1 earned above £50,270 incurs 40% Income Tax + 2% NI.`;
  } else if (otherAnnualIncome >= BASIC_RATE_LIMIT) {
    currentBandHeadline = 'Higher Rate (40%)';
    bandShiftWarning = 'Your other job already places you in the 40% Higher Rate tax bracket. 100% of your Roblox DevEx earnings are taxed at 40% + 2% Class 4 NI.';
  } else if (otherAnnualIncome >= PERSONAL_ALLOWANCE) {
    currentBandHeadline = 'Basic Rate (20%)';
  }

  const presets = [
    { label: '£0 (Solo Dev)', value: 0 },
    { label: '£12,000 (Part-Time)', value: 12000 },
    { label: '£28,000 (Full-Time)', value: 28000 },
    { label: '£45,000 (Mid-Salary)', value: 45000 },
    { label: '£65,000 (Senior)', value: 65000 },
  ];

  return (
    <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>HMRC Statutory Tax Impact Simulator</span>
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Estimated Combined Income Tax &amp; Band Shift
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model how your potential Roblox DevEx earnings layer on top of a part-time job or salary to affect your overall UK Income Tax band.
          </p>
        </div>

        {/* Calculation Frequency Toggle */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setCalculationMode('annualized');
            }}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              calculationMode === 'annualized'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Annualized (12x Mo.)
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setCalculationMode('single');
            }}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              calculationMode === 'single'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Single Cashout
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Other Income Slider & Input */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Annual Income from Other Sources (Salary / Job)</span>
            </label>
            <span className="font-mono font-bold text-sky-400 text-sm">
              £{otherAnnualIncome.toLocaleString()}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="120000"
            step="1000"
            value={otherAnnualIncome}
            onChange={(e) => setOtherAnnualIncome(parseInt(e.target.value) || 0)}
            className="w-full accent-sky-400 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setOtherAnnualIncome(p.value);
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  otherAnnualIncome === p.value
                    ? 'bg-sky-950 text-sky-300 border-sky-600'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Roblox DevEx Inputs & Expenses Deduction */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <RobuxIcon className="w-3.5 h-3.5" />
              <span>Projected Roblox DevEx ({calculationMode === 'annualized' ? '12 Months' : 'Single'})</span>
            </label>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              £{Math.round(robloxAnnualGbp).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-slate-400 text-[11px]">Allowable Studio Expenses:</span>
            <span className="font-mono text-teal-400 font-bold">{expensesPercent}% (-£{Math.round(allowableExpenses).toLocaleString()})</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={expensesPercent}
            onChange={(e) => setExpensesPercent(parseInt(e.target.value))}
            className="w-full accent-teal-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Deductible: Hardware, Blender assets, ad tests</span>
            <span>Net Taxable: £{Math.round(robloxTaxableProfit).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Visual Stacked Band Meter */}
      <div className="bg-[#080c13] border border-slate-800/80 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Combined UK Tax Band Placement (£{Math.round(totalCombinedIncome).toLocaleString()} Total)
          </span>
          <span className="text-[11px] font-mono text-emerald-300">
            Current Tier: <strong>{currentBandHeadline}</strong>
          </span>
        </div>

        {/* Multi-layered bar */}
        <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-800 flex relative">
          {/* Threshold markers */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/40 z-10"
            style={{ left: `${Math.min(100, (PERSONAL_ALLOWANCE / Math.max(totalCombinedIncome, 60000)) * 100)}%` }}
            title="Personal Allowance £12,570"
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
            style={{ left: `${Math.min(100, (BASIC_RATE_LIMIT / Math.max(totalCombinedIncome, 60000)) * 100)}%` }}
            title="Higher Rate Threshold £50,270"
          />

          {/* Other Income segment */}
          <div
            className="bg-sky-500 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, (otherAnnualIncome / Math.max(totalCombinedIncome, 1)) * 100)}%` }}
            title={`Other Income: £${otherAnnualIncome.toLocaleString()}`}
          />
          {/* Roblox DevEx segment */}
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, (robloxTaxableProfit / Math.max(totalCombinedIncome, 1)) * 100)}%` }}
            title={`Roblox Taxable DevEx: £${Math.round(robloxTaxableProfit).toLocaleString()}`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block" />
              Other Income (£{otherAnnualIncome.toLocaleString()})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
              Roblox DevEx (£{Math.round(robloxTaxableProfit).toLocaleString()})
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span>PA Limit: £12.5k</span>
            <span>Higher Rate: £50.2k</span>
          </div>
        </div>
      </div>

      {/* Tax Liability & True Take-Home Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Card 1: Incremental Tax */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 text-[11px] block">Roblox Income Tax</span>
          <div className="text-xl font-bold font-mono text-rose-400">
            £{Math.round(incrementalIncomeTax).toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500">
            Calculated on top of existing £{otherAnnualIncome.toLocaleString()} salary baseline.
          </p>
        </div>

        {/* Card 2: Class 4 NI */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-slate-400 text-[11px] block">Class 4 National Insurance</span>
          <div className="text-xl font-bold font-mono text-amber-400">
            £{Math.round(robloxClass4NI).toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500">
            6% sole trader NI on profits up to £50.2k; 2% on excess.
          </p>
        </div>

        {/* Card 3: True Clean Roblox Take-Home */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 font-bold text-[11px]">True Clean Roblox Take-Home</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-1.5 py-0.2 rounded border border-emerald-700/50">
              {marginalTaxRate.toFixed(1)}% Eff. Tax
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300">
            £{Math.round(robloxNetTakeHome).toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-300 leading-tight">
            Disposable fiat in your personal bank account after all HMRC statutory deductions.
          </p>
        </div>
      </div>

      {/* Advisory Callout */}
      {bandShiftWarning && (
        <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300 block">UK Tax Band Shift Advisory:</span>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              {bandShiftWarning}
            </p>
            {totalCombinedIncome > BASIC_RATE_LIMIT && (
              <div className="pt-1 text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Tip: Setting up a UK Limited Company (Ltd) allows retaining profits at 19%–25% Corporation Tax without triggering 40% personal income tax.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
