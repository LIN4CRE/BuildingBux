import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, TrendingUp, Users, Sparkles, Filter, ChevronRight, BarChart2 } from 'lucide-react';
import { sounds } from '../utils/audio';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollItem {
  id: string;
  title: string;
  genre: 'Simulators & RNG' | 'PvP & Action' | 'Tycoons & Obbies' | 'Economy Architecture';
  question: string;
  options: PollOption[];
  totalVotes: number;
  studioInsight: string;
}

const INITIAL_POLLS: PollItem[] = [
  {
    id: 'poll-luck-potions',
    title: 'Luck Boosters: Permanent Pass vs. Consumable Potions',
    genre: 'Simulators & RNG',
    question: 'In Simulators and RNG games, which monetization model generates better player goodwill while maximizing DevEx revenue?',
    options: [
      { id: 'opt-pass', text: 'Permanent 2x Luck Game Pass (399–799 R$)', votes: 842 },
      { id: 'opt-potions', text: 'Repeatable 15-Min Luck Potions / Dev Products (49–149 R$)', votes: 1240 },
      { id: 'opt-hybrid', text: 'Hybrid: 1.5x Pass + Stacking 2x Temporary Potions', votes: 2180 }
    ],
    totalVotes: 4262,
    studioInsight: 'Top games like Fisch and Pet Simulator use the Hybrid approach: casual players buy the permanent baseline pass once, while endgame whales purchase potion bundles every weekend during 2x events.'
  },
  {
    id: 'poll-pvp-cosmetics',
    title: 'PvP Weapon Skins: Direct Purchase vs. Crate Spins',
    genre: 'PvP & Action',
    question: 'How should top-tier weapon visual effects (slash particles, kill sounds) be monetized in competitive games like Blade Ball?',
    options: [
      { id: 'opt-crates', text: 'Seasonal Crate Rolls / Dev Products (Uncapped Whale LTV)', votes: 1650 },
      { id: 'opt-direct', text: 'Direct Purchase Game Passes (Transparent Pricing)', votes: 1420 },
      { id: 'opt-battlepass', text: 'Seasonal Battle Pass (Tiers unlocked with playtime + Robux)', votes: 2310 }
    ],
    totalVotes: 5380,
    studioInsight: 'Battle Passes provide the highest Day 30 retention, while crate spins generate massive revenue spikes during Friday-Sunday weekend tournaments.'
  },
  {
    id: 'poll-tycoon-vip-price',
    title: 'Tycoon & Obby VIP Pricing Sweet Spot',
    genre: 'Tycoons & Obbies',
    question: 'What is the optimal price point for a VIP Game Pass (2x Cash + Golden Name Tag + Exclusive Area)?',
    options: [
      { id: 'opt-budget', text: 'Under 149 R$ (Maximizes conversion volume for young players)', votes: 1120 },
      { id: 'opt-mid', text: '199 R$ to 349 R$ (Golden sweet spot: balances volume with margin)', votes: 2840 },
      { id: 'opt-premium', text: '499 R$ to 999 R$ (High margin, but lowers conversion below 1.5%)', votes: 610 }
    ],
    totalVotes: 4570,
    studioInsight: 'Pricing between 199 R$ and 349 R$ allows players with basic 400 R$ monthly gift cards to buy without hesitating, maximizing total gross volume.'
  },
  {
    id: 'poll-whale-sinks',
    title: 'Monetization Ceiling: Pass Limit vs. Uncapped Sinks',
    genre: 'Economy Architecture',
    question: 'Should developers cap in-game spending at a bundle of Game Passes or include infinite Dev Product currency sinks?',
    options: [
      { id: 'opt-uncapped', text: 'Uncapped Sinks (Whales can spend 50,000+ R$ on rolls/boosts)', votes: 2430 },
      { id: 'opt-capped', text: 'Strict Cap (Total store cost under 5,000 R$ for fairness)', votes: 890 },
      { id: 'opt-cosmetic-only', text: 'Uncapped for Cosmetics, Strictly Capped for Gameplay Progression', votes: 2190 }
    ],
    totalVotes: 5510,
    studioInsight: 'The top 0.1% of Roblox games generate over 65% of their total DevEx cashout from the top 2% of players (whales). Without repeatable Dev Products, your studio revenue hits an artificial ceiling.'
  }
];

