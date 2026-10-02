import React, { useState } from 'react';
import { Layers, ArrowRight, Plus, Trash2, RotateCcw, Sparkles, MoveRight, HelpCircle, Code2, Copy, Check, Lightbulb, ShieldCheck, Flame, Trophy, Coins, Zap } from 'lucide-react';
import { RobuxIcon, GamePassTicketIcon, DevProductPotionIcon, SterlingCoinIcon } from './Icons';
import { sounds } from '../utils/audio';

export interface LoopNode {
  id: string;
  type: 'engagement' | 'trigger';
  title: string;
  category: string;
  description: string;
  psychology: string;
  luauSnippet: string;
}

export const AVAILABLE_ENGAGEMENT_MECHANICS: LoopNode[] = [
  {
    id: 'mech-daily-rewards',
    type: 'engagement',
    title: '7-Day Daily Login Streak',
    category: 'Habit Formation',
    description: 'Compounding daily rewards with a guaranteed ultra-rare pet or aura on Day 7.',
    psychology: 'Creates loss aversion. Players return every single day to avoid breaking their streak.',
    luauSnippet: `-- Track daily login in DataStore
local lastLogin = playerProfile.LastLogin or 0
if os.time() - lastLogin >= 86400 then
    awardDailyReward(player, playerProfile.StreakDays + 1)
end`
  },
  {
    id: 'mech-leaderboards',
    type: 'engagement',
    title: 'Global In-Game Leaderboards',
    category: 'Social Competition',
    description: 'Displays top speed, most rebirths, or highest win counts in the main plaza.',
    psychology: 'Triggers public social competition and whale vanity spending to maintain #1 status.',
    luauSnippet: `local OrderedDataStore = DataStoreService:GetOrderedDataStore("GlobalRebirths")
local topPages = OrderedDataStore:GetSortedAsync(false, 10)
updateLeaderboardSurfaceGui(topPages:GetCurrentPage())`
  },
  {
    id: 'mech-quests',
    type: 'engagement',
    title: 'Daily & Weekly Quest Badges',
    category: 'Goal Completion',
    description: 'Short 5-minute task milestones (e.g. "Catch 10 Fish", "Score 3 Deflections").',
    psychology: 'Provides structured progression for non-paying players so they never feel lost.',
    luauSnippet: `local function onQuestCompleted(player, questId)
    player.leaderstats.Coins.Value += 250
    showQuestCompletedCelebration(player, questId)
end`
  },
  {
    id: 'mech-afk-chamber',
    type: 'engagement',
    title: 'AFK Time Chamber & Rewards',
    category: 'Playtime Maximize',
    description: 'Designated lounge where players accumulate free gems simply by staying in the game.',
    psychology: 'Maximizes session duration, driving huge automatic Roblox Premium Engagement Payouts (EBP).',
    luauSnippet: `task.spawn(function()
    while player.Parent do
        task.wait(60)
        awardAfkGems(player, 10)
    end
end)`
  },
  {
    id: 'mech-gacha-hatch',
    type: 'engagement',
    title: 'Egg Hatching / Aura Rolling',
    category: 'Variable Reward',
    description: 'Randomized luck-based unlocks with dramatic opening animations and sound FX.',
    psychology: 'Variable ratio reinforcement schedule (identical to arcade prize machines) keeps dopamine high.',
    luauSnippet: `local function rollAura(player)
    local roll = math.random(1, 1000000)
    local aura = determineRarity(roll, player:GetAttribute("LuckMultiplier"))
    displayAuraBillboard(player, aura)
end`
  },
  {
    id: 'mech-pvp-arena',
    type: 'engagement',
    title: 'Adrenaline PvP Round Showdown',
    category: 'Skill Mastery',
    description: 'High-stakes 90-second rounds where spectators watch the final players duel.',
    psychology: 'Spectators desire the winner\'s glowing cosmetics, creating organic store discovery.',
    luauSnippet: `local function onDuelEnded(winner, loser)
    playVictoryExplosion(winner.Character)
    awardDuelTrophies(winner, 50)
end`
  }
];

