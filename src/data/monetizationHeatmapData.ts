export interface HeatmapCell {
  conversionRate: number; // percentage (e.g. 5.8%)
  arpuRobux: number;       // average Robux per paying user
  tacticalAdvice: string;
}

export interface HeatmapRow {
  id: string;
  mechanicName: string;
  category: 'Game Pass' | 'Dev Product' | 'Subscription' | 'Platform';
  iconType: 'pass' | 'product' | 'sub' | 'robux';
  bestGenre: string;
  timelines: {
    ftue: HeatmapCell;         // First 15 Mins
    early: HeatmapCell;        // Day 1 to 3
    retention: HeatmapCell;    // Day 7
    endgame: HeatmapCell;      // Day 30
    whales: HeatmapCell;       // Month 3+
    weekend: HeatmapCell;      // 48h Live-Ops Event
  };
}

export const HEATMAP_COLUMNS = [
  { key: 'ftue', label: 'First 15 Mins', sub: 'FTUE Onboarding' },
  { key: 'early', label: 'Day 1–3', sub: 'Discovery Phase' },
  { key: 'retention', label: 'Day 7', sub: 'Core Retention' },
  { key: 'endgame', label: 'Day 30', sub: 'Mid-to-Late Game' },
  { key: 'whales', label: 'Month 3+', sub: 'Hardcore Whales' },
  { key: 'weekend', label: 'Weekend Event', sub: '48h Live-Ops Surge' },
] as const;

