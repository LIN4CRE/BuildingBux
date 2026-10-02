import React, { useState } from 'react';
import { STEP_BY_STEP_PUBLISH_ROADMAP } from '../data/freeResourcesData';
import { CheckCircle2, ChevronRight, Clock, Sparkles, Rocket, Lightbulb } from 'lucide-react';

export const PublishingGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string>('01');

  const currentStep = STEP_BY_STEP_PUBLISH_ROADMAP.find((s) => s.step === activeStep) || STEP_BY_STEP_PUBLISH_ROADMAP[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
            <Rocket className="w-3.5 h-3.5" />
            <span>The 7-Day Zero-Cost Launch Roadmap</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
            Step-by-Step Guide: Getting Your Game on Roblox for Free
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            From downloading Roblox Studio on Day 1 to publishing publicly and driving organic traffic on Day 7 without spending a single pound on ads.
          </p>
        </div>

        {/* Step timeline bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-6 border-t border-slate-800/80">
          {STEP_BY_STEP_PUBLISH_ROADMAP.map((phase) => {
            const isActive = phase.step === activeStep;
            return (
              <button
                key={phase.step}
                onClick={() => setActiveStep(phase.step)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-800 border-emerald-500/60 shadow-sm'
                    : 'bg-[#0b0f17] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    STEP {phase.step}
                  </span>
                  <span className="text-[10px] text-slate-500">{phase.duration}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight">
                  {phase.title.split(': ')[1] || phase.title.split(' (')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Content */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="pb-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>STEP {currentStep.step}</span>
              <span>·</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Timeframe: {currentStep.duration}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              {currentStep.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              <strong className="text-slate-200">Objective: </strong> {currentStep.objective}
            </p>
          </div>
        </div>

        {/* Action Items List */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Execution Checklist
          </h3>
          <div className="space-y-2">
            {currentStep.actionItems.map((action, idx) => (
              <div
                key={idx}
                className="bg-[#0b0f17] border border-slate-800/80 rounded-lg p-3.5 text-xs text-slate-300 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Free Tools & Key Secret */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-300">100% Free Tools Used</h4>
            <div className="flex flex-wrap gap-1.5">
              {currentStep.freeToolsUsed.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] font-mono text-emerald-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Studio Growth Secret</span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              {currentStep.keySecret}
            </p>
          </div>
        </div>

        {/* Next Step Nav */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <div className="text-slate-500">
            Step {currentStep.step} of 06
          </div>
          {parseInt(currentStep.step) < 6 ? (
            <button
              onClick={() => {
                const nextNum = parseInt(currentStep.step) + 1;
                const nextStr = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
                setActiveStep(nextStr);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <span>Next: Step 0{parseInt(currentStep.step) + 1}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveStep('01')}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Back to Step 01
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
