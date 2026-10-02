import { GenreBlueprint } from '../types';

export const GENRE_PRESETS: GenreBlueprint[] = [
  {
    id: 'simulator',
    name: 'Incremental / Pet Simulator',
    tagline: 'High ARPU, Pet Hatching, Rebirth loops, Speed Upgrades',
    description: 'The golden standard of Roblox monetization. Relies on incremental numbers, pet collecting, rebirth multipliers, and auto-farm convenience passes.',
    coreLoop: [
      'Click or harvest resources (Coins, Strength, Energy)',
      'Deposit resources at the shop zone to buy storage or backpack upgrades',
      'Open eggs or crates to hatch pets with randomized multiplier stats',
      'Rebirth/Prestige to reset basic stats in exchange for permanent 2x-10x multipliers and access to new worlds'
    ],
    retentionHooks: [
      'Daily Login Streak with guaranteed rare pet on Day 7',
      'AFK Egg Hatching (incentivizes keeping the game open for hours, boosting Premium Payouts)',
      'Free gifts timed at 5m, 15m, 30m, 60m session milestones',
      'Global leaderboards for Highest Strength / Most Rebirths'
    ],
    recommendedPricingStrategy: 'Low entry starter passes (99 R$) to convert first-time spenders, paired with high-frequency Dev Products (Gems & Boost Potions) for ongoing revenue.',
    gamePasses: [
      {
        id: 'gp-sim-1',
        name: 'Auto-Hatch & Triple Open',
        robuxPrice: 399,
        category: 'convenience',
        description: 'Allows player to open 3 eggs simultaneously and keep hatching hands-free.',
        recommendedFor: 'Core grind players; 65% of regular spenders buy this within 48 hours.',
        conversionImpact: 'Essential convenience pass with highest conversion among grinders.'
      },
      {
        id: 'gp-sim-2',
        name: 'VIP Club & Golden Aura',
        robuxPrice: 299,
        category: 'vip',
        description: 'Permanent +25% Coins, exclusive VIP chat tag, VIP chest claimable every 6 hours, golden particle trail.',
        recommendedFor: 'Social flex and steady progression boost.',
        conversionImpact: 'High entry impulse buy due to social recognition in chat.'
      },
      {
        id: 'gp-sim-3',
        name: '+4 Equipped Pets',
        robuxPrice: 599,
        category: 'progression',
        description: 'Expands maximum active pets from 4 to 8, effectively doubling total multiplier power.',
        recommendedFor: 'Mid-game players looking to dominate leaderboards.',
        conversionImpact: 'Top whale pass; extremely high revenue contributor.'
      },
      {
        id: 'gp-sim-4',
        name: 'Super Fast Walkspeed (+80%)',
        robuxPrice: 149,
        category: 'convenience',
        description: 'Doubles base running speed to traverse world zones instantly without mount lag.',
        recommendedFor: 'Impulse buyers and mobile players frustrated by slow travel.',
        conversionImpact: 'Great low-cost conversion bridge.'
      },
      {
        id: 'gp-sim-5',
        name: '2x Luck Booster (Permanent)',
        robuxPrice: 799,
        category: 'power',
        description: 'Doubles the probability of rolling Legendary, Mythic, and Secret pets from any egg.',
        recommendedFor: 'Collectors and high-tier competitive players.',
        conversionImpact: 'Premium pricing tier with massive perceived value.'
      }
    ],
    devProducts: [
      {
        id: 'dp-sim-1',
        name: '15-Min 3x Super Luck Potion',
        robuxPrice: 49,
        category: 'boost',
        description: 'Temporary stackable potion that triples rare roll odds during egg opening sessions.',
        frequency: 'high',
        whaleAppeal: 'Players buy 10-20 at once during weekend update events.'
      },
      {
        id: 'dp-sim-2',
        name: 'Tier 1 Gems Pouch (500 Gems)',
        robuxPrice: 39,
        category: 'currency',
        description: 'Starter currency bundle to immediately unlock first pet enchant.',
        frequency: 'medium',
        whaleAppeal: 'Standard low-friction entry point.'
      },
      {
        id: 'dp-sim-3',
        name: 'Vault of Gems (25,000 Gems + 20% Free)',
        robuxPrice: 999,
        category: 'currency',
        description: 'High-tier currency pack giving enough gems to max out enchantments instantly.',
        frequency: 'medium',
        whaleAppeal: 'Anchor pricing; bought by top 2% of players repeatedly.'
      },
      {
        id: 'dp-sim-4',
        name: 'Instant Rebirth Token',
        robuxPrice: 199,
        category: 'skip',
        description: 'Skips the grinding requirement for the current world prestige tier.',
        frequency: 'high',
        whaleAppeal: 'Popular among players who hit bottlenecks.'
      }
    ],
    subscription: {
      id: 'sub-sim-1',
      name: 'Simulator Elite Pass',
      monthlyRobux: 350,
      perks: [
        'Daily 500 Free Gems auto-credited',
        'Permanent +20% All Coins & EXP boost',
        'Rainbow Chat Name & Discord Supporter Role',
        'Access to Subscriber-only Trading Plaza'
      ],
      retentionBenefit: 'Provides recurring predictable monthly Robux revenue and guarantees 30-day return rate.'
    }
  },
  {
    id: 'tycoon',
    name: 'Automation & Base Tycoon',
    tagline: 'Step-by-step factory builder, droppers, defensive upgrades, rebirth perks',
    description: 'Highly addictive build-your-empire loop. Players love seeing money counter ticks accelerate and defending their base against rivals.',
    coreLoop: [
      'Step on free button to claim empty plot and spawn first dropper',
      'Collect money as ores fall onto conveyor belt and sell at furnace',
      'Buy advanced droppers, multi-level conveyor belts, and walls',
      'Unlock weapons, vehicles, and rooftop helipads to fight or flex on neighboring plots'
    ],
    retentionHooks: [
      'Auto-save plot progress (critical! Never wipe tycoon progress on disconnect)',
      'Rebirth tree with permanent custom droppers that keep producing while offline',
      'Daily factory rewards and collaborative plot-sharing with friends'
    ],
    recommendedPricingStrategy: 'Focus on time-saving convenience (Auto-Collect, 2x Cash) and high-status defensive weapons.',
    gamePasses: [
      {
        id: 'gp-tyc-1',
        name: 'Auto-Collect Cash Pad',
        robuxPrice: 249,
        category: 'convenience',
        description: 'Automatically transfers furnace earnings directly to bank account without having to step on the collection plate.',
        recommendedFor: 'Every active player. Highest conversion gamepass in the genre.',
        conversionImpact: 'Fundamental quality-of-life pass; converts up to 8% of players.'
      },
      {
        id: 'gp-tyc-2',
        name: '2x Cash Multiplier',
        robuxPrice: 399,
        category: 'progression',
        description: 'Permanently doubles all money received from dropped items and completed floors.',
        recommendedFor: 'Speed runners and players wanting to finish all 4 floors in half the time.',
        conversionImpact: 'Strong mid-tier anchor.'
      },
      {
        id: 'gp-tyc-3',
        name: 'Laser Security Forcefield',
        robuxPrice: 199,
        category: 'power',
        description: 'Renders your plot completely impervious to enemy raiders and rocket attacks.',
        recommendedFor: 'Peaceful builders tired of being spawn-killed by aggressive players.',
        conversionImpact: 'Emotional purchase driven by frustration relief.'
      },
      {
        id: 'gp-tyc-4',
        name: 'Gold Plated Supercar / Chopper',
        robuxPrice: 450,
        category: 'cosmetic',
        description: 'Spawns an exclusive hypercar with custom nitrous flame effects outside your garage.',
        recommendedFor: 'Flex and mobility on the shared central map.',
        conversionImpact: 'Status symbol purchase.'
      }
    ],
    devProducts: [
      {
        id: 'dp-tyc-1',
        name: 'Instant $500,000 Cash Injection',
        robuxPrice: 99,
        category: 'currency',
        description: 'Gives player immediate funds to finish their current floor without waiting.',
        frequency: 'high',
        whaleAppeal: 'Impulse purchase when 1 button short of completing a cool floor.'
      },
      {
        id: 'dp-tyc-2',
        name: 'Instant $5,000,000 Empire Vault',
        robuxPrice: 499,
        category: 'currency',
        description: 'Massive cash infusion to breeze through second rebirth instantly.',
        frequency: 'medium',
        whaleAppeal: 'Popular among older players with disposable Robux.'
      },
      {
        id: 'dp-tyc-3',
        name: 'Server 2x Speed Event (15 Min)',
        robuxPrice: 149,
        category: 'boost',
        description: 'Triggers a global server announcement and doubles conveyor speed for all players in the server.',
        frequency: 'medium',
        whaleAppeal: 'Allows whales to play hero in front of the entire server.'
      }
    ],
    subscription: {
      id: 'sub-tyc-1',
      name: 'Industrial Mogul Club',
      monthlyRobux: 299,
      perks: [
        'Passive offline cash accrual up to 24 hours',
        '+15% value on all conveyor ores',
        'Executive office penthouse unlockable in base',
        'Mogul Chat Badge & golden name tag'
      ],
      retentionBenefit: 'Incentivizes players to log in every day to collect their 24h accumulated vault.'
    }
  },
  {
    id: 'anime-rpg',
    name: 'Anime Action / Roguelite RPG',
    tagline: 'Combat skills, dungeon grinding, rare weapon gacha, awakening forms',
    description: 'Extremely popular with Roblox core demographics (teens & young adults). Very high spend velocity driven by skill rerolls, cosmetic auras, and raid revives.',
    coreLoop: [
      'Complete quests and defeat bandit mobs in the starting village',
      'Earn Yen / Spirit shards to spin for rare Anime Abilities (e.g. 0.5% Mythic Fire Dragon)',
      'Level up skill trees and master ultimate awakenings',
      'Co-op with friends to tackle challenging dungeon bosses and loot legendary weapons'
    ],
    retentionHooks: [
      'Weekly content drops (new anime boss or weapon line)',
      'Pity system on ability spins (guaranteed Legendary every 50 spins)',
      'PvP Arena leaderboards with ranked seasonal titles'
    ],
    recommendedPricingStrategy: 'Reroll spins as Developer Products are the primary monetization engine; Game Passes provide storage & drop boost.',
    gamePasses: [
      {
        id: 'gp-ani-1',
        name: 'Fast Mastery (2x EXP)',
        robuxPrice: 449,
        category: 'progression',
        description: 'Permanently doubles weapon mastery and character leveling speed.',
        recommendedFor: 'Players leveling alternative builds or new combat fruits.',
        conversionImpact: 'High conversion for active combat players.'
      },
      {
        id: 'gp-ani-2',
        name: 'Boss Drop Notifier & 2x Item Drops',
        robuxPrice: 650,
        category: 'power',
        description: 'Alerts player 2 minutes before rare world bosses spawn and doubles boss chest loot chance.',
        recommendedFor: 'Dedicated raid grinders looking for 1% boss drops.',
        conversionImpact: 'Top tier gamepass with heavy utility value.'
      },
      {
        id: 'gp-ani-3',
        name: '+3 Ability Storage Slots',
        robuxPrice: 350,
        category: 'convenience',
        description: 'Store rolled abilities without overwriting them, enabling quick hot-swapping between PvP and PvE builds.',
        recommendedFor: 'Serious PvP players who need versatile loadouts.',
        conversionImpact: 'Strong recurring need as more updates drop.'
      }
    ],
    devProducts: [
      {
        id: 'dp-ani-1',
        name: '5x Ability Rerolls (Spins)',
        robuxPrice: 99,
        category: 'gacha',
        description: 'Grants 5 spins at the Ability Master. Odds clearly displayed in UI (80% Common, 15% Rare, 4.5% Epic, 0.5% Mythic).',
        frequency: 'high',
        whaleAppeal: 'Biggest grossing product in anime games; players repeatedly purchase until hitting Mythic.'
      },
      {
        id: 'dp-ani-2',
        name: '25x Ability Rerolls Bundle (+5 Bonus)',
        robuxPrice: 399,
        category: 'gacha',
        description: 'Discounted roll bundle with guaranteed Epic or higher.',
        frequency: 'high',
        whaleAppeal: 'Core spending bundle for update nights.'
      },
      {
        id: 'dp-ani-3',
        name: 'Dungeon Raid Instant Revive',
        robuxPrice: 35,
        category: 'revive',
        description: 'Revives fallen player at current dungeon boss stage with full health and cooldown reset.',
        frequency: 'high',
        whaleAppeal: 'Loss aversion purchase when boss is at 10% health.'
      }
    ],
    subscription: {
      id: 'sub-ani-1',
      name: 'Warrior Syndicate Membership',
      monthlyRobux: 499,
      perks: [
        '10 Free Ability Spins credited every week',
        'Special Dungeon Key allowing 1 bonus raid daily',
        'Exclusive Dark Flame sword skin',
        'Purple Syndicate chat prefix & Discord role'
      ],
      retentionBenefit: 'Secures high lifetime value from core action enthusiasts.'
    }
  },
  {
    id: 'tower-obby',
    name: 'Tower / Difficulty Chart Obby',
    tagline: 'Challenging parkour, vertical towers, checkpoint skips, cosmetic trails',
    description: 'Lower development overhead with immense replayability and YouTube/TikTok viral potential. Monetization focuses on skip mechanics, practice tools, and flashy trails.',
    coreLoop: [
      'Climb increasingly difficult obstacle stages with lava, disappearing bricks, and tight jumps',
      'Reach checkpoints to save vertical height',
      'Earn completion badges and in-game halo crowns at the summit',
      'Speedrun stages against the server clock to place on the global summit leaderboard'
    ],
    retentionHooks: [
      'Weekly new tower floor additions',
      'Crown collectibles for beating towers without using any skips',
      'Practice mode allowing players to rehearse difficult individual jumps'
    ],
    recommendedPricingStrategy: 'Microtransactions for instant stage skips (25-45 R$) and premium cosmetic halos/trails that don\'t compromise competitive leaderboards.',
    gamePasses: [
      {
        id: 'gp-oby-1',
        name: 'Checkpoint Teleporter & Practice Coil',
        robuxPrice: 199,
        category: 'convenience',
        description: 'Allows player to instantly teleport between any previously completed checkpoints.',
        recommendedFor: 'Practice runners and social players accompanying friends.',
        conversionImpact: 'Consistently high purchase rate.'
      },
      {
        id: 'gp-oby-2',
        name: 'Gravity Coil (+40% Jump Height)',
        robuxPrice: 299,
        category: 'power',
        description: 'Legendary blue coil that reduces falling speed and gives high floaty jumps.',
        recommendedFor: 'Casual players who struggle with punishing precision jumps.',
        conversionImpact: 'Classic Roblox staple item with instant brand recognition.'
      },
      {
        id: 'gp-oby-3',
        name: 'Rainbow Neon Aura & Halo',
        robuxPrice: 149,
        category: 'cosmetic',
        description: 'Emits vibrant rainbow streaks as you parkour across floating platforms.',
        recommendedFor: 'Cosmetic lovers and content creators recording gameplay clips.',
        conversionImpact: 'High conversion among younger demographics.'
      }
    ],
    devProducts: [
      {
        id: 'dp-oby-1',
        name: 'Skip 1 Stage (Instant Pass)',
        robuxPrice: 35,
        category: 'skip',
        description: 'Bypasses the current frustrating obstacle and teleports you to next checkpoint.',
        frequency: 'high',
        whaleAppeal: 'Impulse purchase after falling 5+ times on the same tricky jump.'
      },
      {
        id: 'dp-oby-2',
        name: 'Skip 5 Stages Bundle',
        robuxPrice: 125,
        category: 'skip',
        description: 'Bypasses an entire difficulty section with 30% savings.',
        frequency: 'medium',
        whaleAppeal: 'Popular among players who just want to reach the summit roof.'
      },
      {
        id: 'dp-oby-3',
        name: 'Low Gravity Mutator (Server-wide, 3 Mins)',
        robuxPrice: 89,
        category: 'boost',
        description: 'Activates moon gravity for all players in the server for 3 minutes.',
        frequency: 'medium',
        whaleAppeal: 'Chaos fun item bought to make everyone in the server celebrate.'
      }
    ],
    subscription: {
      id: 'sub-oby-1',
      name: 'Tower Climbers VIP Club',
      monthlyRobux: 199,
      perks: [
        '3 Free Stage Skips refreshed every week',
        'VIP neon crown trail cosmetic',
        'Access to VIP summit lounge with swimming pool and fireworks',
        'Special gold username on summit boards'
      ],
      retentionBenefit: 'Provides reliable recurring baseline income from consistent platformer fans.'
    }
  }
];
