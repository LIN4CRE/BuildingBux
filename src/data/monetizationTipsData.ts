export interface MonetizationTip {
  id: string;
  category: 'FTUE & Conversion' | 'Whale Sinks & Dev Products' | 'LiveOps & Urgency' | 'Pricing Psychology' | 'Premium EBP' | 'Social Proof';
  title: string;
  headline: string;
  advice: string;
  targetMetric: 'ARPDAU' | 'Conversion %' | 'ARPPU' | 'Retention D7';
  projectedLift: string;
  contextCondition: 'low_arpdau' | 'mid_arpdau' | 'high_arpdau' | 'low_conversion' | 'low_premium' | 'general';
  robloxCaseStudy: string;
  quickTakeaway: string;
}

export const MONETIZATION_TIPS_DATABASE: MonetizationTip[] = [
  {
    id: 'tip-starter-pack-29r',
    category: 'FTUE & Conversion',
    title: 'The 29 R$ Impulse Starter Bundle',
    headline: 'Break the first-purchase psychological barrier immediately',
    advice: 'Never price your starter pack above 49 R$. Over 70% of Roblox players are kids with leftover 30–50 R$ gift card balances. A 29 R$ bundle offering 5x value (e.g. starter pet + 500 coins + speed potion) breaks the zero-spender barrier and turns non-paying users into lifelong spenders.',
    targetMetric: 'Conversion %',
    projectedLift: '+40% Spender Conversion',
    contextCondition: 'low_conversion',
    robloxCaseStudy: 'Adopt Me & Pet Simulator: Both games prompt a sub-50 R$ starter egg upon completing the 3-minute tutorial.',
    quickTakeaway: 'First-time spenders are 4.3x more likely to purchase a second game pass within 14 days.'
  },
  {
    id: 'tip-weekend-liveops',
    category: 'LiveOps & Urgency',
    title: '48-Hour Weekend 2x Luck Event',
    headline: 'Concentrate 60% of weekly monetization into Friday–Sunday',
    advice: 'Schedule automated 2x Luck or 2x EXP events strictly from Friday 5PM to Sunday midnight GMT. When players know luck is doubled for a limited window, the perceived value of consumable potions and spins triples, causing massive spending spikes.',
    targetMetric: 'ARPDAU',
    projectedLift: '+25% to +35% Weekend ARPDAU',
    contextCondition: 'mid_arpdau',
    robloxCaseStudy: 'Blade Ball & Fisch: Friday update drops routinely double CCU and drive 65% of total weekly DevEx earnings.',
    quickTakeaway: 'Always place a real-time countdown timer billboard in the main spawn lobby.'
  },
  {
    id: 'tip-uncapped-whale-sinks',
    category: 'Whale Sinks & Dev Products',
    title: 'Uncapped Repeatable Developer Products',
    headline: 'Do not cap your store at permanent Game Passes',
    advice: 'Game Passes create a hard spending ceiling (e.g., a player buys all passes for 2,500 R$ and can never spend another Robux). Introduce repeatable Developer Products (Luck Potions, Crate Rolls, Weather Totems) so your top 1% whale players can spend 50,000+ R$.',
    targetMetric: 'ARPPU',
    projectedLift: '+50% Higher ARPPU from Whales',
    contextCondition: 'high_arpdau',
    robloxCaseStudy: 'Sol\'s RNG & Pet Simulator: Whales spend hundreds of thousands of Robux on repeatable speed rolls and server luck boosts.',
    quickTakeaway: 'The top 2% of players generate over 60% of total Roblox studio revenue.'
  },
  {
    id: 'tip-premium-ebp-afk',
    category: 'Premium EBP',
    title: 'AFK Time Rewards & Premium Multipliers',
    headline: 'Boost Roblox Engagement Payouts without charging Robux',
    advice: 'Roblox pays creators automatic fiat payouts (EBP) based on the session duration of Roblox Premium subscribers. Implement an AFK Chamber or continuous timed reward chest (5m, 15m, 30m, 60m) and grant Premium users 2x faster chest unlocks.',
    targetMetric: 'ARPDAU',
    projectedLift: '+15% Organic EBP Revenue',
    contextCondition: 'low_premium',
    robloxCaseStudy: 'Pls Donate & Blade Ball: Dedicated AFK zones incentivize players to leave their avatars online overnight, dramatically inflating EBP.',
    quickTakeaway: 'Roblox Premium payouts are pure profit with 0% marketplace fee deductions.'
  },
  {
    id: 'tip-decoy-pricing-anchors',
    category: 'Pricing Psychology',
    title: 'Three-Tier Decoy Pricing for Bundles',
    headline: 'Make the middle or top tier look like an undeniable bargain',
    advice: 'When selling currency or potions, offer 3 tiers: Small (1 Potion for 49 R$), Medium (3 Potions for 99 R$), and Mega (10 Potions for 199 R$ - "BEST VALUE"). Over 65% of paying players will skip the 49 R$ option and purchase the 199 R$ bundle because the per-unit discount feels irresistible.',
    targetMetric: 'ARPPU',
    projectedLift: '+22% Basket Size',
    contextCondition: 'mid_arpdau',
    robloxCaseStudy: 'Brookhaven & Blox Fruits: Currency shops visually highlight the highest tier with sparkling animated borders.',
    quickTakeaway: 'Display the strikethrough value (e.g., "Normally 490 R$ — NOW 199 R$ (60% OFF!)").'
  },
  {
    id: 'tip-loss-aversion-skips',
    category: 'FTUE & Conversion',
    title: 'Contextual Loss-Aversion Prompts',
    headline: 'Prompt micro-purchases only when frustration or stakes peak',
    advice: 'Never prompt game passes while a player is peacefully exploring. Trigger contextual purchase prompts when the player is invested in an outcome: upon falling at 85% of an obby, or failing a boss with 5% health remaining. Offer an Instant Revive or Stage Skip for 39 R$.',
    targetMetric: 'Conversion %',
    projectedLift: '+30% Impulse Conversion',
    contextCondition: 'low_arpdau',
    robloxCaseStudy: 'Tower of Hell: Generates massive daily Robux solely from 49 R$ floor skips and invulnerability coils prompted at death.',
    quickTakeaway: 'Emotion-driven impulse purchases convert 5x higher than passive storefront browsing.'
  },
  {
    id: 'tip-social-flex-chat',
    category: 'Social Proof',
    title: 'Public Chat & Aura Recognition for Spenders',
    headline: 'Leverage peer recognition to drive spontaneous purchases',
    advice: 'Give every Game Pass owner a visible perk: a glowing golden chat tag `[VIP]`, custom join sound effect, or overhead title. In multiplayer lobbies, non-paying players constantly see VIP status, triggering organic FOMO and aspirational spending.',
    targetMetric: 'Conversion %',
    projectedLift: '+18% Pass Adoption',
    contextCondition: 'general',
    robloxCaseStudy: 'Da Hood & Murder Mystery 2: Visual weapon trails and chat tags drive the entire cosmetic economy.',
    quickTakeaway: 'Roblox is fundamentally a social network; monetization works best when it enhances public status.'
  }
];
