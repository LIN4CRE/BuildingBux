import React, { useState } from 'react';
import { DollarSign, AlertCircle, CheckCircle2, TrendingUp, HelpCircle, ArrowUpRight } from 'lucide-react';

export const DevExCalculator: React.FC = () => {
  // Gross Robux in-game sales
  const [grossRobux, setGrossRobux] = useState<number>(100000);
  const [usdToGbpRate, setUsdToGbpRate] = useState<number>(0.78); // £0.78 per $1 USD (~ £1 = $1.28 USD)
  const [isGrossInput, setIsGrossInput] = useState<boolean>(true); // true = gross sales, false = net earned robux

  // Calculate Net Earned Robux
  // If user inputs gross sales, creator gets 70% (Roblox takes 30% marketplace fee)
  const netRobux = isGrossInput ? Math.round(grossRobux * 0.7) : grossRobux;
  const robloxMarketplaceCut = isGrossInput ? Math.round(grossRobux * 0.3) : Math.round((grossRobux / 0.7) * 0.3);

  // Official DevEx Rate: $0.0035 USD per 1 Earned Robux
  const DEVEX_RATE_USD = 0.0035;
  const MIN_DEVEX_THRESHOLD = 30000; // 30,000 Robux is the official minimum threshold

  const devexUsd = netRobux * DEVEX_RATE_USD;
  const devexGbp = devexUsd * usdToGbpRate;
  const qualifies = netRobux >= MIN_DEVEX_THRESHOLD;

  // Preset Milestones
  const presets = [
    { label: '30,000 R$ (Min Threshold)', netVal: 30000 },
    { label: '50,000 R$', netVal: 50000 },
    { label: '100,000 R$', netVal: 100000 },
    { label: '500,000 R$', netVal: 500000 },
    { label: '1,000,000 R$', netVal: 100000 },
    { label: '5,000,000 R$', netVal: 5000000 },
  ];

  // UK Tax estimation
  const tradingAllowance = 1000; // £1,000 tax-free trading allowance in UK
  const taxableGbp = Math.max(0, devexGbp - tradingAllowance);
  const estimatedBasicTax = taxableGbp * 0.20; // 20% basic rate band
  const netGbpAfterTax = devexGbp - estimatedBasicTax;

  const handlePresetClick = (netTarget: number) => {
    if (isGrossInput) {
      setGrossRobux(Math.round(netTarget / 0.7));
    } else {
      setGrossRobux(netTarget);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white font-display">
              Roblox DevEx to British Pounds (£) Calculator
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Calculate exact payouts from Roblox Developer Exchange (DevEx) directly into GBP (£) based on the official fixed exchange rate ($0.0035 USD per Robux).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Mode:</span>
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setIsGrossInput(true)}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  isGrossInput ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In-Game Sales (Gross)
              </button>
              <button
                onClick={() => setIsGrossInput(false)}
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
              <label className="text-xs font-semibold text-slate-300">
                {isGrossInput ? 'Gross In-Game Robux Sales' : 'Net Earned Robux (DevEx Balance)'}
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
                  className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">USD to GBP (£) Rate</label>
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
              Typical rate: £0.78 per $1 USD (£1 = $1.28 USD). Tipalti automatically applies live bank exchange rates.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Sales */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>In-Game Gross Sales</span>
            <span className="text-[10px] text-slate-500 font-mono">100% Volume</span>
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
            <span>Net Earned Robux</span>
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
            <span>DevEx Payout (USD)</span>
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
        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          <div className="text-xs text-emerald-300/80 flex items-center justify-between mb-1">
            <span className="font-semibold text-emerald-300">Net British Pounds (£)</span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded">UK Bank</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300 tabular-nums">
            £{devexGbp.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-300 mt-2 pt-2 border-t border-emerald-500/20">
            Direct Wire / BACS Transfer into UK Account
          </div>
        </div>
      </div>

      {/* DevEx Status Alert */}
      {!qualifies && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-amber-300">Minimum DevEx Threshold Not Yet Reached</h2>
            <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
              Roblox requires an account balance of at least <strong className="font-mono text-white">30,000 Earned Robux</strong> ($105.00 USD / ~£{(30000 * 0.0035 * usdToGbpRate).toFixed(2)} GBP) to submit a cashout request. You currently have <span className="font-mono font-semibold text-white">{netRobux.toLocaleString()} R$</span>.
            </p>
          </div>
        </div>
      )}

      {/* Two Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: DevEx Cashout Rules & Checklist */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-display">Roblox DevEx Eligibility Checklist</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">At least 13 years of age</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Creators aged 13-17 require parental/guardian consent during Tipalti portal onboarding.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Minimum 30,000 "Earned" Robux</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Must be earned from in-game Game Passes, Developer Products, Premium Payouts, or UGC avatar items. Robux purchased with a credit card or acquired through trading does <strong className="text-rose-400">NOT</strong> qualify.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Verified Email & 2-Factor Authentication</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Must have Authenticator App (Google/Microsoft Auth) enabled on your Roblox account.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Government ID Verification</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Valid UK Passport or UK Driving Licence verified through Roblox\'s Veriff portal.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Roblox Account in Good Standing</span>
                <p className="text-slate-400 text-[11px] mt-0.5">No recent moderation strikes, chargeback disputes, or Terms of Service violations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: UK Tax & HMRC Breakdown */}
        <div className="bg-[#101726] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white font-display">UK HMRC Tax & Take-Home Estimate</h2>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3.5 space-y-2.5 text-xs mb-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total DevEx Cashout (GBP):</span>
              <span className="font-mono font-semibold text-white">£{devexGbp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-teal-400">
              <span>HMRC £1,000 Trading Allowance:</span>
              <span className="font-mono font-semibold">-£{Math.min(devexGbp, tradingAllowance).toFixed(2)} Tax-Free</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Estimated Taxable Trading Profit:</span>
              <span className="font-mono font-semibold text-slate-200">£{taxableGbp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-rose-400/90 pt-2 border-t border-slate-800">
              <span>Estimated 20% Basic UK Income Tax*:</span>
              <span className="font-mono font-semibold">-£{estimatedBasicTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400 font-bold pt-2 border-t border-slate-800 text-sm">
              <span>Estimated Net Take-Home in Bank:</span>
              <span className="font-mono text-base">£{netGbpAfterTax.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            *UK tax note: If your total annual income across all jobs/work is under the standard Personal Allowance of £12,570, you pay 0% income tax. Always consult HMRC or an accountant once you exceed the £1,000 trading threshold.
          </p>
        </div>
      </div>

      {/* The Buy vs DevEx Spread Box */}
      <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-white">
              Why does 100,000 Robux cost ~£1,000 to buy, but cash out to ~£273 through DevEx?
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              When players buy Robux from Roblox, they pay retail price (~$0.0125 per Robux). Roblox uses this spread to cover server hosting costs, 3D engine physics infrastructure, customer support, and mobile app store commissions (Apple and Google take 30% on iOS/Android).
            </p>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Roblox DevEx is a creator revenue-sharing program that pays developers a guaranteed fixed rate of <strong className="text-emerald-400 font-mono">$0.0035 USD</strong> per earned Robux. Because your game can be played by millions of players 24/7 with zero server hosting bills, high-performing games scale into thousands of pounds monthly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
