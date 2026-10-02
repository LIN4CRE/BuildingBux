import React, { useState } from 'react';
import { GENRE_PRESETS } from '../data/genrePresets';
import { GamePassItem, DevProductItem, GenreBlueprint } from '../types';
import { Plus, Trash2, Download, Copy, Check, Sparkles, Layers, ShieldAlert, Coins, RefreshCw } from 'lucide-react';
import { GamePassTicketIcon, DevProductPotionIcon, RobuxGoldIcon, RobuxIcon, SterlingCoinIcon } from './Icons';
import { sounds } from '../utils/audio';

export const MonetizationBuilder: React.FC = () => {
  const [selectedGenreId, setSelectedGenreId] = useState<string>('simulator');
  const [currentBlueprint, setCurrentBlueprint] = useState<GenreBlueprint>(GENRE_PRESETS[0]);
  const [copied, setCopied] = useState<boolean>(false);

  // New item modal/states
  const [activeTab, setActiveTab] = useState<'passes' | 'products' | 'subscription'>('passes');

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
      </div>
    </div>
  );
};