export const MONETIZATION_HEATMAP: HeatmapRow[] = [
  {
    id: 'starter-packs',
    mechanicName: 'Impulse Starter Packs (29–99 R$)',
    category: 'Game Pass',
    iconType: 'pass',
    bestGenre: 'Simulators, Obbies, Tycoons',
    timelines: {
      ftue: {
        conversionRate: 6.8,
        arpuRobux: 49,
        tacticalAdvice: 'Peak conversion window! Prompt within first 15 mins after initial small win (not on spawn). 5x value anchor converts non-payers.'
      },
      early: {
        conversionRate: 4.2,
        arpuRobux: 49,
        tacticalAdvice: 'Players who survived Day 1 will buy to catch up to friends if a small leaderboard gap appears.'
      },
      retention: {
        conversionRate: 1.8,
        arpuRobux: 49,
        tacticalAdvice: 'Drop-off begins as experienced players have either purchased or moved past starter tier.'
      },
      endgame: {
        conversionRate: 0.6,
        arpuRobux: 49,
        tacticalAdvice: 'Almost no conversion at Day 30; endgame players already own starter gear.'
      },
      whales: {
        conversionRate: 0.2,
        arpuRobux: 49,
        tacticalAdvice: 'Irrelevant to veterans; keep starter offers hidden once player reaches Level 25+.'
      },
      weekend: {
        conversionRate: 5.5,
        arpuRobux: 49,
        tacticalAdvice: 'New weekend player influx drives a fresh wave of starter pack purchases.'
      }
    }
  },
  {
    id: 'vip-convenience',
    mechanicName: 'Core VIP & Auto-Collect (199–499 R$)',
    category: 'Game Pass',
    iconType: 'pass',
    bestGenre: 'Fisch, Tycoons, Farming',
    timelines: {
      ftue: {
        conversionRate: 1.9,
        arpuRobux: 299,
        tacticalAdvice: 'Too expensive for first 15 minutes; only experienced Roblox players buy immediately.'
      },
      early: {
        conversionRate: 4.8,
        arpuRobux: 299,
        tacticalAdvice: 'Prime conversion window as players feel inventory friction or slow walking speed.'
      },
      retention: {
        conversionRate: 5.4,
        arpuRobux: 349,
        tacticalAdvice: 'Highest conversion rate: players realize auto-collect saves hours of tedious grinding.'
      },
      endgame: {
        conversionRate: 2.5,
        arpuRobux: 349,
        tacticalAdvice: 'Steady baseline purchases from committed players who decided to main your game.'
      },
      whales: {
        conversionRate: 0.8,
        arpuRobux: 349,
        tacticalAdvice: 'One-time cap saturation: whales already bought this in their first week.'
      },
      weekend: {
        conversionRate: 4.9,
        arpuRobux: 349,
        tacticalAdvice: 'Strong conversion during high CCU weekends when friends play together.'
      }
    }
  },
  {
    id: 'gacha-spins',
    mechanicName: 'Gacha Spins & Luck Potions (Dev Products)',
    category: 'Dev Product',
    iconType: 'product',
    bestGenre: 'Blade Ball, Sol\'s RNG, Anime RPGs',
    timelines: {
      ftue: {
        conversionRate: 1.2,
        arpuRobux: 99,
        tacticalAdvice: 'Give 3 free spins first! Do not demand Robux until the player tastes the excitement of a rare roll.'
      },
      early: {
        conversionRate: 3.6,
        arpuRobux: 150,
        tacticalAdvice: 'Players start chasing tier-2 auras and spend small Robux for lucky potion multipliers.'
      },
      retention: {
        conversionRate: 6.8,
        arpuRobux: 280,
        tacticalAdvice: 'Core repeat-spend loop: players buy luck potions every session to compete on global boards.'
      },
      endgame: {
        conversionRate: 8.9,
        arpuRobux: 650,
        tacticalAdvice: 'Endgame players spend hundreds of Robux weekly trying to pull 1-in-1,000,000 cosmetics.'
      },
      whales: {
        conversionRate: 12.4,
        arpuRobux: 2400,
        tacticalAdvice: 'ULTRA-HIGH CONVERSION: Uncapped whale monetization. Whales spend 10,000+ R$ chasing new banner drops.'
      },
      weekend: {
        conversionRate: 10.8,
        arpuRobux: 850,
        tacticalAdvice: 'MASSIVE SPIKE: Combine a 48h 2x Luck event with a 20% discount on 10x Luck Potions.'
      }
    }
  },
  {
    id: 'high-ticket-power',
    mechanicName: 'High-Ticket Fast Progression (799–1,999 R$)',
    category: 'Game Pass',
    iconType: 'pass',
    bestGenre: 'Simulator, Combat PvP, Racing',
    timelines: {
      ftue: {
        conversionRate: 0.4,
        arpuRobux: 999,
        tacticalAdvice: 'Never push high-ticket passes during FTUE; it triggers immediate pay-to-win backlash.'
      },
      early: {
        conversionRate: 1.5,
        arpuRobux: 999,
        tacticalAdvice: 'Wealthy players buy to instantly reach the top combat tier without grinding.'
      },
      retention: {
        conversionRate: 2.8,
        arpuRobux: 999,
        tacticalAdvice: 'Solid conversion: Dedicated players see the long-term ROI of permanent 2x EXP or 2x Power.'
      },
      endgame: {
        conversionRate: 3.5,
        arpuRobux: 1299,
        tacticalAdvice: 'High conversion among endgame players preparing for newly released dungeon/world expansions.'
      },
      whales: {
        conversionRate: 1.1,
        arpuRobux: 1299,
        tacticalAdvice: 'High-ticket passes sell once per whale; ensure you have recurring dev products to follow up.'
      },
      weekend: {
        conversionRate: 2.9,
        arpuRobux: 1100,
        tacticalAdvice: 'Weekend impulse buys driven by competitive leaderboard tournaments.'
      }
    }
  },
  {
    id: 'seasonal-event-crates',
    mechanicName: 'Seasonal Event Crates & Limited Drops',
    category: 'Dev Product',
    iconType: 'product',
    bestGenre: 'Fisch, Blade Ball, Murder Mystery',
    timelines: {
      ftue: {
        conversionRate: 1.1,
        arpuRobux: 149,
        tacticalAdvice: 'Highlight limited-edition seasonal skins (Halloween, Winter, Summer) on lobby pedestals.'
      },
      early: {
        conversionRate: 3.2,
        arpuRobux: 199,
        tacticalAdvice: 'Urgency countdown timer: "Halloween Crates Disappear in 5 Days" drives strong impulse buys.'
      },
      retention: {
        conversionRate: 5.8,
        arpuRobux: 350,
        tacticalAdvice: 'Collectors buy multiple crates to complete their seasonal badge sets.'
      },
      endgame: {
        conversionRate: 7.9,
        arpuRobux: 750,
        tacticalAdvice: 'Veterans buy crates expecting items to become rare tradable limiteds in future updates.'
      },
      whales: {
        conversionRate: 11.2,
        arpuRobux: 1800,
        tacticalAdvice: 'Whales will spend until they unlock every single variant in the seasonal collection.'
      },
      weekend: {
        conversionRate: 9.6,
        arpuRobux: 600,
        tacticalAdvice: 'Flash weekend sales on crate keys generate explosive 48h DevEx revenue.'
      }
    }
  },
  {
    id: 'premium-payouts',
    mechanicName: 'Roblox Premium Engagement Payouts (EBP)',
    category: 'Platform',
    iconType: 'robux',
    bestGenre: 'All Genres (Automatic Passive Revenue)',
    timelines: {
      ftue: {
        conversionRate: 18.0,
        arpuRobux: 15,
        tacticalAdvice: 'Zero friction! Roblox automatically pays you Robux simply when Premium subscribers play your game.'
      },
      early: {
        conversionRate: 21.0,
        arpuRobux: 35,
        tacticalAdvice: 'Offer a minor free perk to Premium users (e.g. +10% WalkSpeed, gold chat tag) to extend playtime.'
      },
      retention: {
        conversionRate: 24.5,
        arpuRobux: 65,
        tacticalAdvice: 'Engaged players with long play sessions generate massive continuous Premium EBP earnings.'
      },
      endgame: {
        conversionRate: 27.0,
        arpuRobux: 110,
        tacticalAdvice: 'AFK chambers or long dungeon raids maximize player hours and EBP payouts.'
      },
      whales: {
        conversionRate: 31.0,
        arpuRobux: 180,
        tacticalAdvice: 'Almost all hardcore players possess Roblox Premium, generating high passive baselines.'
      },
      weekend: {
        conversionRate: 28.5,
        arpuRobux: 95,
        tacticalAdvice: 'Weekend marathon sessions drive peak EBP disbursements directly to your balance.'
      }
    }
  },
  {
    id: 'monthly-subscriptions',
    mechanicName: 'In-Experience VIP Subscriptions',
    category: 'Subscription',
    iconType: 'sub',
    bestGenre: 'Simulators, Survival, Story RPGs',
    timelines: {
      ftue: {
        conversionRate: 0.3,
        arpuRobux: 299,
        tacticalAdvice: 'Players rarely subscribe on Day 1; focus on getting them hooked on core gameplay first.'
      },
      early: {
        conversionRate: 1.4,
        arpuRobux: 299,
        tacticalAdvice: 'Offer daily VIP login rewards that only activate while the subscription is active.'
      },
      retention: {
        conversionRate: 3.2,
        arpuRobux: 399,
        tacticalAdvice: 'Prime subscription sweet spot: committed players love the recurring gem stipend.'
      },
      endgame: {
        conversionRate: 4.8,
        arpuRobux: 499,
        tacticalAdvice: 'Highest lifetime value (LTV): subscribers bill automatically every 30 days.'
      },
      whales: {
        conversionRate: 6.5,
        arpuRobux: 499,
        tacticalAdvice: 'Whales subscribe automatically as a status symbol and baseline convenience.'
      },
      weekend: {
        conversionRate: 2.8,
        arpuRobux: 399,
        tacticalAdvice: 'Promote subscription bonus during weekend events to lock in monthly recurring revenue.'
      }
    }
  }
];
