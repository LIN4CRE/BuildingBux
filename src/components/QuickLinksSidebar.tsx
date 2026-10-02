import React, { useState } from 'react';
import { ExternalLink, Compass, ShieldCheck, DollarSign, BarChart2, BookOpen, Users, ChevronRight, ChevronLeft, Link2, X } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon } from './Icons';
import { sounds } from '../utils/audio';

export interface QuickLinkItem {
  id: string;
  title: string;
  category: 'Platform' | 'Payouts' | 'Docs';
  description: string;
  url: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const OFFICIAL_ROBLOX_LINKS: QuickLinkItem[] = [
  {
    id: 'creator-hub',
    title: 'Roblox Creator Dashboard',
    category: 'Platform',
    description: 'Manage live games, game passes, developer products, badges, and cloud servers.',
    url: 'https://create.roblox.com/dashboard/creations',
    badge: 'Main Studio',
    icon: Compass,
    accentColor: 'text-emerald-400 group-hover:text-emerald-300'
  },
  {
    id: 'devex-portal',
    title: 'Official DevEx Portal',
    category: 'Payouts',
    description: 'Submit cashout requests for 30,000+ earned Robux into real fiat currency.',
    url: 'https://create.roblox.com/dashboard/devex',
    badge: '≥ 30k R$',
    icon: DollarSign,
    accentColor: 'text-sky-400 group-hover:text-sky-300'
  },
  {
    id: 'developer-hub-docs',
    title: 'Developer Documentation Hub',
    category: 'Docs',
    description: 'Official API reference manuals, MarketplaceService guides, and Luau tutorials.',
    url: 'https://create.roblox.com/docs',
    badge: 'API & Luau',
    icon: BookOpen,
    accentColor: 'text-amber-400 group-hover:text-amber-300'
  },
  {
    id: 'tipalti-payout',
    title: 'Tipalti Payout Processing',
    category: 'Payouts',
    description: 'Direct wire & BACS transfer portal to manage UK bank details and W-8BEN tax forms.',
    url: 'https://suppliers.tipalti.com/roblox',
    badge: 'UK Bank Wire',
    icon: SterlingCoinIcon,
    accentColor: 'text-teal-400 group-hover:text-teal-300'
  },
  {
    id: 'creator-analytics',
    title: 'Creator Analytics Dashboard',
    category: 'Platform',
    description: 'Monitor real-time concurrent players (CCU), D1/D7 retention, and player spending.',
    url: 'https://create.roblox.com/dashboard/analytics',
    badge: 'Telemetry',
    icon: BarChart2,
    accentColor: 'text-purple-400 group-hover:text-purple-300'
  },
  {
    id: 'talent-hub',
    title: 'Roblox Talent Hub',
    category: 'Platform',
    description: 'Hire verified 3D modelers, animators, UI designers, and sound engineers.',
    url: 'https://talent.roblox.com',
    badge: 'Contractors',
    icon: Users,
    accentColor: 'text-blue-400 group-hover:text-blue-300'
  }
];

export const QuickLinksSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  return (
    <>
      {/* Mobile Floating Action Button (FAB) */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => {
            sounds.playClick();
            setMobileDrawerOpen(true);
          }}
          className="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full shadow-xl shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          title="Open Roblox Official Quick Links"
        >
          <Link2 className="w-5 h-5" />
          <span className="text-xs font-bold font-display pr-1">Quick Links</span>
        </button>
      </div>

      {/* Mobile Modal / Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#101726] border border-slate-700/80 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0b0f17]">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Official Roblox Portals
                </h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5">
              {OFFICIAL_ROBLOX_LINKS.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#0b0f17] hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition-all flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                        <IconComponent className={`w-4 h-4 ${link.accentColor}`} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {link.title}
                          </span>
                          {link.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-1 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-14' : 'w-72 xl:w-80'
        }`}
      >
        <div className="sticky top-20 bg-[#101726] border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg shadow-black/20">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Official Quick Links
                </h3>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsCollapsed(!isCollapsed);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer mx-auto lg:mx-0"
              title={isCollapsed ? 'Expand Quick Links' : 'Collapse Quick Links'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4 text-emerald-400" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Collapsed State: Icon buttons */}
          {isCollapsed ? (
            <div className="space-y-3 flex flex-col items-center">
              {OFFICIAL_ROBLOX_LINKS.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${link.title} - ${link.description}`}
                    className="p-2.5 rounded-lg bg-[#0b0f17] hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-400 hover:text-white transition-all group"
                  >
                    <IconComponent className={`w-4 h-4 ${link.accentColor}`} />
                  </a>
                );
              })}
            </div>
          ) : (
            /* Expanded State: Full link cards */
            <div className="space-y-2.5">
              <div className="text-[11px] text-slate-400 leading-tight">
                One-click access to official Roblox developer portals and payment rails:
              </div>

              <div className="space-y-2">
                {OFFICIAL_ROBLOX_LINKS.map((link) => {
                  const IconComponent = link.icon;

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-[#0b0f17] hover:bg-slate-900/90 border border-slate-800/90 hover:border-emerald-500/40 rounded-lg transition-all flex items-start justify-between gap-2.5 group cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                          <IconComponent className={`w-3.5 h-3.5 ${link.accentColor}`} />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                              {link.title}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-1 transition-colors" />
                    </a>
                  );
                })}
              </div>

              {/* DevEx Constants Summary Box */}
              <div className="pt-3 border-t border-slate-800/80 bg-[#080c13] p-2.5 rounded-lg text-[10px] font-mono space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>DevEx Rate:</span>
                  <span className="text-emerald-400 font-bold">$0.0035 USD / 1 R$</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Cashout:</span>
                  <span className="text-white font-bold">30,000 Earned R$</span>
                </div>
                <div className="flex justify-between">
                  <span>UK Withholding (W-8BEN):</span>
                  <span className="text-teal-300 font-bold">0% US Tax</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
