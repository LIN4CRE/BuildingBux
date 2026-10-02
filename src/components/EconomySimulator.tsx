import React, { useState } from 'react';
import { Users, Coins, Sparkles, TrendingUp, Calendar, Clock, HelpCircle } from 'lucide-react';

export const EconomySimulator: React.FC = () => {
  // Input parameters
  const [ccu, setCcu] = useState<number>(250); // Concurrent players
  const [dauRatio, setDauRatio] = useState<number>(10); // Daily unique players = CCU * 10
  const [conversionRate, setConversionRate] = useState<number>(2.5); // 2.5% of players spend Robux
  const [arppu, setArppu] = useState<number>(280); // Average Robux spent by paying user
  const [premiumShare, setPremiumShare] = useState<number>(18); // 18% of players have Roblox Premium
  const [avgSessionMins, setAvgSessionMins] = useState<number>(16); // Average session length in minutes

  const DEVEX_RATE = 0.0035; // $0.0035 per Robux
  const USD_TO_GBP = 0.78; // £0.78 per $1 USD

  // Calculations
  const dau = ccu * dauRatio; // Daily Active Users
  const dailySpenders = Math.round(dau * (conversionRate / 100));
  const dailyGrossGameRobux = dailySpenders * arppu;

  // Premium Payouts calculation:
  // Total daily player hours = dau * (avgSessionMins / 60)
  // Premium hours = total daily player hours * (premiumShare / 100)
  // Roblox pays approx ~350 Robux per 1,000 premium hours (this is creator net Robux directly, no 30% cut applied to premium payouts!)
  const totalDailyHours = dau * (avgSessionMins / 60);
  const dailyPremiumHours = totalDailyHours * (premiumShare / 100);
  const dailyPremiumRobux = Math.round((dailyPremiumHours / 1000) * 380);

  // In-Game Purchases Net (after Roblox 30% fee)
  const dailyNetStoreRobux = Math.round(dailyGrossGameRobux * 0.7);

  // Total Net Earned Robux daily
  const dailyTotalNetRobux = dailyNetStoreRobux + dailyPremiumRobux;

  // Monthly projections (30 days)
  const monthlyNetRobux = dailyTotalNetRobux * 30;
  const monthlyDevExUsd = monthlyNetRobux * DEVEX_RATE;
  const monthlyDevExGbp = monthlyDevExUsd * USD_TO_GBP;

  // Annual projections (365 days)
  const annualNetRobux = dailyTotalNetRobux * 365;
  const annualDevExUsd = annualNetRobux * DEVEX_RATE;
  const annualDevExGbp = annualDevExUsd * USD_TO_GBP;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-bold text-white font-display">
          Roblox Game Economy & Revenue Simulator
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Simulate player traffic, spender conversion rates, and Roblox Premium engagement payouts to forecast realistic monthly and annual income in British Pounds (£).
        </p>

        {/* Input sliders grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-800/80">
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
              <span>10 (Indie start)</span>
              <span>500 (Solid hit)</span>
              <span>5,000 (Front page)</span>
            </div>
          </div>

          {/* Paying Conversion % */}
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
              <span>2.5% (Industry avg)</span>
              <span>5.0%+ (Simulator king)</span>
            </div>
          </div>

          {/* ARPPU (Average Robux per Spender) */}
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
              <span>50 R$ (Micro)</span>
              <span>280 R$ (Pass + Boost)</span>
              <span>1,000 R$ (Whale heavy)</span>
            </div>
          </div>
        </div>

        {/* Secondary Parameters row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-slate-800/40">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>DAU Multiplier (Daily turnover)</span>
              <span className="font-mono text-slate-400">{dauRatio}x ({dau.toLocaleString()} DAU)</span>
            </div>
            <input
              type="range"
              min="5"
              max="15"
              value={dauRatio}
              onChange={(e) => setDauRatio(parseInt(e.target.value))}
              className="w-full accent-slate-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Roblox Premium Players Share</span>
              <span className="font-mono text-slate-400">{premiumShare}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              value={premiumShare}
              onChange={(e) => setPremiumShare(parseInt(e.target.value))}
              className="w-full accent-slate-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Average Playtime Session</span>
              <span className="font-mono text-slate-400">{avgSessionMins} Mins</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={avgSessionMins}
              onChange={(e) => setAvgSessionMins(parseInt(e.target.value))}
              className="w-full accent-slate-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
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
            <span className="text-[11px] font-mono text-slate-500">24-hour cycle</span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {dailyTotalNetRobux.toLocaleString()} <span className="text-xs text-emerald-400">Net R$ / day</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              ~<span className="text-emerald-300 font-semibold">£{(dailyTotalNetRobux * DEVEX_RATE * USD_TO_GBP).toFixed(2)}</span> / day via DevEx
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Store Passes & Products (70%):</span>
              <span className="font-mono text-slate-200">{dailyNetStoreRobux.toLocaleString()} R$</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Premium Playtime Payouts:</span>
              <span className="font-mono text-teal-300">+{dailyPremiumRobux.toLocaleString()} R$</span>
            </div>
          </div>
        </div>

        {/* Card 2: Monthly DevEx Forecast */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Calendar className="w-3.5 h-3.5" />
              Monthly DevEx Income (£)
            </span>
            <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">
              30-Day Projection
            </span>
          </div>

          <div>
            <div className="text-3xl font-black font-mono text-emerald-300">
              £{monthlyDevExGbp.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              ${monthlyDevExUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD ({monthlyNetRobux.toLocaleString()} R$)
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-slate-300">
            {monthlyDevExGbp > 2500 ? (
              <span className="text-emerald-400 font-semibold">
                Surpasses average UK full-time median salary (£2,400/mo)!
              </span>
            ) : monthlyDevExGbp > 1000 ? (
              <span className="text-teal-300">
                Solid side-income. Covers rent / studio operating expenses.
              </span>
            ) : (
              <span className="text-slate-400">
                Great launchpad for scaling through content updates & ads.
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
              £{annualDevExGbp.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              ${annualDevExUsd.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD ({annualNetRobux.toLocaleString()} R$)
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Assumes consistent retention. Live-ops weekend updates typically cause 2x-3x spikes!
          </div>
        </div>
      </div>

      {/* Traffic & Benchmark Context Card */}
      <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5">
        <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Real-World Roblox Traffic Benchmarks & What to Expect
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <div className="font-semibold text-slate-200">50 - 150 CCU (Niche / Early Stage)</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Earns approx <strong>150k - 400k R$/month</strong> (~£400 - £1,100 / month). Perfect for solo developers building out their portfolio and mastering Lua scripting.
            </p>
          </div>
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <div className="font-semibold text-emerald-300">300 - 1,000 CCU (Trending Hit)</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Earns approx <strong>1M - 4M R$/month</strong> (~£2,700 - £11,000 / month). Sufficient to transition into full-time Roblox studio game development.
            </p>
          </div>
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <div className="font-semibold text-amber-300">2,500+ CCU (Front Page Success)</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Earns <strong>10M+ R$/month</strong> (~£27,000+ / month). Allows hiring 3D modelers, animators, and running large TikTok influencer campaigns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
