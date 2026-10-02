import React, { useState } from 'react';
import { HIT_GAMES_LIST, HitGameBlueprint } from '../data/hitGamesData';
import { Sparkles, Terminal, Copy, Check, Clock, Layers, ArrowUpRight, Search, Zap, Code, ShieldCheck, ExternalLink, Bot, Send, Split, Cpu, ShieldAlert, FileCode2 } from 'lucide-react';
import { sounds } from '../utils/audio';

export const HitGamesGuide: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('fisch');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [activePromptSection, setActivePromptSection] = useState<'all' | 'role' | 'arch' | 'mechanic' | 'security' | 'code'>('all');

  const filteredGames = HIT_GAMES_LIST.filter((game) => {
    const matchesFilter = filterDifficulty === 'all' || game.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentGame = HIT_GAMES_LIST.find((g) => g.id === selectedGameId) || HIT_GAMES_LIST[0];

  const handleCopyPrompt = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    sounds.playSuccess();
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const getArenaUrl = (promptText: string) => {
    return `https://arena.ai/agent?prompt=${encodeURIComponent(promptText)}`;
  };

  const getDisplayedPrompt = () => {
    const sec = currentGame.promptSections;
    switch (activePromptSection) {
      case 'role':
        return `### SECTION 1: ROLE & SYSTEM OBJECTIVE\n${sec.roleAndContext}`;
      case 'arch':
        return `### SECTION 2: SYSTEM ARCHITECTURE & ROBLOX STUDIO PLACEMENT\n${sec.architecture}`;
      case 'mechanic':
        return `### SECTION 3: CORE GAMEPLAY MECHANICS & MATHEMATICAL RULES\n${sec.coreMechanic}`;
      case 'security':
        return `### SECTION 4: NETWORKING & SERVER-AUTHORITATIVE ANTI-EXPLOIT SECURITY\n${sec.securityAndNetworking}`;
      case 'code':
        return `### SECTION 5: COMPLETE LUAU CODE IMPLEMENTATION CONTRACT\n${sec.codeContract}`;
      case 'all':
      default:
        return currentGame.aiPrompt;
    }
  };

  const sectionTabs = [
    { id: 'all', label: 'Complete 5-Section Architecture', icon: Split, desc: 'Recommended for Arena.ai/agent' },
    { id: 'role', label: '1. Role & Objective', icon: Cpu, desc: 'Context & persona' },
    { id: 'arch', label: '2. Studio Hierarchy', icon: Layers, desc: 'Services & remotes' },
    { id: 'mechanic', label: '3. Mechanics & Math', icon: Zap, desc: 'Formulas & physics' },
    { id: 'security', label: '4. Anti-Exploit Security', icon: ShieldAlert, desc: 'Server sanity checks' },
    { id: 'code', label: '5. Luau Code Contract', icon: FileCode2, desc: 'Strict implementation' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>15 Top-Tier Roblox Hit Game Deconstructions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
            How to Make Games Like Fisch, Blade Ball & Steal An Egg for Free
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Every hit game has a specific technical core loop that can be built completely free using Roblox Studio, Blender, and open-source Luau libraries. Select a game below to see its complete blueprint, step-by-step build, and high-potency 5-section AI generation prompt.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search games (e.g. Fisch, Blade Ball, Steal, Garden)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0b0f17] p-1 border border-slate-800 rounded-lg text-xs">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  sounds.playClick();
                  setFilterDifficulty(diff);
                }}
                className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                  filterDifficulty === diff
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Game Horizontal Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mt-4">
          {filteredGames.map((game) => {
            const isSelected = game.id === selectedGameId;
            return (
              <button
                key={game.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedGameId(game.id);
                }}
                className={`px-3.5 py-2 rounded-lg border text-left whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500/60 text-emerald-300 shadow-sm'
                    : 'bg-[#0b0f17] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{game.title}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{game.difficulty} · {game.timeToBuild}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Game Detailed Blueprint */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Game Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>{currentGame.genre}</span>
              <span>·</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Solo Build Time: {currentGame.timeToBuild}
              </span>
              <span>·</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                currentGame.difficulty === 'Beginner' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' :
                currentGame.difficulty === 'Intermediate' ? 'bg-sky-950/60 text-sky-300 border border-sky-800/40' :
                'bg-purple-950/60 text-purple-300 border border-purple-800/40'
              }`}>
                {currentGame.difficulty} Friendly
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              {currentGame.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              <strong className="text-emerald-400 font-semibold">Why It Blew Up: </strong>
              {currentGame.popularityHook}
            </p>
          </div>

          {/* Action buttons: Copy Prompt + Send to Arena.ai/agent */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <button
              onClick={() => handleCopyPrompt(currentGame.aiPrompt, currentGame.id)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Copy the full 5-section prompt to clipboard"
            >
              {copiedPromptId === currentGame.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPromptId === currentGame.id ? 'Copied 5-Section Prompt!' : 'Copy 5-Section Prompt'}</span>
            </button>

            <a
              href={getArenaUrl(currentGame.aiPrompt)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCopyPrompt(currentGame.aiPrompt, currentGame.id)}
              className="px-3.5 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 hover:text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm group"
              title="Opens Arena.ai/agent with prompt pre-loaded and copied to clipboard"
            >
              <Bot className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Send 5-Section Prompt to Arena.ai/agent</span>
              <ExternalLink className="w-3 h-3 text-sky-400/80" />
            </a>
          </div>
        </div>

        {/* 2-Column: Core Mechanics & Free Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Core Mechanical Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentGame.coreMechanic}
            </p>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              100% Free Tools & Open-Source Libraries
            </h3>
            <ul className="text-xs text-slate-400 space-y-1">
              {currentGame.freeTechStack.map((tech, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-mono text-[11px]">•</span>
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step-by-Step 6-Point Build Guide */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Step-by-Step Solo Development Plan (Zero Budget)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {currentGame.stepByStepBuild.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#0b0f17] border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 flex flex-col justify-between"
              >
                <div className="leading-relaxed text-[11px]">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Section AI Prompt Engineering Studio Container */}
        <div className="bg-[#06090f] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                  <Split className="w-4 h-4" />
                  Structured 5-Section AI Luau Prompt Architecture
                </span>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                  Arena.ai/agent Optimized
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Splitting prompts into 5 distinct engineering contracts prevents hallucinations and produces complete, bug-free client-server code.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyPrompt(getDisplayedPrompt(), `${currentGame.id}-${activePromptSection}`)}
                className="text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg"
              >
                {copiedPromptId === `${currentGame.id}-${activePromptSection}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromptId === `${currentGame.id}-${activePromptSection}` ? 'Copied View!' : 'Copy Current View'}</span>
              </button>

              <a
                href={getArenaUrl(getDisplayedPrompt())}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCopyPrompt(getDisplayedPrompt(), `${currentGame.id}-${activePromptSection}`)}
                className="text-sky-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer bg-sky-950/60 border border-sky-700/80 hover:bg-sky-900/60 px-3 py-1.5 rounded-lg font-medium"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Send to Arena.ai/agent</span>
                <ExternalLink className="w-3 h-3 text-sky-400/80" />
              </a>
            </div>
          </div>

          {/* 5-Section Navigation Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {sectionTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activePromptSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActivePromptSection(tab.id as typeof activePromptSection);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 border-emerald-500/60 text-white shadow-sm'
                      : 'bg-[#0b0f17] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">{tab.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Prompt Code Container */}
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#090d16]">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#0d131f] border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span>{activePromptSection === 'all' ? 'All 5 Sections Combined' : sectionTabs.find(t => t.id === activePromptSection)?.label}</span>
              <span className="text-emerald-400 font-semibold">Strict Luau Contract</span>
            </div>
            <pre className="p-4 text-xs font-mono leading-relaxed text-slate-200 overflow-x-auto whitespace-pre-wrap select-all max-h-[460px]">
              <code>{getDisplayedPrompt()}</code>
            </pre>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>
              💡 <strong>Pro Tip:</strong> When submitting to <strong>Arena.ai/agent</strong>, send the <strong>Complete 5-Section Architecture</strong>. AI models use the strict architectural boundaries to generate bug-free code without placeholders.
            </span>
            <button
              onClick={() => handleCopyPrompt(currentGame.aiPrompt, currentGame.id)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer shrink-0 ml-2"
            >
              Copy Full 5 Sections
            </button>
          </div>
        </div>

        {/* Monetization Advice */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-emerald-300">How to Monetize This Specific Game for DevEx Cashouts</h3>
            <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
              {currentGame.monetizationAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
