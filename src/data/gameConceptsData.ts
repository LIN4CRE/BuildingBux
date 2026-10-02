export interface GameConcept {
  id: string;
  conceptTitle: string;
  genre: string;
  blueprintId: 'simulator' | 'pvp' | 'tycoon' | 'rpg';
  pairingHeadline: string;
  targetAudience: string;
  coreHook: string;
  devComplexity: 'Beginner (1-2 wks)' | 'Intermediate (2-4 wks)' | 'Advanced (1-2 mos)';
  primaryRevenueDriver: 'Game Passes (Volume)' | 'Developer Products (Whales)' | 'Hybrid (Passes + Consumables)' | 'Engagement (Roblox EBP)';
  monetizationArchitecture: {
    recommendedPasses: { name: string; price: number; reason: string }[];
    recommendedProducts: { name: string; price: number; reason: string }[];
    recommendedSubscription?: { name: string; price: number; reason: string };
    conversionExpectation: string;
    arpdauBenchmark: string;
  };
  whyItWorks: string;
  starterAdvice: string;
}

export const TRENDING_GAME_CONCEPTS: GameConcept[] = [
  {
    id: 'concept-speed-sim',
    conceptTitle: 'Speed & Rebirth Simulator',
    genre: 'Incremental Simulator',
    blueprintId: 'simulator',
    pairingHeadline: 'Simulator + Game Passes for Speed & Multipliers',
    targetAudience: 'Broad Casual & Mobile Players (Ages 8-16)',
    coreHook: 'Every step or click grants +1 Speed. Race other players on hyper-speed tracks and unlock higher speed tiers through rebirths.',
    devComplexity: 'Beginner (1-2 wks)',
    primaryRevenueDriver: 'Hybrid (Passes + Consumables)',
    monetizationArchitecture: {
      recommendedPasses: [
        { name: '2x WalkSpeed & Sprint', price: 299, reason: 'Instant gratification: players immediately feel faster than non-payers in the lobby.' },
        { name: 'Auto-Train / Auto-Clicker', price: 399, reason: 'High convenience: allows hands-free speed farming while multitasking.' },
        { name: '+3 Equipped Pets', price: 599, reason: 'Progression anchor: more pets equals exponential speed multiplier stacking.' }
      ],
      recommendedProducts: [
        { name: '15-Min 3x Speed Potion', price: 49, reason: 'Cheap impulse purchase before competitive race tournaments.' },
        { name: 'Super Rebirth Token', price: 149, reason: 'Skips grind tiers during weekend double-experience events.' }
      ],
      recommendedSubscription: {
        name: 'VIP Speedster Club',
        price: 349,
        reason: 'Monthly auto-renewing stipend of +25% speed aura and daily pet drop.'
      },
      conversionExpectation: '2.8% – 4.2% of DAU',
      arpdauBenchmark: '0.85 – 1.40 R$ / player'
    },
    whyItWorks: 'Visual speed in Roblox lobbies is inherently viral. When other players zoom past at lightspeed with glowing neon particles, it triggers an immediate psychological desire to purchase Speed Game Passes to catch up.',
    starterAdvice: 'Give every new player 5 minutes of free 2x speed upon joining. When the boost expires, prompt the permanent 299 R$ Speed Pass or a 29 R$ Starter Pack.'
  },
  {
    id: 'concept-blade-combat',
    conceptTitle: 'Deflection Arena: Blade Champions',
    genre: 'Action PvP Combat',
    blueprintId: 'pvp',
    pairingHeadline: 'PvP Arena + Cosmetic Weapon Crates & Battle Pass',
    targetAudience: 'Competitive PC & Mobile Gamers (Ages 12-22)',
    coreHook: 'Fast-reaction deflection combat where players time weapon parries to send an accelerating energy orb at rivals. Last survivor wins.',
    devComplexity: 'Intermediate (2-4 wks)',
    primaryRevenueDriver: 'Developer Products (Whales)',
    monetizationArchitecture: {
      recommendedPasses: [
        { name: 'VIP Combatant & Custom Chat Color', price: 249, reason: 'Social prestige badge displayed above character in the pre-game lobby.' },
        { name: 'Permanent Double Coins', price: 499, reason: 'Reduces time required to grind free swords.' }
      ],
      recommendedProducts: [
        { name: 'Seasonal Cyber Weapon Crate (1 Spin)', price: 99, reason: 'Uncapped repeat spender sink: players chase 0.5% mythical katanas.' },
        { name: '10x Crate Bundle (Guaranteed Epic)', price: 799, reason: 'Whale spend magnet with discount anchor pricing.' },
        { name: 'Custom Finisher Explosion FX', price: 199, reason: 'Bragging rights: plays a massive visual explosion whenever you win a round.' }
      ],
      recommendedSubscription: {
        name: 'Arena Master Season Pass',
        price: 399,
        reason: 'Grants access to premium battle pass track with exclusive seasonal katanas.'
      },
      conversionExpectation: '3.5% – 5.5% of DAU',
      arpdauBenchmark: '1.20 – 2.50 R$ / player'
    },
    whyItWorks: 'Competitive spectators see the winner\'s glowing custom blade and unique kill effect at the end of every 90-second round. This creates immense organic social demand for cosmetic Dev Product crates without breaking gameplay balance.',
    starterAdvice: 'Never sell pay-to-win advantages that make parry windows larger. Monetize 100% through high-energy particle effects, customized sword slashes, and victory animations.'
  },
  {
    id: 'concept-deep-sea-fishing',
    conceptTitle: 'Abyssal Waters: Deep Sea Angler',
    genre: 'Exploration & Simulator',
    blueprintId: 'simulator',
    pairingHeadline: 'Fishing Simulator + Tiered Rod Passes & Luck Bait',
    targetAudience: 'Chill Exploration Gamers (Ages 10-24)',
    coreHook: 'Navigate an open-ocean archipelago on small boats, casting lines into deep underwater trenches to catch mythical sea creatures and ancient relics.',
    devComplexity: 'Intermediate (2-4 wks)',
    primaryRevenueDriver: 'Hybrid (Passes + Consumables)',
    monetizationArchitecture: {
      recommendedPasses: [
        { name: 'Deep Sea Sonar Radar', price: 349, reason: 'Shows exact depths and silhouettes of rare fish swimming under your boat.' },
        { name: 'Turbine Speedboat Pass', price: 499, reason: 'Cuts travel time between distant islands in half.' },
        { name: '+500 Tackle Box Capacity', price: 199, reason: 'Removes inventory friction so players can fish for hours without returning to dock.' }
      ],
      recommendedProducts: [
        { name: 'Can of Kraken Chum (3x Mythic Luck)', price: 79, reason: 'Repeatable consumable used during seasonal storms and midnight tides.' },
        { name: 'Instant Weather Totem (Summon Rain)', price: 149, reason: 'Server-wide summon: spawns rare storm fish for all nearby players.' }
      ],
      recommendedSubscription: {
        name: 'Royal Angler Guild Membership',
        price: 299,
        reason: 'Weekly delivery of 5x Golden Baits and access to the Private Member Atoll.'
      },
      conversionExpectation: '2.5% – 3.8% of DAU',
      arpdauBenchmark: '0.90 – 1.65 R$ / player'
    },
    whyItWorks: 'Modeled after mega-hits like Fisch. Players spend hours in peaceful atmospheric waters, maximizing Roblox Premium Engagement Payouts (EBP). Rod passes give permanent satisfaction while luck bait drives weekend monetization spikes.',
    starterAdvice: 'Implement server weather alerts (e.g. "A Blood Moon Storm has appeared over Shark Trench!"). When storms hit, fish luck jumps by 2x, driving a surge in chum bait purchases.'
  },
  {
    id: 'concept-brainrot-steal',
    conceptTitle: 'Steal & Vault: The Great Escape',
    genre: 'Social Stealth PvP',
    blueprintId: 'pvp',
    pairingHeadline: 'Stealth Tycoon + Low-Ticket Troll Weapons & Vault VIP',
    targetAudience: 'Viral Gen-Z / Alpha Mobile Gamers (Ages 7-14)',
    coreHook: 'Infiltrate rival players\' bases to steal high-value treasure (Brainrot artifacts, gold bricks), then sprint back to your safe vault without getting caught.',
    devComplexity: 'Beginner (1-2 wks)',
    primaryRevenueDriver: 'Game Passes (Volume)',
    monetizationArchitecture: {
      recommendedPasses: [
        { name: 'Reinforced Titanium Vault Door', price: 199, reason: 'Slows down intruders trying to breach your base by 3x.' },
        { name: 'Invisibility Cloak (10s Stealth)', price: 349, reason: 'Ultimate fun pass: sneaks past guard turrets into rival vaults.' },
        { name: 'Permanent Grappling Hook', price: 299, reason: 'Zips over security fences and base perimeters.' }
      ],
      recommendedProducts: [
        { name: 'Troll Banana Peel (Trips Pursuer)', price: 29, reason: 'Hilarious impulse purchase when being chased across the map.' },
        { name: 'Instant Vault Alarm Silencer', price: 49, reason: 'Single-use stealth tool for daring heists.' }
      ],
      conversionExpectation: '4.5% – 6.5% of DAU',
      arpdauBenchmark: '0.70 – 1.10 R$ / player'
    },
    whyItWorks: 'Viral social comedy. Low 29–49 R$ price points match the small balances Roblox players have left over from 400 R$ gift cards, generating enormous transaction volume.',
    starterAdvice: 'Keep prices low (under 350 R$). High volume and massive TikTok/YouTube short clipability will drive 50,000+ DAU organically.'
  },
  {
    id: 'concept-cyber-tower-obby',
    conceptTitle: 'Cyber Ascent: 100-Floor Tower',
    genre: 'Obby / Platformer',
    blueprintId: 'tycoon',
    pairingHeadline: 'Tower Obby + Stage Skips & Low-Gravity Halo Passes',
    targetAudience: 'All Ages (High Mobile Share)',
    coreHook: 'Challenging neon obstacle course tower that regenerates sections every 8 minutes. Race to the summit before the timer runs out.',
    devComplexity: 'Beginner (1-2 wks)',
    primaryRevenueDriver: 'Game Passes (Volume)',
    monetizationArchitecture: {
      recommendedPasses: [
        { name: 'Low-Gravity Neon Coil', price: 199, reason: 'Makes hard jumps 50% easier while emitting radiant neon particles.' },
        { name: 'Permanent Checkpoint Beacon', price: 299, reason: 'Saves your floor position even if the tower resets.' },
        { name: 'Golden Wings Vanity Trail', price: 149, reason: 'Pure cosmetic flex for players who want to stand out on the leaderboards.' }
      ],
      recommendedProducts: [
        { name: 'Skip Current Floor', price: 49, reason: 'Impulse purchase when a player fails a tricky laser jump 3 times in a row.' },
        { name: 'Instant 1-Min Tower Freeze', price: 99, reason: 'Server-wide hero purchase: freezes the countdown timer for everyone.' }
      ],
      conversionExpectation: '2.0% – 3.2% of DAU',
      arpdauBenchmark: '0.45 – 0.80 R$ / player'
    },
    whyItWorks: 'High frustration triggers monetization: when a player repeatedly falls on Floor 87 right before the top, paying 49 R$ for an instant skip feels like an absolute bargain compared to restarting.',
    starterAdvice: 'Never make stage skips mandatory. The obby must be 100% beatable without spending Robux, so skilled free-to-play players create tutorial videos that drive traffic.'
  },
  {
    id: 'concept-anime-raids',
    conceptTitle: 'Chakra Awakening: Infinite Raids',
    genre: 'Anime Action RPG',
    blueprintId: 'rpg',
    pairingHeadline: 'Anime RPG + Drop Multipliers & Gacha Summon Crystals',
    targetAudience: 'Dedicated PC & Console Gamers (Ages 13-25)',
    coreHook: 'Unlock legendary anime abilities, battle wave-based dungeon bosses with friends, and forge mythical elemental armor.',
    devComplexity: 'Advanced (1-2 mos)',
    primaryRevenueDriver: 'Developer Products (Whales)',
    monetizationArchitecture: {
      recommendedPasses: [
        { name: '2x Boss Drop Rate', price: 599, reason: 'Cuts dungeon grinding time in half for rare mythical weapon recipes.' },
        { name: '2x Character EXP', price: 399, reason: 'Levels up new abilities twice as fast.' },
        { name: 'Infinite Inventory Bag', price: 249, reason: 'Essential convenience pass for dungeon farming runs.' }
      ],
      recommendedProducts: [
        { name: 'Summon Shard Pack (10 Rolls)', price: 499, reason: 'Core gacha loop: rolls for S-Tier anime spirits and auras.' },
        { name: 'Stat Reallocation Scroll', price: 99, reason: 'Allows players to reset and min-max their combat skill builds.' }
      ],
      recommendedSubscription: {
        name: 'Chakra Guild Pass',
        price: 499,
        reason: 'Monthly auto-renewing bonus of 10x Summon Shards and +15% Dungeon EXP.'
      },
      conversionExpectation: '3.0% – 4.5% of DAU',
      arpdauBenchmark: '1.80 – 3.50 R$ / player'
    },
    whyItWorks: 'Anime fans are the highest-spending demographic on Roblox. They spend large amounts chasing rare 0.1% auras and limited banner characters to showcase in public lobbies.',
    starterAdvice: 'Always show exact drop percentages (e.g. S-Tier: 0.5%) in your UI to maintain player trust and comply with global app store transparency rules.'
  }
];
