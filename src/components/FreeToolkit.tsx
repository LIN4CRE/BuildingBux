import React from 'react';
import { FREE_CREATOR_RESOURCES } from '../data/freeResourcesData';
import { ExternalLink, Download, Layers, ShieldCheck, Sparkles, FolderDown } from 'lucide-react';

export const FreeToolkit: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Cost Development Pipeline</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
            The Free Creator Toolkit & Resource Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Every software, 3D asset pack, audio library, and open-source Luau module you need to build front-page quality Roblox games without spending any money.
          </p>
        </div>
      </div>

      {/* Resource Categories */}
      <div className="space-y-6">
        {FREE_CREATOR_RESOURCES.map((cat, idx) => (
          <div key={idx} className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                {cat.category}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {item.cost}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <strong className="text-slate-300">Why You Need It:</strong> {item.whyYouNeedIt}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{item.type}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Visit Website / Repo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Copyright Guidance */}
      <div className="bg-[#0e1420] border border-slate-800 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-white">The Golden Rule of Free Assets in Roblox</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Never insert random free models from the Roblox Toolbox that contain unverified scripts, backdoors, or "fire spread" viruses. Only use verified models (with the blue shield badge from Roblox) or import CC0 models from Kenney and Quaternius. This guarantees your game never gets infected with lag scripts or admin abuse vulnerabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
