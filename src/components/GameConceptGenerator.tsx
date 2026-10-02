import React, { useState } from 'react';
import { TRENDING_GAME_CONCEPTS, GameConcept } from '../data/gameConceptsData';
import { Sparkles, Dices, Layers, ArrowRight, ShieldCheck, Zap, Coins, TrendingUp, Check, Lightbulb, Clock, Users } from 'lucide-react';
import { RobuxIcon, GamePassTicketIcon, DevProductPotionIcon, SterlingCoinIcon } from './Icons';
import { sounds } from '../utils/audio';

interface GameConceptGeneratorProps {
  onLoadBlueprint?: (blueprintId: string) => void;
}

export const GameConceptGenerator: React.FC<GameConceptGeneratorProps> = ({ onLoadBlueprint }) => {
  const [selectedConcept, setSelectedConcept] = useState<GameConcept>(TRENDING_GAME_CONCEPTS[0]);
  const [filterComplexity, setFilterComplexity] = useState<string>('All');
  const [isRolling, setIsRolling] = useState<boolean>(false);

  const handleRollRandom = () => {
    sounds.playCoin();
    setIsRolling(true);
    setTimeout(() => {
      const otherConcepts = TRENDING_GAME_CONCEPTS.filter((c) => c.id !== selectedConcept.id);
      const randomIndex = Math.floor(Math.random() * otherConcepts.length);
      setSelectedConcept(otherConcepts[randomIndex]);
      setIsRolling(false);
      sounds.playSuccess();
    }, 250);
  };

  const handleSelectConcept = (concept: GameConcept) => {
    sounds.playClick();
    setSelectedConcept(concept);
  };

  const handleLoadBlueprint = () => {
    sounds.playSuccess();
    if (onLoadBlueprint) {
      onLoadBlueprint(selectedConcept.blueprintId);
    }
  };

  const complexities = ['All', 'Beginner (1-2 wks)', 'Intermediate (2-4 wks)', 'Advanced (1-2 mos)'];

  const filteredConcepts = TRENDING_GAME_CONCEPTS.filter((c) => {
    if (filterComplexity === 'All') return true;
    return c.devComplexity === filterComplexity;
  });

  return (
    <div className="bg-[#101726] border border-emerald-500/30 rounded-xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Studio Idea &amp; Monetization Matrix</span>
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Trending Game Concept &amp; Monetization Pairing Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover proven Roblox game genres paired with their optimal monetization mechanics, pricing anchors, and conversion benchmarks.
          </p>
        </div>

        {/* Random Concept Roller Button */}
        <button
          type="button"
          onClick={handleRollRandom}
          disabled={isRolling}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-sm shadow-emerald-500/20 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
          <span>Roll Trending Concept</span>
        </button>
      </div>

      {/* Complexity Filter & Concept Carousel Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Filter by Scope:</span>
          <div className="flex items-center gap-1 overflow-x-auto">
            {complexities.map((comp) => (
              <button
                key={comp}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setFilterComplexity(comp);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  filterComplexity === comp
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* Concept Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {filteredConcepts.map((concept) => {
            const isSelected = concept.id === selectedConcept.id;
            return (
              <button
                key={concept.id}
                type="button"
                onClick={() => handleSelectConcept(concept)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-[#0b0f17] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-mono text-emerald-400 line-clamp-1">
                  {concept.genre}
                </span>
                <span className={`text-xs font-bold mt-1 line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {concept.conceptTitle}
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-2 block">
                  {concept.devComplexity.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Concept Deep-Dive Card */}
      <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
        {/* Title, Badges & Load Blueprint Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/60">
                {selectedConcept.pairingHeadline}
              </span>
              <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                {selectedConcept.devComplexity}
              </span>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                {selectedConcept.primaryRevenueDriver}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-display pt-1">
              {selectedConcept.conceptTitle}
            </h3>
            <p className="text-xs text-slate-400">
              Target Audience: <strong className="text-slate-300">{selectedConcept.targetAudience}</strong>
            </p>
          </div>

          {/* Load Blueprint button */}
          <button
            type="button"
            onClick={handleLoadBlueprint}
            className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-auto"
            title="Load this monetization architecture directly into the catalog editor below"
          >
            <span>Load Blueprint in Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Core Hook & Why It Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#101726] border border-slate-800 rounded-lg p-4 space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Core Gameplay Hook
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {selectedConcept.coreHook}
            </p>
          </div>

          <div className="bg-[#101726] border border-slate-800 rounded-lg p-4 space-y-1.5">
            <span className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
              Why This Pairing Works on Roblox
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {selectedConcept.whyItWorks}
            </p>
          </div>
        </div>

        {/* Recommended Monetization Architecture Breakdown */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800/80">
            <span className="font-bold text-white uppercase font-mono tracking-wider text-[11px]">
              Optimal Catalog Monetization Pairings
            </span>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px]">
              <span>Conversion: <strong className="text-emerald-400">{selectedConcept.monetizationArchitecture.conversionExpectation}</strong></span>
              <span>ARPDAU: <strong className="text-teal-300">{selectedConcept.monetizationArchitecture.arpdauBenchmark}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Recommended Game Passes */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <GamePassTicketIcon className="w-3.5 h-3.5" />
                Permanent Game Passes
              </span>
              <div className="space-y-2">
                {selectedConcept.monetizationArchitecture.recommendedPasses.map((pass, idx) => (
                  <div key={idx} className="bg-[#101726] border border-slate-800/80 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{pass.name}</span>
                      <span className="font-mono text-emerald-400 font-bold text-[11px]">{pass.price} R$</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {pass.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Developer Products & Subscriptions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <DevProductPotionIcon className="w-3.5 h-3.5" />
                Repeatable Dev Products &amp; Perks
              </span>
              <div className="space-y-2">
                {selectedConcept.monetizationArchitecture.recommendedProducts.map((prod, idx) => (
                  <div key={idx} className="bg-[#101726] border border-slate-800/80 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{prod.name}</span>
                      <span className="font-mono text-sky-400 font-bold text-[11px]">{prod.price} R$</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {prod.reason}
                    </p>
                  </div>
                ))}

                {selectedConcept.monetizationArchitecture.recommendedSubscription && (
                  <div className="bg-[#101726] border border-purple-500/30 rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-300 text-xs">
                        {selectedConcept.monetizationArchitecture.recommendedSubscription.name}
                      </span>
                      <span className="font-mono text-purple-300 font-bold text-[11px]">
                        {selectedConcept.monetizationArchitecture.recommendedSubscription.price} R$ / mo
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {selectedConcept.monetizationArchitecture.recommendedSubscription.reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Starter Advice Banner */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3.5 flex items-start gap-2.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-300 text-xs">Developer Action Rule:</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {selectedConcept.starterAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
