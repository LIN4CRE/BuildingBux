import React, { useState, useEffect, useMemo } from 'react';
import { MONETIZATION_TIPS_DATABASE, MonetizationTip } from '../data/monetizationTipsData';
import { Lightbulb, ChevronLeft, ChevronRight, TrendingUp, Sparkles, Target, Award, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { RobuxGoldIcon, RobuxIcon } from './Icons';
import { sounds } from '../utils/audio';

interface DailyMonetizationTipCarouselProps {
  arpdauRobux: number;
  conversionRate: number;
  premiumShare: number;
}

export const DailyMonetizationTipCarousel: React.FC<DailyMonetizationTipCarouselProps> = ({
  arpdauRobux,
  conversionRate,
  premiumShare
}) => {
  // Sort tips contextually based on current metrics
  const sortedTips = useMemo(() => {
    let prioritizedCondition = 'mid_arpdau';
    if (arpdauRobux < 0.5) {
      prioritizedCondition = 'low_arpdau';
    } else if (conversionRate < 2.0) {
      prioritizedCondition = 'low_conversion';
    } else if (premiumShare < 15) {
      prioritizedCondition = 'low_premium';
    } else if (arpdauRobux >= 1.2) {
      prioritizedCondition = 'high_arpdau';
    }

    return [...MONETIZATION_TIPS_DATABASE].sort((a, b) => {
      const aMatches = a.contextCondition === prioritizedCondition ? 1 : 0;
      const bMatches = b.contextCondition === prioritizedCondition ? 1 : 0;
      return bMatches - aMatches;
    });
  }, [arpdauRobux, conversionRate, premiumShare]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Keep index within bounds when sortedTips change
  useEffect(() => {
    if (currentIndex >= sortedTips.length) {
      setCurrentIndex(0);
    }
  }, [sortedTips, currentIndex]);

  const currentTip: MonetizationTip = sortedTips[currentIndex] || MONETIZATION_TIPS_DATABASE[0];

  const handlePrev = () => {
    sounds.playClick();
    setCurrentIndex((prev) => (prev === 0 ? sortedTips.length - 1 : prev - 1));
  };

  const handleNext = () => {
    sounds.playClick();
    setCurrentIndex((prev) => (prev === sortedTips.length - 1 ? 0 : prev + 1));
  };

  // Context diagnosis message
  const diagnosis = useMemo(() => {
    if (arpdauRobux < 0.5) {
      return `Context Alert: Current ARPDAU is ${arpdauRobux.toFixed(2)} R$ (below the 0.65 R$ benchmark). Focus on low-friction impulse purchases.`;
    }
    if (conversionRate < 2.0) {
      return `Context Alert: Conversion rate is ${conversionRate.toFixed(1)}% (below average). Focus on FTUE starter bundles.`;
    }
    if (premiumShare < 15) {
      return `Context Alert: Premium player share is ${premiumShare}%. Capitalize on Roblox EBP with timed rewards.`;
    }
    if (arpdauRobux >= 1.2) {
      return `High-Yield Context: Current ARPDAU is ${arpdauRobux.toFixed(2)} R$. Maximize uncapped whale sinks and repeatable crates.`;
    }
    return `Balanced Studio Context: Target weekend LiveOps and decoy pricing to scale ARPDAU toward 1.20 R$.`;
  }, [arpdauRobux, conversionRate, premiumShare]);

  return (
    <div className="bg-gradient-to-r from-[#101726] via-[#0d1320] to-[#101726] border border-amber-500/30 rounded-xl p-5 sm:p-6 space-y-4 shadow-lg shadow-black/20">
      {/* Top Banner & Context Diagnosis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display">
                Daily Monetization Strategy &amp; ARPDAU Accelerator
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                Tip {currentIndex + 1} of {sortedTips.length}
              </span>
            </div>
            <p className="text-[11px] text-amber-300/80 font-mono mt-0.5">
              {diagnosis}
            </p>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Previous Strategy"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Next Strategy"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tip Showcase Card */}
      <div className="bg-[#080c13] border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-3 border-b border-slate-800/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                {currentTip.category}
              </span>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                Target: {currentTip.targetMetric}
              </span>
            </div>
            <h4 className="text-base font-bold text-white font-display pt-0.5">
              {currentTip.title}
            </h4>
            <div className="text-xs font-semibold text-emerald-300">
              {currentTip.headline}
            </div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg shrink-0">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Projected Impact</span>
            <span className="text-xs font-bold font-mono text-emerald-400">{currentTip.projectedLift}</span>
          </div>
        </div>

        {/* Detailed Strategic Advice */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentTip.advice}
        </p>

        {/* Studio Case Study & Takeaway Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="bg-[#101726] border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px]">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Proven Roblox Hit Case Study</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {currentTip.robloxCaseStudy}
            </p>
          </div>

          <div className="bg-[#101726] border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Developer Commercial Rule</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {currentTip.quickTakeaway}
            </p>
          </div>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {sortedTips.map((tip, idx) => (
            <button
              key={tip.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              title={tip.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
