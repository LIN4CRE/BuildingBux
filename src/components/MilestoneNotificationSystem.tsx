import React, { useState } from 'react';
import { Milestone } from '../utils/milestones';
import { Trophy, CheckCircle2, Lock, X, Sparkles, AlertCircle, ArrowRight, Bell } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: Milestone[];
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ isOpen, onClose, milestones }) => {
  if (!isOpen) return null;

  const unlockedCount = milestones.filter(m => m.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101726] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0f17]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">
                  Project Milestones &amp; Achievement Rack
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                  {unlockedCount} / {milestones.length} Unlocked
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Track how your project scales from prototype to professional six-figure studio.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone List */}
        <div className="p-5 overflow-y-auto space-y-3.5 divide-y divide-slate-800/60">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                m.unlocked ? 'opacity-100' : 'opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  m.unlocked
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}>
                  {m.unlocked ? <Trophy className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white font-display">{m.title}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                      m.unlocked
                        ? 'bg-emerald-950/80 border border-emerald-800/60 text-emerald-300'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}>
                      {m.unlocked ? 'COMPLETED' : `${m.progress}% PROGRESS`}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="bg-[#080c13] p-2 rounded border border-slate-800/80 text-[10px] text-slate-400 space-y-0.5 font-mono">
                    <div>Target Threshold: <strong className="text-slate-200">{m.thresholdText}</strong></div>
                    <div>Current Performance: <strong className={m.unlocked ? 'text-emerald-400' : 'text-amber-400'}>{m.currentValueText}</strong></div>
                  </div>

                  <div className="text-[10px] text-emerald-300/90 leading-tight pt-1">
                    💡 <strong>Significance:</strong> {m.significance}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="sm:w-32 shrink-0 self-end sm:self-center">
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      m.unlocked ? 'bg-emerald-400' : 'bg-amber-500/80'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <div className="text-right text-[10px] font-mono text-slate-400 mt-0.5">
                  {m.progress}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0b0f17] flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">
            Milestones update dynamically with your simulation inputs and live revenue numbers.
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
