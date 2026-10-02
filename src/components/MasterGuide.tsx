import React, { useState } from 'react';
import { GUIDE_PHASES, GuidePhase } from '../data/guideData';
import { CheckCircle2, ChevronRight, AlertTriangle, Lightbulb, Sparkles, BookOpen, Clock } from 'lucide-react';

export const MasterGuide: React.FC = () => {
  const [activePhaseId, setActivePhaseId] = useState<string>('phase-concept');

  const currentPhase = GUIDE_PHASES.find((p) => p.id === activePhaseId) || GUIDE_PHASES[0];

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Developer Masterclass</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            How to Build a Roblox Game That People Spend Robux On
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            A comprehensive, battle-tested blueprint covering game psychology, game passes, developer products, recurring revenue models, and exchanging Robux into British Pounds (£).
          </p>
        </div>

        {/* Phase selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-6 border-t border-slate-800/80">
          {GUIDE_PHASES.map((phase) => {
            const isActive = phase.id === activePhaseId;
            return (
              <button
                key={phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-800/90 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-[#0b0f17] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    STEP {phase.stepNumber}
                  </span>
                  <span className="text-[10px] text-slate-500">{phase.duration}</span>
                </div>
                <div className="text-xs font-semibold leading-tight line-clamp-2">
                  {phase.title.split(':')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Phase Content View */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Phase Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>STEP {currentPhase.stepNumber}</span>
              <span>·</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {currentPhase.duration}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              {currentPhase.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {currentPhase.summary}
            </p>
          </div>
        </div>

        {/* Key Tactics Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Core Implementation Pillars
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentPhase.keyTactics.map((tactic, idx) => (
              <div
                key={idx}
                className="bg-[#0b0f17] border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{tactic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive Sections */}
        <div className="space-y-4 pt-2">
          {currentPhase.deepDive.map((dive, idx) => (
            <div
              key={idx}
              className="bg-[#0b0f17] border border-slate-800 rounded-lg p-5 space-y-4"
            >
              <div>
                <h4 className="text-sm font-bold text-white mb-2 font-display">
                  {dive.heading}
                </h4>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                  {dive.content}
                </div>
              </div>

              {/* Pro Tip & Pitfall Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Developer Pro Tip</span>
                  </div>
                  <p className="text-emerald-200/80 text-[11px] leading-relaxed">
                    {dive.proTip}
                  </p>
                </div>

                <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Pitfall to Avoid</span>
                  </div>
                  <p className="text-rose-200/80 text-[11px] leading-relaxed">
                    {dive.pitfallToAvoid}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <div className="text-slate-500">
            Phase {currentPhase.stepNumber} of 06
          </div>
          {parseInt(currentPhase.stepNumber) < 6 ? (
            <button
              onClick={() => {
                const nextIdx = parseInt(currentPhase.stepNumber);
                if (nextIdx < GUIDE_PHASES.length) {
                  setActivePhaseId(GUIDE_PHASES[nextIdx].id);
                }
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <span>Next: Step 0{parseInt(currentPhase.stepNumber) + 1}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActivePhaseId('phase-concept')}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Back to Start (Step 01)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