export const AVAILABLE_MONETIZATION_TRIGGERS: LoopNode[] = [
  {
    id: 'trig-starter-pack',
    type: 'trigger',
    title: 'FTUE Starter Pack (29–49 R$)',
    category: 'Impulse Conversion',
    description: 'Single-purchase 5x value bundle offered only after the player completes their first tutorial win.',
    psychology: 'Breaks the psychological barrier of the first real-money purchase at minimal cost.',
    luauSnippet: `local MarketplaceService = game:GetService("MarketplaceService")
MarketplaceService:PromptGamePassPurchase(player, STARTER_PACK_PASS_ID)`
  },
  {
    id: 'trig-auto-farm',
    type: 'trigger',
    title: 'Auto-Collect / WalkSpeed Pass (299 R$)',
    category: 'Friction Removal',
    description: 'Permanent Game Pass that automates tedious grinding and doubles movement velocity.',
    psychology: 'Players happily pay to remove grind friction once they realize how much time it saves.',
    luauSnippet: `if MarketplaceService:UserOwnsGamePassAsync(player.UserId, AUTO_COLLECT_ID) then
    enableAutoHarvestAura(player)
end`
  },
  {
    id: 'trig-luck-potion',
    type: 'trigger',
    title: '15-Min 2x Luck Potion (49 R$)',
    category: 'Consumable Booster',
    description: 'Repeatable Developer Product used right before cracking open high-tier eggs or chests.',
    psychology: 'Repeatable sink for active grinders during high-stakes roll sessions.',
    luauSnippet: `MarketplaceService.ProcessReceipt = function(receiptInfo)
    if receiptInfo.ProductId == LUCK_POTION_ID then
        applyTemporaryLuckMultiplier(player, 2.0, 900)
        return Enum.ProductPurchaseDecision.PurchaseGranted
    end
end`
  },
  {
    id: 'trig-stage-skip',
    type: 'trigger',
    title: 'Instant Revive / Stage Skip (39 R$)',
    category: 'Frustration Relief',
    description: 'Prompted only upon failing a difficult boss or falling at the 90% mark of a tower.',
    psychology: 'Relieves intense situational frustration. Players value their invested time over 39 Robux.',
    luauSnippet: `local function onPlayerFallNearSummit(player)
    showContextualPrompt(player, "Continue from Floor 85?", STAGE_SKIP_PRODUCT_ID)
end`
  },
  {
    id: 'trig-weekend-lto',
    type: 'trigger',
    title: '48h Weekend Limited LTO (199 R$)',
    category: 'Urgency & FOMO',
    description: 'Exclusive seasonal crate or booster banner available strictly Friday 5PM to Sunday midnight GMT.',
    psychology: 'Countdown timer creates genuine urgency, driving up to 65% of entire monthly revenue.',
    luauSnippet: `if isWeekendLiveOpsActive() then
    showBillboardTimerGui("Weekend 2x Luck Ends in: " .. getRemainingWeekendSeconds())
end`
  },
  {
    id: 'trig-monthly-sub',
    type: 'trigger',
    title: 'VIP Monthly Subscription (349 R$/mo)',
    category: 'Recurring Revenue',
    description: 'Auto-renewing in-experience subscription providing daily gem stipends and golden chat tags.',
    psychology: 'Locks in predictable month-over-month recurring DevEx revenue with zero ongoing friction.',
    luauSnippet: `MarketplaceService:PromptSubscriptionPurchase(player, VIP_SUBSCRIPTION_ID)`
  }
];

export const PRESET_FLOW_BLUEPRINTS: {
  name: string;
  tagline: string;
  flow: LoopNode[];
}[] = [
  {
    name: 'Simulator & Pet Progression Loop',
    tagline: 'The industry-standard compounding loop used by Pet Simulator and Fisch',
    flow: [
      AVAILABLE_ENGAGEMENT_MECHANICS[0], // Daily Login Streak
      AVAILABLE_ENGAGEMENT_MECHANICS[4], // Egg Hatching
      AVAILABLE_MONETIZATION_TRIGGERS[0], // Starter Pack (29 R$)
      AVAILABLE_MONETIZATION_TRIGGERS[1], // Auto-Farm Pass (299 R$)
      AVAILABLE_ENGAGEMENT_MECHANICS[3], // AFK Chamber
      AVAILABLE_MONETIZATION_TRIGGERS[2], // 15-Min 2x Luck Potion
    ]
  },
  {
    name: 'Competitive PvP & Deflection Loop',
    tagline: 'High-adrenaline combat loop modeled after Blade Ball',
    flow: [
      AVAILABLE_ENGAGEMENT_MECHANICS[2], // Daily Quests
      AVAILABLE_ENGAGEMENT_MECHANICS[5], // PvP Arena
      AVAILABLE_MONETIZATION_TRIGGERS[3], // Instant Revive
      AVAILABLE_ENGAGEMENT_MECHANICS[1], // Leaderboards
      AVAILABLE_MONETIZATION_TRIGGERS[4], // 48h Weekend LTO
      AVAILABLE_MONETIZATION_TRIGGERS[5], // VIP Subscription
    ]
  },
  {
    name: 'Tower & Casual Obby Loop',
    tagline: 'High-volume casual loop modeled after Tower of Hell',
    flow: [
      AVAILABLE_ENGAGEMENT_MECHANICS[0], // Daily Streak
      AVAILABLE_ENGAGEMENT_MECHANICS[2], // Quests
      AVAILABLE_MONETIZATION_TRIGGERS[3], // Stage Skip (39 R$)
      AVAILABLE_MONETIZATION_TRIGGERS[1], // Low-Gravity Coil Pass (299 R$)
      AVAILABLE_ENGAGEMENT_MECHANICS[1], // Leaderboards
      AVAILABLE_MONETIZATION_TRIGGERS[0], // FTUE Starter Pack
    ]
  }
];

