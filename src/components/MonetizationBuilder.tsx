import React, { useState } from 'react';
import { GENRE_PRESETS } from '../data/genrePresets';
import { GamePassItem, DevProductItem, GenreBlueprint } from '../types';
import { Plus, Trash2, Download, Copy, Check, Sparkles, Layers, ShieldAlert, Coins, RefreshCw, BarChart3, ArrowRightLeft, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GamePassTicketIcon, DevProductPotionIcon, RobuxGoldIcon, RobuxIcon, SterlingCoinIcon } from './Icons';
import { sounds } from '../utils/audio';
import { GameConceptGenerator } from './GameConceptGenerator';
import { GameLoopPlanner } from './GameLoopPlanner';

export const MonetizationBuilder: React.FC = () => {
  const [selectedGenreId, setSelectedGenreId] = useState<string>('simulator');
  const [currentBlueprint, setCurrentBlueprint] = useState<GenreBlueprint>(GENRE_PRESETS[0]);
  const [copied, setCopied] = useState<boolean>(false);

  // Catalog Tabs: passes | products | subscription | comparison
  const [activeTab, setActiveTab] = useState<'passes' | 'products' | 'subscription' | 'comparison'>('passes');

  // Comparison State
  const [comparisonSpenders, setComparisonSpenders] = useState<number>(2500);
  const [selectedComparisonModel, setSelectedComparisonModel] = useState<'all' | 'passes' | 'products' | 'hybrid'>('all');

  const DEVEX_RATE = 0.0035;
  const USD_TO_GBP = 0.78;

  const handleSelectGenre = (genreId: string) => {
    sounds.playClick();
    setSelectedGenreId(genreId);
    const found = GENRE_PRESETS.find((g) => g.id === genreId);
    if (found) {
      // deep clone so user edits don't overwrite static preset
      setCurrentBlueprint(JSON.parse(JSON.stringify(found)));
    }
  };

  const handleUpdatePassPrice = (passId: string, newPrice: number) => {
    sounds.playCoin();
    const updatedPasses = currentBlueprint.gamePasses.map((p) =>
      p.id === passId ? { ...p, robuxPrice: Math.max(1, newPrice) } : p
    );
    setCurrentBlueprint({ ...currentBlueprint, gamePasses: updatedPasses });
  };

  const handleUpdateProductPrice = (prodId: string, newPrice: number) => {
    sounds.playCoin();
    const updatedProducts = currentBlueprint.devProducts.map((p) =>
      p.id === prodId ? { ...p, robuxPrice: Math.max(1, newPrice) } : p
    );
    setCurrentBlueprint({ ...currentBlueprint, devProducts: updatedProducts });
  };

  const handleDeletePass = (passId: string) => {
    setCurrentBlueprint({
      ...currentBlueprint,
      gamePasses: currentBlueprint.gamePasses.filter((p) => p.id !== passId)
    });
  };

  const handleDeleteProduct = (prodId: string) => {
    setCurrentBlueprint({
      ...currentBlueprint,
      devProducts: currentBlueprint.devProducts.filter((p) => p.id !== prodId)
    });
  };

  // Add custom GamePass
  const handleAddPass = () => {
    const newPass: GamePassItem = {
      id: `gp-custom-${Date.now()}`,
      name: 'New Custom GamePass',
      robuxPrice: 199,
      category: 'convenience',
      description: 'Custom player perk or quality of life boost.',
      recommendedFor: 'New spenders looking for progression speed.',
      conversionImpact: 'Medium conversion impact.'
    };
    setCurrentBlueprint({
      ...currentBlueprint,
      gamePasses: [...currentBlueprint.gamePasses, newPass]
    });
  };

  // Add custom DevProduct
  const handleAddProduct = () => {
    const newProduct: DevProductItem = {
      id: `dp-custom-${Date.now()}`,
      name: 'New Developer Product',
      robuxPrice: 49,
      category: 'boost',
      description: 'Repeatable consumable reward or temporary multiplier.',
      frequency: 'high',
      whaleAppeal: 'Popular repeat purchase during live sessions.'
    };
    setCurrentBlueprint({
      ...currentBlueprint,
      devProducts: [...currentBlueprint.devProducts, newProduct]
    });
  };

  // Total Catalog Calculations
  const totalPassRobux = currentBlueprint.gamePasses.reduce((acc, p) => acc + p.robuxPrice, 0);
  const avgProductPrice = currentBlueprint.devProducts.length > 0
    ? Math.round(currentBlueprint.devProducts.reduce((acc, p) => acc + p.robuxPrice, 0) / currentBlueprint.devProducts.length)
    : 0;

  // Generate Markdown Design Document
  const generateMarkdownDoc = () => {
    let md = `# Roblox Monetization Design Document (MDD)\n`;
    md += `## Genre: ${currentBlueprint.name}\n`;
    md += `*${currentBlueprint.tagline}*\n\n`;
    md += `### Core Game Loop\n`;
    currentBlueprint.coreLoop.forEach((step, idx) => {
      md += `${idx + 1}. ${step}\n`;
    });
    md += `\n### Game Passes (Permanent Purchases)\n`;
    currentBlueprint.gamePasses.forEach((pass) => {
      const net = Math.round(pass.robuxPrice * 0.7);
      const gbp = (net * DEVEX_RATE * USD_TO_GBP).toFixed(2);
      md += `- **${pass.name}** (${pass.robuxPrice} R$ | Net: ${net} R$ | ~£${gbp})\n`;
      md += `  - Category: ${pass.category}\n`;
      md += `  - Description: ${pass.description}\n`;
      md += `  - Target Player: ${pass.recommendedFor}\n\n`;
    });
    md += `### Developer Products (Repeatable Consumables)\n`;
    currentBlueprint.devProducts.forEach((prod) => {
      const net = Math.round(prod.robuxPrice * 0.7);
      const gbp = (net * DEVEX_RATE * USD_TO_GBP).toFixed(2);
      md += `- **${prod.name}** (${prod.robuxPrice} R$ | Net: ${net} R$ | ~£${gbp})\n`;
      md += `  - Category: ${prod.category} | Purchase Frequency: ${prod.frequency}\n`;
      md += `  - Description: ${prod.description}\n`;
      md += `  - Whale Strategy: ${prod.whaleAppeal}\n\n`;
    });
    md += `### Recurring In-Experience Subscription\n`;
    md += `- **${currentBlueprint.subscription.name}** (${currentBlueprint.subscription.monthlyRobux} R$ / Month)\n`;
    currentBlueprint.subscription.perks.forEach((perk) => {
      md += `  - ${perk}\n`;
    });
    md += `\nGenerated via BloxMonetize Studio.`;
    return md;
  };

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(generateMarkdownDoc());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDoc = () => {
    const text = generateMarkdownDoc();
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentBlueprint.id}-monetization-design-document.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Game Concept Generator & Monetization Pairing Engine */}
      <GameConceptGenerator onLoadBlueprint={handleSelectGenre} />

      {/* Genre Selector Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white font-display">
              Roblox Monetization Architecture & Catalog Builder
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Design your game\'s store catalog. Customize Game Passes, Developer Products, and recurring Subscriptions with live DevEx £ revenue yields.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDoc}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied MD' : 'Copy MDD'}</span>
            </button>
            <button
              onClick={handleDownloadDoc}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MDD</span>
            </button>
          </div>
        </div>

        {/* Preset Genre Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-6 border-t border-slate-800/80">
          {GENRE_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedGenreId;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectGenre(preset.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500/60 shadow-sm'
                    : 'bg-[#0b0f17] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {preset.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Loop & Overview Banner */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5">
        <h2 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Core Game Loop & Spending Triggers for {currentBlueprint.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
          {currentBlueprint.coreLoop.map((step, idx) => (
            <div key={idx} className="bg-[#0b0f17] border border-slate-800/80 rounded-lg p-3">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
                STEP {idx + 1}
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Visual Game Loop Planner */}
      <GameLoopPlanner />

      {/* Catalog Tabs & Editor */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('passes');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'passes'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GamePassTicketIcon className="w-3.5 h-3.5" />
              <span>Game Passes ({currentBlueprint.gamePasses.length})</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('products');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DevProductPotionIcon className="w-3.5 h-3.5" />
              <span>Developer Products ({currentBlueprint.devProducts.length})</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('subscription');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'subscription'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Monthly Subscription</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('comparison');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'comparison'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Strategy Comparison</span>
            </button>
          </div>

          <div>
            {activeTab === 'passes' && (
              <button
                onClick={handleAddPass}
                className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add GamePass</span>
              </button>
            )}
            {activeTab === 'products' && (
              <button
                onClick={handleAddProduct}
                className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dev Product</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: GAME PASSES */}
        {activeTab === 'passes' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 flex items-center justify-between pb-1">
              <span>Permanent Perks & Upgrades (One-time player purchase)</span>
              <span className="font-mono text-emerald-400">Total Bundle: {totalPassRobux.toLocaleString()} R$</span>
            </div>

            <div className="space-y-2.5">
              {currentBlueprint.gamePasses.map((pass) => {
                const netRobux = Math.round(pass.robuxPrice * 0.7);
                const gbpVal = (netRobux * DEVEX_RATE * USD_TO_GBP).toFixed(2);
                return (
                  <div
                    key={pass.id}
                    className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{pass.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 uppercase">
                          {pass.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{pass.description}</p>
                      <div className="text-[11px] text-slate-500">
                        Target: <span className="text-slate-400">{pass.recommendedFor}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <input
                            type="number"
                            min="1"
                            step="25"
                            value={pass.robuxPrice}
                            onChange={(e) => handleUpdatePassPrice(pass.id, parseInt(e.target.value) || 1)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-xs font-mono font-bold text-amber-300"
                          />
                          <span className="text-xs text-amber-400 font-mono font-bold">R$</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">
                          You earn: <span className="text-emerald-400 font-bold">{netRobux} R$</span> (<span className="text-emerald-300">£{gbpVal}</span>)
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeletePass(pass.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete pass"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DEVELOPER PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 flex items-center justify-between pb-1">
              <span>Repeatable Consumables (Currency bundles, boosts, skips, revives)</span>
              <span className="font-mono text-emerald-400">Avg Product: {avgProductPrice} R$</span>
            </div>

            <div className="space-y-2.5">
              {currentBlueprint.devProducts.map((prod) => {
                const netRobux = Math.round(prod.robuxPrice * 0.7);
                const gbpVal = (netRobux * DEVEX_RATE * USD_TO_GBP).toFixed(2);
                return (
                  <div
                    key={prod.id}
                    className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{prod.name}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 uppercase">
                          {prod.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Frequency: {prod.frequency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{prod.description}</p>
                      <div className="text-[11px] text-slate-500">
                        Whale Strategy: <span className="text-slate-400">{prod.whaleAppeal}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <input
                            type="number"
                            min="1"
                            step="10"
                            value={prod.robuxPrice}
                            onChange={(e) => handleUpdateProductPrice(prod.id, parseInt(e.target.value) || 1)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-xs font-mono font-bold text-amber-300"
                          />
                          <span className="text-xs text-amber-400 font-mono font-bold">R$</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">
                          You earn: <span className="text-emerald-400 font-bold">{netRobux} R$</span> (<span className="text-emerald-300">£{gbpVal}</span>)
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: IN-EXPERIENCE SUBSCRIPTION */}
        {activeTab === 'subscription' && (
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  {currentBlueprint.subscription.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monthly recurring auto-billing (Predictable SaaS revenue model for Roblox)
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-emerald-400">
                  {currentBlueprint.subscription.monthlyRobux} <span className="text-xs text-amber-400">R$ / mo</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Net to Creator: ~£{(currentBlueprint.subscription.monthlyRobux * 0.7 * DEVEX_RATE * USD_TO_GBP).toFixed(2)}/mo per subscriber
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-2">Monthly Subscriber Perks</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentBlueprint.subscription.perks.map((perk, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-200">
              <strong>Retention Strategy:</strong> {currentBlueprint.subscription.retentionBenefit}
            </div>
          </div>
        )}

        {/* TAB 4: MONETIZATION STRATEGY COMPARISON (Game Passes vs Developer Products vs Hybrid) */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Monetization Model Comparison Engine</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display">
                    Game Passes vs. Developer Products: Earnings &amp; LTV Analysis
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Compare how one-time permanent Game Passes stack up against repeatable consumable Developer Products over a 6-month lifecycle.
                  </p>
                </div>

                {/* Spender Population Input */}
                <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs space-y-1 self-start md:self-auto min-w-[220px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Paying Spenders Pool:</span>
                    <span className="font-mono text-emerald-400 font-bold">{comparisonSpenders.toLocaleString()} users</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="20000"
                    step="250"
                    value={comparisonSpenders}
                    onChange={(e) => setComparisonSpenders(parseInt(e.target.value))}
                    className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>250 Indie</span>
                    <span>5k Medium</span>
                    <span>20k Mega-Hit</span>
                  </div>
                </div>
              </div>

              {/* Strategy Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'All 3 Models (Side-by-Side)' },
                  { id: 'passes', label: 'Game Passes Only (One-Time)' },
                  { id: 'products', label: 'Developer Products Only (Repeatable)' },
                  { id: 'hybrid', label: 'Hybrid Studio Model (Recommended)' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedComparisonModel(m.id as typeof selectedComparisonModel);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      selectedComparisonModel === m.id
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800/80'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Comparison Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* MODEL 1: GAME PASSES ONLY */}
                {(selectedComparisonModel === 'all' || selectedComparisonModel === 'passes') && (
                  <div className={`bg-[#070b12] border rounded-xl p-4 flex flex-col justify-between space-y-4 ${
                    selectedComparisonModel === 'passes' ? 'border-amber-500/60 ring-1 ring-amber-500/30 md:col-span-3' : 'border-slate-800'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <GamePassTicketIcon className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-white">Game Passes Only</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                          One-Time LTV
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        Permanent upgrades (2x Speed, VIP, Auto-Collect). High upfront launch spike, but suffers from player saturation as early buyers never purchase again.
                      </p>

                      <div className="space-y-2 mt-4 text-xs font-mono">
                        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] block">Month 1 Launch Spike</span>
                          <span className="text-sm font-bold text-white">
                            {(Math.round(comparisonSpenders * 1.4 * 350 * 0.7)).toLocaleString()} Net R$
                          </span>
                          <span className="text-emerald-400 text-xs block">
                            ~£{(Math.round(comparisonSpenders * 1.4 * 350 * 0.7) * DEVEX_RATE * USD_TO_GBP).toFixed(0)} DevEx
                          </span>
                        </div>

                        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] block">Month 6 (After Saturation)</span>
                          <span className="text-sm font-bold text-rose-400">
                            {(Math.round(comparisonSpenders * 0.25 * 350 * 0.7)).toLocaleString()} Net R$ (-82%)
                          </span>
                          <span className="text-slate-400 text-xs block">
                            ~£{(Math.round(comparisonSpenders * 0.25 * 350 * 0.7) * DEVEX_RATE * USD_TO_GBP).toFixed(0)} DevEx
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                      <div>• <strong>Whale Ceiling:</strong> Hard-capped (player cannot spend &gt; bundle cost).</div>
                      <div>• <strong>Best For:</strong> Story Obbies, Casual Tycoons, One-and-Done games.</div>
                    </div>
                  </div>
                )}

                {/* MODEL 2: DEVELOPER PRODUCTS ONLY */}
                {(selectedComparisonModel === 'all' || selectedComparisonModel === 'products') && (
                  <div className={`bg-[#070b12] border rounded-xl p-4 flex flex-col justify-between space-y-4 ${
                    selectedComparisonModel === 'products' ? 'border-sky-500/60 ring-1 ring-sky-500/30 md:col-span-3' : 'border-slate-800'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <DevProductPotionIcon className="w-4 h-4 text-sky-400" />
                          <span className="text-xs font-bold text-white">Dev Products Only</span>
                        </div>
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                          Repeatable
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        Consumables, luck potions, egg opens, ability spins, and instant currency. Lower initial basket size but unlocks uncapped whale monetization.
                      </p>

                      <div className="space-y-2 mt-4 text-xs font-mono">
                        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] block">Month 1 Baseline</span>
                          <span className="text-sm font-bold text-white">
                            {(Math.round(comparisonSpenders * 2.6 * 150 * 0.7)).toLocaleString()} Net R$
                          </span>
                          <span className="text-emerald-400 text-xs block">
                            ~£{(Math.round(comparisonSpenders * 2.6 * 150 * 0.7) * DEVEX_RATE * USD_TO_GBP).toFixed(0)} DevEx
                          </span>
                        </div>

                        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                          <span className="text-slate-400 text-[10px] block">Month 6 (Recurring Habits)</span>
                          <span className="text-sm font-bold text-sky-400">
                            {(Math.round(comparisonSpenders * 2.2 * 150 * 0.7)).toLocaleString()} Net R$ (High Retention)
                          </span>
                          <span className="text-emerald-400 text-xs block">
                            ~£{(Math.round(comparisonSpenders * 2.2 * 150 * 0.7) * DEVEX_RATE * USD_TO_GBP).toFixed(0)} DevEx
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                      <div>• <strong>Whale Ceiling:</strong> 100% Uncapped (Whales can spend 50,000+ R$).</div>
                      <div>• <strong>Best For:</strong> Simulators, Gacha RNG, PvP Combat, Battle Royale.</div>
                    </div>
                  </div>
                )}

                {/* MODEL 3: HYBRID STUDIO MODEL */}
                {(selectedComparisonModel === 'all' || selectedComparisonModel === 'hybrid') && (
                  <div className={`bg-gradient-to-b from-emerald-950/30 to-[#070b12] border rounded-xl p-4 flex flex-col justify-between space-y-4 ${
                    selectedComparisonModel === 'hybrid' ? 'border-emerald-500/80 ring-2 ring-emerald-500/40 md:col-span-3' : 'border-emerald-500/40'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-emerald-300">Hybrid Studio Model</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                          Golden Standard
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        60% Core Game Passes for immediate cash flow + 40% Developer Products (Luck Potions &amp; Spins) for recurring monthly retention.
                      </p>

                      <div className="space-y-2 mt-4 text-xs font-mono">
                        <div className="bg-slate-900/60 p-2.5 rounded border border-emerald-500/30">
                          <span className="text-slate-400 text-[10px] block">Month 1 Combined Cashout</span>
                          <span className="text-sm font-bold text-emerald-300">
                            {(Math.round(comparisonSpenders * (1.2 * 350 + 2.0 * 150) * 0.7)).toLocaleString()} Net R$
                          </span>
                          <span className="text-emerald-400 text-xs block font-bold">
                            ~£{(Math.round(comparisonSpenders * (1.2 * 350 + 2.0 * 150) * 0.7) * DEVEX_RATE * USD_TO_GBP).toFixed(0)} DevEx
                          </span>
                        </div>

                        <div className="bg-slate-900/60 p-2.5 rounded border border-emerald-500/30">
                          <span className="text-slate-400 text-[10px] block">Month 6 Sustainable Run-Rate</span>
                          <span className="text-sm font-bold text-teal-300">
                            {(Math.round(comparisonSpenders * (0.3 * 350 + 2.1 * 150) * 0.7)).toLocaleString()} Net R$
                          </span>
                          <span className="text-teal-400 text-xs block font-semibold">
                            ~£{(Math.round(comparisonSpenders * (0.3 * 350 + 2.1 * 150) * 0.7) * DEVEX_RATE * USD_TO_GBP).toFixed(0)} / month
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-200/80 space-y-1">
                      <div>• <strong>Whale Ceiling:</strong> Infinite via repeatable boosts and spins.</div>
                      <div>• <strong>Verdict:</strong> Generates 2.4x higher 12-month revenue than passes alone!</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Strategic Architecture Takeaway */}
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>The Proven Roblox Top-100 Monetization Formula</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Games like <em>Fisch</em> and <em>Blade Ball</em> achieve high ARPDAU by pricing <strong>Game Passes between 199 R$ and 799 R$</strong> (converting new spenders instantly) while providing <strong>Developer Products priced between 49 R$ and 299 R$</strong> (Luck potions, spins, crate keys) that retained hardcore players purchase every single weekend event.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
