import React, { useState } from 'react';
import { HIT_GAMES_LIST, HitGameBlueprint } from '../data/hitGamesData';
import { Sparkles, Terminal, Copy, Check, Clock, Layers, ArrowUpRight, Search, Zap, Code, ShieldCheck, ExternalLink, Bot, Send } from 'lucide-react';

export const HitGamesGuide: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string>('fisch');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const filteredGames = HIT_GAMES_LIST.filter((game) => {
    const matchesFilter = filterDifficulty === 'all' || game.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentGame = HIT_GAMES_LIST.find((g) => g.id === selectedGameId) || HIT_GAMES_LIST[0];

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const getArenaUrl = (prompt: string) => {
    return `https://arena.ai/agent?prompt=${encodeURIComponent(prompt)}`;
  };

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
            Every hit game has a specific technical core loop that can be built completely free using Roblox Studio, Blender, and open-source Luau libraries. Select a game below to see its complete blueprint, step-by-step build, and AI generation prompt.
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
                onClick={() => setFilterDifficulty(diff)}
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
                onClick={() => setSelectedGameId(game.id)}
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
            >
              {copiedPromptId === currentGame.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPromptId === currentGame.id ? 'Copied!' : 'Copy AI Prompt'}</span>
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
              <span>Send prompt to Arena.ai/agent</span>
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

        {/* AI Prompt Box (Copy-Pasteable into AI coding agents) */}
        <div className="bg-[#06090f] border border-slate-800 rounded-lg p-4 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              Ready-to-Use AI Luau Script Prompt (Copy into Gemini/Claude/ChatGPT or Arena.ai)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyPrompt(currentGame.aiPrompt, currentGame.id)}
                className="text-slate-400 hover:text-white transition-colors text-[11px] flex items-center gap-1 cursor-pointer bg-slate-900 border border-slate-700/80 px-2 py-1 rounded"
              >
                {copiedPromptId === currentGame.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPromptId === currentGame.id ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href={getArenaUrl(currentGame.aiPrompt)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCopyPrompt(currentGame.aiPrompt, currentGame.id)}
                className="text-sky-300 hover:text-white transition-colors text-[11px] flex items-center gap-1 cursor-pointer bg-sky-950/40 border border-sky-800/60 hover:bg-sky-900/50 px-2.5 py-1 rounded font-medium"
              >
                <Send className="w-3 h-3 text-sky-400" />
                <span>Send to Arena.ai/agent</span>
                <ExternalLink className="w-2.5 h-2.5 text-sky-400/80" />
              </a>
            </div>
          </div>

          <div className="p-3 bg-[#0b0f17] border border-slate-800/80 rounded text-xs text-slate-300 font-mono leading-relaxed select-all">
            "{currentGame.aiPrompt}"
          </div>
          <p className="text-[11px] text-slate-500">
            Click <strong>"Send prompt to Arena.ai/agent"</strong> to automatically copy this prompt to your clipboard and launch the agent workspace ready to run.
          </p>
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
