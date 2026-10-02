import React, { useState, useEffect } from 'react';
import { FREE_CREATOR_RESOURCES } from '../data/freeResourcesData';
import { ExternalLink, Layers, Sparkles, Bookmark, BookmarkCheck, Search, Trash2, Star, Check } from 'lucide-react';
import { sounds } from '../utils/audio';
import { AssetBudgetingTool } from './AssetBudgetingTool';

const DEFAULT_BOOKMARKS = [
  'Kenney.nl (CC0 Game Assets)',
  'Quaternius 3D Models',
  'Photopea (Free Photoshop Alternative)',
  'Roblox Open-Source APM Music Library'
];

export const FreeToolkit: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('blox_toolkit_bookmarks');
      return saved ? JSON.parse(saved) : DEFAULT_BOOKMARKS;
    } catch {
      return DEFAULT_BOOKMARKS;
    }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');

  useEffect(() => {
    try {
      localStorage.setItem('blox_toolkit_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn(e);
    }
  }, [bookmarks]);

  const toggleBookmark = (itemName: string) => {
    sounds.playCoin();
    setBookmarks((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]
    );
  };

  // Flatten all items for bookmark quick lookup
  const allItems = FREE_CREATOR_RESOURCES.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryName: cat.category }))
  );

  const bookmarkedItems = allItems.filter((item) => bookmarks.includes(item.name));

  const types = ['All', 'Software', 'Asset Pack', 'Audio', 'Library', 'Documentation'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Cost Development Pipeline</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              Free Creator Toolkit &amp; Resource Directory
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Every software, 3D asset pack, audio library, and open-source Luau module you need to build front-page quality Roblox games without spending any money.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3 shrink-0">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Saved Bookmarks</span>
              <span className="text-sm font-bold text-white font-mono">{bookmarks.length} Resources</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search free tools (e.g. Kenney, Blender, audio, Quaternius)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0b0f17] p-1 border border-slate-800 rounded-lg text-xs overflow-x-auto">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTypeFilter(type);
                }}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTypeFilter === type
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* -------------------- RESOURCE BOOKMARKS QUICK ACCESS PANEL -------------------- */}
      {bookmarkedItems.length > 0 && (
        <div className="bg-[#101726] border border-amber-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h2 className="text-sm font-bold text-white font-display">
                Your Saved Resource Bookmarks ({bookmarkedItems.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Quick Launch Dashboard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {bookmarkedItems.map((item) => (
              <div
                key={item.name}
                className="bg-[#0b0f17] border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {item.name}
                    </span>
                    <button
                      onClick={() => toggleBookmark(item.name)}
                      className="text-amber-400 hover:text-rose-400 p-1 transition-colors cursor-pointer shrink-0"
                      title="Remove bookmark"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    {item.type}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roblox Mobile & Low-End Device Asset Budget Profiler */}
      <AssetBudgetingTool />

      {/* Resource Categories */}
      <div className="space-y-6">
        {FREE_CREATOR_RESOURCES.map((cat, idx) => {
          const filteredItems = cat.items.filter((item) => {
            const matchesQuery =
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.whyYouNeedIt.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType =
              selectedTypeFilter === 'All' || item.type === selectedTypeFilter;
            return matchesQuery && matchesType;
          });

          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  {cat.category}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item, itemIdx) => {
                  const isBookmarked = bookmarks.includes(item.name);

                  return (
                    <div
                      key={itemIdx}
                      className={`bg-[#0b0f17] border rounded-lg p-4 flex flex-col justify-between transition-colors ${
                        isBookmarked ? 'border-amber-500/40 shadow-sm' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                              {item.cost}
                            </span>
                            <button
                              onClick={() => toggleBookmark(item.name)}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                isBookmarked
                                  ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                                  : 'text-slate-500 hover:text-amber-400 bg-slate-900 hover:bg-slate-800'
                              }`}
                              title={isBookmarked ? 'Remove from bookmarks' : 'Save to resource bookmarks'}
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-3.5 h-3.5" />
                              ) : (
                                <Bookmark className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
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
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