export const CommunityPolls: React.FC = () => {
  const [polls, setPolls] = useState<PollItem[]>(INITIAL_POLLS);
  const [userVotes, setUserVotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('blox_community_polls_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  useEffect(() => {
    try {
      localStorage.setItem('blox_community_polls_votes', JSON.stringify(userVotes));
    } catch (e) {
      console.warn(e);
    }
  }, [userVotes]);

  const handleVote = (pollId: string, optionId: string) => {
    if (userVotes[pollId]) return; // already voted

    sounds.playCoin();
    setUserVotes((prev) => ({ ...prev, [pollId]: optionId }));

    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) return poll;
        const updatedOptions = poll.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1
        };
      })
    );
  };

  const genres = ['All', 'Simulators & RNG', 'PvP & Action', 'Tycoons & Obbies', 'Economy Architecture'];

  const filteredPolls = polls.filter(
    (p) => selectedGenre === 'All' || p.genre === selectedGenre
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Real-Time Developer Sentiment</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              Community Insight Polls &amp; Monetization Trends
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Vote on current community sentiments regarding Game Passes vs. Developer Products across different Roblox genres to guide your game's commercial design.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3 shrink-0">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Community Votes Cast</span>
              <span className="text-sm font-bold text-white font-mono">
                {polls.reduce((sum, p) => sum + p.totalVotes, 0).toLocaleString()} Votes
              </span>
            </div>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 text-xs">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => {
                sounds.playClick();
                setSelectedGenre(g);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedGenre === g
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800/80'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Polls Grid */}
      <div className="space-y-6">
        {filteredPolls.map((poll) => {
          const hasVoted = Boolean(userVotes[poll.id]);
          const selectedOptionId = userVotes[poll.id];

          return (
            <div
              key={poll.id}
              className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {poll.genre}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-white font-display pt-1">
                    {poll.title}
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-slate-400">
                    {poll.totalVotes.toLocaleString()} votes
                  </span>
                  {hasVoted && (
                    <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                      ✓ Vote Recorded
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {poll.question}
              </p>

              {/* Options & Interactive Vote Bars */}
              <div className="space-y-2.5 pt-1">
                {poll.options.map((opt) => {
                  const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                  const isSelected = selectedOptionId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={hasVoted}
                      onClick={() => handleVote(poll.id, opt.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500/80 bg-emerald-950/20 ring-1 ring-emerald-500/40'
                          : hasVoted
                          ? 'border-slate-800 bg-[#0b0f17] opacity-90'
                          : 'border-slate-800 bg-[#0b0f17] hover:border-emerald-500/40 hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Vote Percentage Background Fill */}
                      {hasVoted && (
                        <div
                          className={`absolute top-0 bottom-0 left-0 transition-all duration-700 pointer-events-none ${
                            isSelected ? 'bg-emerald-500/20' : 'bg-slate-800/40'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold'
                              : 'border-slate-700 text-slate-500 group-hover:border-slate-500'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                          <span className={`font-medium ${isSelected ? 'text-emerald-300 font-bold' : 'text-slate-200'}`}>
                            {opt.text}
                          </span>
                        </div>

                        {hasVoted && (
                          <div className="text-right shrink-0 font-mono">
                            <span className="text-xs font-bold text-white">{percent}%</span>
                            <span className="text-[10px] text-slate-500 block">({opt.votes.toLocaleString()})</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Studio Verdict & Insight */}
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Developer Commercial Takeaway</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {poll.studioInsight}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
