import React, { useState, useEffect } from 'react';
import { Gauge, Smartphone, Monitor, ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw, Sparkles, Volume2, Box, Image, Cpu, Info, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

export interface AssetBudget {
  deviceTarget: 'low_end_mobile' | 'mainstream_mobile' | 'pc_console';
  bgMusicTracks: number;
  sfxClips: number;
  uniqueMeshes: number;
  totalTriangles: number;
  textures1024: number;
  textures512: number;
  textures256: number;
  totalParts: number;
  streamingEnabled: boolean;
}

const DEFAULT_BUDGET: AssetBudget = {
  deviceTarget: 'low_end_mobile',
  bgMusicTracks: 4,
  sfxClips: 28,
  uniqueMeshes: 85,
  totalTriangles: 185000,
  textures1024: 6,
  textures512: 24,
  textures256: 45,
  totalParts: 6800,
  streamingEnabled: true
};

const DEVICE_PROFILES = {
  low_end_mobile: {
    label: 'Low-End Mobile (2GB–3GB RAM)',
    deviceExamples: 'iPhone 7/8, Samsung Galaxy A-series, Android Go',
    audioMbLimit: 25,
    triangleLimit: 250000,
    textureVramMbLimit: 100,
    partLimit: 8000
  },
  mainstream_mobile: {
    label: 'Mainstream Mobile & Tablet (4GB RAM)',
    deviceExamples: 'iPhone 11–14, iPad 9th/10th Gen, Galaxy S20+',
    audioMbLimit: 50,
    triangleLimit: 500000,
    textureVramMbLimit: 180,
    partLimit: 15000
  },
  pc_console: {
    label: 'PC, Mac & Console (8GB+ RAM)',
    deviceExamples: 'Gaming PCs, PlayStation 4/5, Xbox Series S/X',
    audioMbLimit: 120,
    triangleLimit: 1500000,
    textureVramMbLimit: 400,
    partLimit: 45000
  }
};

export const AssetBudgetingTool: React.FC = () => {
  const [budget, setBudget] = useState<AssetBudget>(() => {
    try {
      const saved = localStorage.getItem('blox_asset_budget');
      return saved ? JSON.parse(saved) : DEFAULT_BUDGET;
    } catch {
      return DEFAULT_BUDGET;
    }
  });

  const [copiedTip, setCopiedTip] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('blox_asset_budget', JSON.stringify(budget));
    } catch (e) {
      console.warn(e);
    }
  }, [budget]);

  const activeProfile = DEVICE_PROFILES[budget.deviceTarget];

  // Calculated Metrics
  // Approx: 1 bg music track ~ 3.5 MB; 1 SFX ~ 0.2 MB
  const estimatedAudioMb = Math.round((budget.bgMusicTracks * 3.5 + budget.sfxClips * 0.2) * 10) / 10;

  // Approx: 1024x1024 texture with mipmaps = ~5.3 MB VRAM; 512x512 = ~1.3 MB; 256x256 = ~0.3 MB
  const estimatedTextureVramMb = Math.round(
    budget.textures1024 * 5.3 + budget.textures512 * 1.3 + budget.textures256 * 0.3
  );

  // Percentages of Budget
  const audioPct = Math.round((estimatedAudioMb / activeProfile.audioMbLimit) * 100);
  const trianglesPct = Math.round((budget.totalTriangles / activeProfile.triangleLimit) * 100);
  const texturePct = Math.round((estimatedTextureVramMb / activeProfile.textureVramMbLimit) * 100);
  const partsPct = Math.round((budget.totalParts / activeProfile.partLimit) * 100);

  // Overall Health Score (0 - 100)
  const maxUsage = Math.max(audioPct, trianglesPct, texturePct, partsPct);
  const healthScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, maxUsage - 70) * 1.5)));

  const handleResetDefaults = () => {
    sounds.playClick();
    setBudget(DEFAULT_BUDGET);
  };

  const getStatusColor = (pct: number) => {
    if (pct > 100) return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
    if (pct >= 80) return 'text-amber-400 bg-amber-950/40 border-amber-800/60';
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
  };

  const getBarColor = (pct: number) => {
    if (pct > 100) return 'bg-rose-500';
    if (pct >= 80) return 'bg-amber-400';
    return 'bg-emerald-500';
  };

  const warnings: string[] = [];
  if (audioPct > 100) {
    warnings.push(`Audio memory (${estimatedAudioMb} MB) exceeds ${activeProfile.audioMbLimit} MB limit. Low-end phones will delay audio playback or fail to load sound effects.`);
  }
  if (trianglesPct > 100) {
    warnings.push(`Scene polygon count (${budget.totalTriangles.toLocaleString()} tris) exceeds ${activeProfile.triangleLimit.toLocaleString()} tris. Frame rates on mobile will drop below 30 FPS.`);
  }
  if (texturePct > 100) {
    warnings.push(`Texture VRAM (${estimatedTextureVramMb} MB) exceeds ${activeProfile.textureVramMbLimit} MB. Roblox client will encounter black texture pop-in or crash on 2GB RAM devices.`);
  }
  if (partsPct > 100) {
    warnings.push(`Part count (${budget.totalParts.toLocaleString()}) exceeds ${activeProfile.partLimit.toLocaleString()} parts. Make sure Workspace.StreamingEnabled is turned on!`);
  }

  return (
    <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Gauge className="w-3.5 h-3.5" />
            <span>Roblox Engine Performance Profiler</span>
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Mobile &amp; Low-End Device Asset Budget Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Over 75% of Roblox players play on mobile phones and tablets. Track audio, mesh polygons, and texture VRAM to prevent client crashes and maximize player retention.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset to safe mobile defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Device Selector & Health Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Device Profile Selectors */}
        <div className="lg:col-span-2 bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Target Hardware Specification:</span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">{activeProfile.deviceExamples}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(DEVICE_PROFILES) as (keyof typeof DEVICE_PROFILES)[]).map((key) => {
              const prof = DEVICE_PROFILES[key];
              const isSelected = budget.deviceTarget === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setBudget({ ...budget, deviceTarget: key });
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-[#101726] border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {prof.label.split(' (')[0]}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">
                    {prof.label.match(/\((.*?)\)/)?.[1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Health Score Card */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Mobile Stability Score</span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold border ${getStatusColor(maxUsage)}`}>
              {maxUsage <= 80 ? 'Optimal (60 FPS)' : maxUsage <= 100 ? 'Moderate' : 'Crash Risk'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black font-mono text-white">
              {healthScore}<span className="text-sm text-slate-500">/100</span>
            </div>
            <span className="text-xs text-slate-400">
              {healthScore >= 80 ? 'Compatible with 98% of Roblox players' : 'High crash risk on 2GB RAM phones'}
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Interactive Budget Metric Sliders & Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Audio Budget */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              Audio Memory
            </span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(audioPct)}`}>
              {audioPct}%
            </span>
          </div>

          <div>
            <div className="text-lg font-bold font-mono text-white">
              ~{estimatedAudioMb} <span className="text-xs text-slate-500 font-normal">/ {activeProfile.audioMbLimit} MB</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {budget.bgMusicTracks} Music Tracks · {budget.sfxClips} SFX Clips
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getBarColor(audioPct)}`}
              style={{ width: `${Math.min(100, audioPct)}%` }}
            />
          </div>

          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>BG Music Tracks:</span>
              <input
                type="number"
                min="0"
                max="30"
                value={budget.bgMusicTracks}
                onChange={(e) => setBudget({ ...budget, bgMusicTracks: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white"
              />
            </div>
            <div className="flex justify-between text-slate-400">
              <span>SFX Audio Clips:</span>
              <input
                type="number"
                min="0"
                max="150"
                value={budget.sfxClips}
                onChange={(e) => setBudget({ ...budget, sfxClips: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white"
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Mesh Polygons */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-amber-400" />
              Scene Polygons
            </span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(trianglesPct)}`}>
              {trianglesPct}%
            </span>
          </div>

          <div>
            <div className="text-lg font-bold font-mono text-white">
              {(budget.totalTriangles / 1000).toFixed(0)}k <span className="text-xs text-slate-500 font-normal">/ {(activeProfile.triangleLimit / 1000).toFixed(0)}k Tris</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {budget.uniqueMeshes} Unique MeshParts
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getBarColor(trianglesPct)}`}
              style={{ width: `${Math.min(100, trianglesPct)}%` }}
            />
          </div>

          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Total Triangles:</span>
              <input
                type="number"
                min="1000"
                step="25000"
                value={budget.totalTriangles}
                onChange={(e) => setBudget({ ...budget, totalTriangles: Math.max(1000, parseInt(e.target.value) || 0) })}
                className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white"
              />
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Unique Meshes:</span>
              <input
                type="number"
                min="1"
                value={budget.uniqueMeshes}
                onChange={(e) => setBudget({ ...budget, uniqueMeshes: Math.max(1, parseInt(e.target.value) || 0) })}
                className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white"
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Textures & VRAM */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-purple-400" />
              Texture VRAM
            </span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(texturePct)}`}>
              {texturePct}%
            </span>
          </div>

          <div>
            <div className="text-lg font-bold font-mono text-white">
              ~{estimatedTextureVramMb} <span className="text-xs text-slate-500 font-normal">/ {activeProfile.textureVramMbLimit} MB</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {budget.textures1024}x 1024px · {budget.textures512}x 512px
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getBarColor(texturePct)}`}
              style={{ width: `${Math.min(100, texturePct)}%` }}
            />
          </div>

          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>1024px Textures:</span>
              <input
                type="number"
                min="0"
                value={budget.textures1024}
                onChange={(e) => setBudget({ ...budget, textures1024: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white"
              />
            </div>
            <div className="flex justify-between text-slate-400">
              <span>512px Textures:</span>
              <input
                type="number"
                min="0"
                value={budget.textures512}
                onChange={(e) => setBudget({ ...budget, textures512: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white"
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Instances & StreamingEnabled */}
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              Instance Budget
            </span>
            <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(partsPct)}`}>
              {partsPct}%
            </span>
          </div>

          <div>
            <div className="text-lg font-bold font-mono text-white">
              {(budget.totalParts / 1000).toFixed(1)}k <span className="text-xs text-slate-500 font-normal">/ {(activeProfile.partLimit / 1000).toFixed(0)}k Parts</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Streaming: <strong className={budget.streamingEnabled ? 'text-emerald-400' : 'text-rose-400'}>{budget.streamingEnabled ? 'Enabled' : 'Disabled'}</strong>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getBarColor(partsPct)}`}
              style={{ width: `${Math.min(100, partsPct)}%` }}
            />
          </div>

          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Total Parts:</span>
              <input
                type="number"
                min="100"
                step="1000"
                value={budget.totalParts}
                onChange={(e) => setBudget({ ...budget, totalParts: Math.max(100, parseInt(e.target.value) || 0) })}
                className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white"
              />
            </div>
            <div className="flex items-center justify-between text-slate-400 pt-0.5">
              <span>StreamingEnabled:</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setBudget({ ...budget, streamingEnabled: !budget.streamingEnabled });
                }}
                className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  budget.streamingEnabled
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}
              >
                {budget.streamingEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Alerts (if any) */}
      {warnings.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Mobile Performance Warnings for {activeProfile.label}:</span>
          </div>
          <ul className="space-y-1 text-xs text-rose-200/90 pl-5 list-disc">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Studio Action Tips */}
      <div className="bg-[#080c13] border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-white">Recommended Optimization:</span>
            <p className="text-[11px] text-slate-400">
              Downscale 1024x1024 textures to 512x512 using Photopea to cut VRAM usage by 75% without perceptible visual loss on mobile screens. Set MeshPart collision to <code className="text-emerald-300 bg-slate-900 px-1 py-0.2 rounded font-mono">Box</code> or <code className="text-emerald-300 bg-slate-900 px-1 py-0.2 rounded font-mono">Hull</code>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(`workspace.StreamingEnabled = true\nworkspace.StreamingMinRadius = 64\nworkspace.StreamingTargetRadius = 512`);
            sounds.playClick();
            setCopiedTip(true);
            setTimeout(() => setCopiedTip(false), 2000);
          }}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 self-end sm:self-auto"
        >
          {copiedTip ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{copiedTip ? 'Copied' : 'Copy Streaming Config'}</span>
        </button>
      </div>
    </div>
  );
};