export const GameLoopPlanner: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<LoopNode[]>(PRESET_FLOW_BLUEPRINTS[0].flow);
  const [selectedNode, setSelectedNode] = useState<LoopNode | null>(PRESET_FLOW_BLUEPRINTS[0].flow[2]);
  const [draggedNode, setDraggedNode] = useState<LoopNode | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleApplyPreset = (presetFlow: LoopNode[]) => {
    sounds.playCoin();
    setActiveFlow([...presetFlow]);
    setSelectedNode(presetFlow[0] || null);
  };

  const handleAddToFlow = (node: LoopNode) => {
    sounds.playClick();
    const uniqueNode = { ...node, id: `${node.id}-${Date.now()}` };
    setActiveFlow([...activeFlow, uniqueNode]);
    setSelectedNode(uniqueNode);
  };

  const handleRemoveFromFlow = (index: number) => {
    sounds.playClick();
    const updated = activeFlow.filter((_, idx) => idx !== index);
    setActiveFlow(updated);
    if (selectedNode && !updated.some(n => n.id === selectedNode.id)) {
      setSelectedNode(updated[0] || null);
    }
  };

  const handleDragStart = (node: LoopNode) => {
    setDraggedNode(node);
  };

  const handleDropOnFlow = (targetIndex: number) => {
    if (!draggedNode) return;
    sounds.playSuccess();

    // Check if dragging an existing flow item or from the palette
    const existingIndex = activeFlow.findIndex(n => n.id === draggedNode.id);
    if (existingIndex >= 0) {
      // Reorder
      const updated = [...activeFlow];
      const [removed] = updated.splice(existingIndex, 1);
      updated.splice(targetIndex, 0, removed);
      setActiveFlow(updated);
    } else {
      // Insert from palette
      const uniqueNode = { ...draggedNode, id: `${draggedNode.id}-${Date.now()}` };
      const updated = [...activeFlow];
      updated.splice(targetIndex, 0, uniqueNode);
      setActiveFlow(updated);
      setSelectedNode(uniqueNode);
    }
    setDraggedNode(null);
  };

  const handleCopyLuau = () => {
    if (!selectedNode) return;
    navigator.clipboard.writeText(selectedNode.luauSnippet);
    sounds.playClick();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const engagementCount = activeFlow.filter(n => n.type === 'engagement').length;
  const triggerCount = activeFlow.filter(n => n.type === 'trigger').length;

  return (
    <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Visual Economy Architecture</span>
          </div>
          <h2 className="text-lg font-bold text-white font-display">
            Game Loop Planner &amp; Monetization Flowchart
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Drag and drop engagement retention hooks into your game loop sequence to visualize how player actions naturally funnel into high-conversion monetization triggers.
          </p>
        </div>

        {/* Preset Flow Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESET_FLOW_BLUEPRINTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset.flow)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              {preset.name.split(' ')[0]} Preset
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveFlow([]);
              setSelectedNode(null);
            }}
            className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
            title="Clear flowchart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* -------------------- DRAG-AND-DROP FLOWCHART CANVAS -------------------- */}
      <div className="bg-[#080c13] border border-slate-800/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white font-display flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Active Game Loop Sequence ({activeFlow.length} Stages)
          </span>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="text-sky-400 font-semibold">{engagementCount} Engagement Hooks</span>
            <span className="text-emerald-400 font-semibold">{triggerCount} Monetization Triggers</span>
          </div>
        </div>

        {/* The Visual Connected Sequence Chain */}
        {activeFlow.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-xs font-bold text-slate-400">Your Flowchart is Empty</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Drag mechanics from the library below, click "+ Add" on any card, or choose a preset above to build your game flow.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto py-3 px-1 scrollbar-thin">
            {activeFlow.map((node, idx) => {
              const isSelected = selectedNode?.id === node.id;
              const isEngagement = node.type === 'engagement';

              return (
                <React.Fragment key={node.id}>
                  {/* Flowchart Step Card */}
                  <div
                    draggable
                    onDragStart={() => handleDragStart(node)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOnFlow(idx)}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedNode(node);
                    }}
                    className={`shrink-0 w-52 p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'ring-2 ring-emerald-400 shadow-lg scale-105'
                        : 'hover:scale-[1.02]'
                    } ${
                      isEngagement
                        ? 'bg-[#101726] border-sky-500/40 text-sky-300'
                        : 'bg-emerald-950/20 border-emerald-500/50 text-emerald-300'
                    }`}
                  >
                    {/* Stage Number Badge */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        Step {idx + 1}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        isEngagement
                          ? 'bg-sky-950/80 text-sky-300 border border-sky-800/50'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                      }`}>
                        {isEngagement ? 'Engagement' : 'Monetization'}
                      </span>
                    </div>

                    <div className="font-bold text-white text-xs mb-1 line-clamp-1">
                      {node.title}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                      {node.description}
                    </p>

                    {/* Delete button on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromFlow(idx);
                      }}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove step"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Flow Arrow */}
                  {idx < activeFlow.length - 1 && (
                    <div className="shrink-0 flex items-center justify-center text-slate-600 px-0.5">
                      <MoveRight className="w-4 h-4 text-emerald-400 animate-pulse" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* -------------------- SELECTED NODE INSPECTOR & LUAU CODE -------------------- */}
      {selectedNode && (
        <div className="bg-[#0b0f17] border border-emerald-500/40 rounded-xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                selectedNode.type === 'engagement'
                  ? 'bg-sky-950 text-sky-300 border border-sky-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              }`}>
                {selectedNode.type.toUpperCase()}
              </span>
              <h3 className="text-sm font-bold text-white font-display">
                {selectedNode.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleCopyLuau}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Luau'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-0.5">Conversion Psychology</span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {selectedNode.psychology}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-0.5">Player Experience</span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {selectedNode.description}
                </p>
              </div>
            </div>

            {/* Luau Code Snippet */}
            <div className="bg-[#060a10] border border-slate-800 rounded-lg p-3 font-mono text-[11px] space-y-1 overflow-x-auto">
              <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-800/80 text-[10px]">
                <span>MarketplaceService Implementation</span>
                <span className="text-emerald-400">Luau 5.1</span>
              </div>
              <pre className="text-emerald-300 leading-relaxed pt-1">
                {selectedNode.luauSnippet}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MECHANICS PALETTE (DRAG OR CLICK TO ADD) -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Engagement Mechanics Palette */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Engagement Mechanics Library
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Drag or click "+ Add"</span>
          </div>

          <div className="space-y-2">
            {AVAILABLE_ENGAGEMENT_MECHANICS.map((mech) => (
              <div
                key={mech.id}
                draggable
                onDragStart={() => handleDragStart(mech)}
                className="bg-[#0b0f17] border border-slate-800 hover:border-sky-500/40 p-3 rounded-xl flex items-start justify-between gap-3 transition-all group cursor-grab active:cursor-grabbing"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                      {mech.title}
                    </span>
                    <span className="text-[9px] font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.2 rounded border border-sky-800/40">
                      {mech.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {mech.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToFlow(mech)}
                  className="px-2 py-1 bg-sky-950/80 hover:bg-sky-900 border border-sky-800/60 text-sky-300 text-[10px] font-bold rounded transition-colors cursor-pointer shrink-0"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Monetization Triggers Palette */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              Monetization Triggers Library
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Drag or click "+ Add"</span>
          </div>

          <div className="space-y-2">
            {AVAILABLE_MONETIZATION_TRIGGERS.map((trig) => (
              <div
                key={trig.id}
                draggable
                onDragStart={() => handleDragStart(trig)}
                className="bg-[#0b0f17] border border-slate-800 hover:border-emerald-500/40 p-3 rounded-xl flex items-start justify-between gap-3 transition-all group cursor-grab active:cursor-grabbing"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {trig.title}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                      {trig.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {trig.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToFlow(trig)}
                  className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[10px] font-bold rounded transition-colors cursor-pointer shrink-0"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
