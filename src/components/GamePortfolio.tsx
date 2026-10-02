import React, { useState, useEffect } from 'react';
import { Gamepad2, Plus, ExternalLink, Trash2, Edit3, Sparkles, TrendingUp, Calendar, Users, DollarSign, Layers, ShieldCheck, Check, X, Image as ImageIcon } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon, DevExVaultIcon, RobuxGoldIcon } from './Icons';
import { sounds } from '../utils/audio';

export interface PortfolioGame {
  id: string;
  title: string;
  genre: string;
  robloxUrl: string;
  imageUrl?: string;
  releaseDate: string;
  peakCcu: number;
  lifetimeRobux: number;
  monetizationModel: string;
  description: string;
  status: 'Live & Growing' | 'Mature' | 'In Development';
}

const DEFAULT_PORTFOLIO: PortfolioGame[] = [
  {
    id: 'game-1',
    title: 'Ocean Depths: Deep Sea Fishing',
    genre: 'Simulator / Exploration',
    robloxUrl: 'https://create.roblox.com',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    releaseDate: '2024-03-15',
    peakCcu: 3450,
    lifetimeRobux: 4850000,
    monetizationModel: 'Hybrid 60/40 Split: Permanent Speedboat & Fishing Rod Passes + Consumable Whale Bait Potions (Dev Products).',
    description: 'Immersive low-poly deep-water fishing experience with dynamic weather, rare mythical fish, and deep-sea diving bells.',
    status: 'Live & Growing'
  },
  {
    id: 'game-2',
    title: 'Deflection Arena: Blade Champions',
    genre: 'PvP Action / Fast Combat',
    robloxUrl: 'https://create.roblox.com',
    imageUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    releaseDate: '2024-08-20',
    peakCcu: 6800,
    lifetimeRobux: 8200000,
    monetizationModel: 'Consumable Weapon Crates + Battle Pass: Repeatable cosmetic sword skin pulls and death sound effects.',
    description: 'High-octane multiplayer combat arena where players time weapon swings to deflect homing energy balls.',
    status: 'Live & Growing'
  },
  {
    id: 'game-3',
    title: 'Super Cyber Obby Tycoon',
    genre: 'Tycoon / Casual Obby',
    robloxUrl: 'https://create.roblox.com',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    releaseDate: '2023-11-10',
    peakCcu: 650,
    lifetimeRobux: 850000,
    monetizationModel: 'One-Time VIP Passes: 2x Cash, Auto-Collector, and Rainbow Neon Trail for new spenders.',
    description: 'Relaxing 100-stage cyberpunk tower tycoon where players construct neon skyscrapers while dodging lasers.',
    status: 'Mature'
  }
];

export const GamePortfolio: React.FC = () => {
  const [games, setGames] = useState<PortfolioGame[]>(() => {
    try {
      const saved = localStorage.getItem('blox_game_portfolio');
      return saved ? JSON.parse(saved) : DEFAULT_PORTFOLIO;
    } catch {
      return DEFAULT_PORTFOLIO;
    }
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [genre, setGenre] = useState<string>('Simulator');
  const [robloxUrl, setRobloxUrl] = useState<string>('https://www.roblox.com/games/');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [releaseDate, setReleaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [peakCcu, setPeakCcu] = useState<number>(250);
  const [lifetimeRobux, setLifetimeRobux] = useState<number>(100000);
  const [monetizationModel, setMonetizationModel] = useState<string>('Hybrid Passes + Dev Products');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<PortfolioGame['status']>('Live & Growing');

  const DEVEX_RATE = 0.0035;
  const USD_TO_GBP = 0.78;

  useEffect(() => {
    try {
      localStorage.setItem('blox_game_portfolio', JSON.stringify(games));
    } catch (e) {
      console.warn(e);
    }
  }, [games]);

  const handleOpenAdd = () => {
    sounds.playClick();
    setEditingId(null);
    setTitle('');
    setGenre('Simulator / Tycoon');
    setRobloxUrl('https://www.roblox.com/games/');
    setImageUrl('');
    setReleaseDate(new Date().toISOString().split('T')[0]);
    setPeakCcu(250);
    setLifetimeRobux(100000);
    setMonetizationModel('Hybrid 60% Permanent Game Passes + 40% Consumable Potions');
    setDescription('');
    setStatus('Live & Growing');
    setShowAddModal(true);
  };

  const handleOpenEdit = (game: PortfolioGame) => {
    sounds.playClick();
    setEditingId(game.id);
    setTitle(game.title);
    setGenre(game.genre);
    setRobloxUrl(game.robloxUrl);
    setImageUrl(game.imageUrl || '');
    setReleaseDate(game.releaseDate);
    setPeakCcu(game.peakCcu);
    setLifetimeRobux(game.lifetimeRobux);
    setMonetizationModel(game.monetizationModel);
    setDescription(game.description);
    setStatus(game.status);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    sounds.playClick();
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playSuccess();

    if (editingId) {
      setGames((prev) =>
        prev.map((g) =>
          g.id === editingId
            ? {
                ...g,
                title,
                genre,
                robloxUrl,
                imageUrl: imageUrl.trim() || undefined,
                releaseDate,
                peakCcu,
                lifetimeRobux,
                monetizationModel,
                description,
                status
              }
            : g
        )
      );
    } else {
      const newGame: PortfolioGame = {
        id: `game-${Date.now()}`,
        title,
        genre,
        robloxUrl,
        imageUrl: imageUrl.trim() || undefined,
        releaseDate,
        peakCcu,
        lifetimeRobux,
        monetizationModel,
        description,
        status
      };
      setGames((prev) => [newGame, ...prev]);
    }

    setShowAddModal(false);
  };

  // Portfolio Totals
  const totalLifetimeRobux = games.reduce((sum, g) => sum + g.lifetimeRobux, 0);
  const totalLifetimeGbp = totalLifetimeRobux * DEVEX_RATE * USD_TO_GBP;
  const combinedPeakCcu = games.reduce((max, g) => Math.max(max, g.peakCcu), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Developer Track Record &amp; Studio Showcase</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              Roblox Studio Game Portfolio
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Showcase your released Roblox experiences with cover art, direct play links, peak concurrent players, and the exact monetization architecture that drove DevEx cashouts.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>

        {/* Portfolio Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[10px] font-mono uppercase block">Experiences Released</span>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {games.length} Games
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[10px] font-mono uppercase block">Combined Peak CCU</span>
            <div className="text-lg font-bold font-mono text-sky-400 mt-0.5">
              {combinedPeakCcu.toLocaleString()} CCU
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 text-[10px] font-mono uppercase block">Total Lifetime Robux</span>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {totalLifetimeRobux.toLocaleString()} R$
            </div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3">
            <span className="text-emerald-300 text-[10px] font-mono uppercase block">Total DevEx Generated (£)</span>
            <div className="text-lg font-black font-mono text-emerald-300 mt-0.5">
              £{totalLifetimeGbp.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {games.map((game) => {
          const gameGbp = game.lifetimeRobux * DEVEX_RATE * USD_TO_GBP;

          return (
            <div
              key={game.id}
              className="bg-[#101726] border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Cover Image or Fallback Header */}
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-[#101726] text-slate-600">
                      <Gamepad2 className="w-10 h-10 mb-1 text-slate-500" />
                      <span className="text-xs font-mono text-slate-400">Roblox Experience</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md border border-slate-700 text-emerald-300">
                      {game.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(game)}
                      className="p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit game details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(game.id)}
                      className="p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete experience"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      {game.genre}
                    </span>
                    <h2 className="text-base font-bold text-white font-display mt-0.5">
                      {game.title}
                    </h2>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {game.description}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                    <div className="bg-[#0b0f17] p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Peak CCU</span>
                      <span className="font-bold text-sky-400">{game.peakCcu.toLocaleString()}</span>
                    </div>

                    <div className="bg-[#0b0f17] p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Lifetime Net R$</span>
                      <span className="font-bold text-emerald-400">{game.lifetimeRobux.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Monetization Model Insight */}
                  <div className="p-3 rounded-lg bg-[#0b0f17] border border-slate-800/80 text-[11px] space-y-1">
                    <div className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Monetization Model</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {game.monetizationModel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 border-t border-slate-800/80 bg-[#090d16] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">DevEx Payout Value</span>
                  <span className="text-xs font-bold font-mono text-emerald-300">
                    £{gameGbp.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <a
                  href={game.robloxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>Roblox Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Experience Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#101726] border border-slate-700/80 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0f17]">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  {editingId ? 'Edit Experience Details' : 'Add Experience to Portfolio'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Game Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fisch Island Tycoon"
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Genre / Style</label>
                  <input
                    type="text"
                    required
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. Simulator / RPG"
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PortfolioGame['status'])}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Live & Growing">Live &amp; Growing</option>
                    <option value="Mature">Mature</option>
                    <option value="In Development">In Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Roblox Experience URL</label>
                <input
                  type="url"
                  required
                  value={robloxUrl}
                  onChange={(e) => setRobloxUrl(e.target.value)}
                  placeholder="https://www.roblox.com/games/..."
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Cover Screenshot Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Peak CCU (Players)</label>
                  <input
                    type="number"
                    min="0"
                    value={peakCcu}
                    onChange={(e) => setPeakCcu(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Lifetime Earned Robux</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={lifetimeRobux}
                    onChange={(e) => setLifetimeRobux(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Monetization Model Architecture</label>
                <input
                  type="text"
                  required
                  value={monetizationModel}
                  onChange={(e) => setMonetizationModel(e.target.value)}
                  placeholder="e.g. Hybrid Passes (2x Speed, Auto-Collect) + Repeatable Luck Potions"
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Brief Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What makes this game unique and engaging to players?"
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Add Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
