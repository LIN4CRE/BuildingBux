export interface GuidePhase {
  id: string;
  stepNumber: string;
  title: string;
  summary: string;
  duration: string;
  keyTactics: string[];
  deepDive: {
    heading: string;
    content: string;
    proTip: string;
    pitfallToAvoid: string;
  }[];
}

export const GUIDE_PHASES: GuidePhase[] = [
  {
    id: 'phase-concept',
    stepNumber: '01',
    title: 'Market Positioning & The High-Retention Loop',
    summary: 'Why 95% of Roblox games make zero Robux and how to build a game designed for organic algorithm distribution and compulsive spending.',
    duration: 'Week 1-2',
    keyTactics: [
      'Target established search intent genres (Simulators, Tycoons, Obbies, Roguelites)',
      'Design the 30-second Core Loop before placing a single 3D brick',
      'Optimize for Session Length (Average Playtime > 14 minutes)',
      'Engineer Day-1 and Day-7 retention hooks into the save file'
    ],
    deepDive: [
      {
        heading: 'The Core Psychological Loop: Trigger -> Action -> Reward -> Reinvestment',
        content: 'Roblox players spend money when they hit engineered friction that they want to bypass, or when they want to flex on others in a social space. If your game has no social visibility (e.g. a solo game where nobody sees your pets or weapon skins), spending drops by 70%. Ensure players are constantly in a shared server where rare items trigger server-wide announcements or distinctive glowing particle auras.',
        proTip: 'Always broadcast high-tier achievements to the server: "[Player] just unlocked MYTHIC Nebula Pet (0.1% chance)!" This triggers social proof and prompts onlookers to open eggs.',
        pitfallToAvoid: 'Never make your game completely unplayable without paying. Aggressive paywalls cause players to leave within 2 minutes, ruining your algorithmic retention score.'
      },
      {
        heading: 'Mobile & Tablet First: The 75% Rule',
        content: 'Over 70% of Roblox player sessions occur on mobile phones and tablets (iPad, iPhone, Android). If your UI buttons are tiny, your controls are awkward, or your game pass shop requires dragging on mobile, you lose the majority of spending. Build large touch targets (minimum 44x44px) and test thumb navigation thoroughly.',
        proTip: 'Use Roblox Studio Device Emulator daily. Test on iPhone 11 and iPad resolution before committing code.',
        pitfallToAvoid: 'Using keyboard-only keybinds (E to interact, Q to dash) without providing prominent on-screen touch buttons for mobile users.'
      }
    ]
  },
  {
    id: 'phase-gamepasses',
    stepNumber: '02',
    title: 'Game Passes: Permanent Perks & The 3-Tier Anchor Strategy',
    summary: 'How to price permanent game passes so players gladly open their wallets on their first session.',
    duration: 'Week 3',
    keyTactics: [
      'The Anchor Pricing Rule: High (999 R$), Middle (399 R$), Low Impulse (99 R$)',
      'Convenience & Speed over Overpowered Combat',
      'The "Starter Pack" Effect (Converting a non-payer to a payer)',
      'Social Recognition Perks (Chat tags, unique trails, VIP lounge)'
    ],
    deepDive: [
      {
        heading: 'The 3-Tier Pricing Model',
        content: 'Tier 1 (Impulse: 25 - 99 Robux): Walkspeed +50%, Starter Bag, Neon Trail. Young players with leftover Robux will spend this without hesitation.\n\nTier 2 (Core Value: 199 - 499 Robux): Auto-Hatch, 2x Coins, VIP Membership. This should be the workhorse that provides 50% of your game pass volume.\n\nTier 3 (Prestige / Whale: 799 - 1,999 Robux): 2x Luck, +4 Pet Equips, Private Jet/Teleport. High-margin product that gives high-spending players the ultimate advantage.',
        proTip: 'Offer a "VIP Pass" that bundles 3 small perks (tag + trail + 20% bonus). Bundles have 40% higher perceived value than individual items.',
        pitfallToAvoid: 'Do not price your first game pass above 500 Robux. A player who has never spent in your game will rarely spend £5 on their very first transaction.'
      }
    ]
  },
  {
    id: 'phase-devproducts',
    stepNumber: '03',
    title: 'Developer Products: The Engine of Repeat & Whale Revenue',
    summary: 'Game Passes can only be bought once. Top games generate 75% of their total Robux through repeatable Developer Products.',
    duration: 'Week 4',
    keyTactics: [
      'Consumable Boosts (15-min 2x Luck, 30-min 2x Speed)',
      'Multi-Tier Currency Packs with "Best Value +25%" anchors',
      'Friction Relief: Instant Revive & Stage Skips',
      'Roblox TOS-Compliant Gacha & Drop Rate Disclosures'
    ],
    deepDive: [
      {
        heading: 'Why Whales Drive 60% of Roblox Game Profits',
        content: 'A "whale" is a player who spends 5,000 to 50,000+ Robux in your experience. Because a game pass is a single purchase, a whale who buys all your passes might only spend 2,000 Robux total. By offering repeatable Developer Products—such as Currency Vaults, Ability Spins, or Server Boosters—there is no artificial ceiling on how much an enthusiastic fan can spend.',
        proTip: 'Implement "Server Boosters" (e.g. 150 Robux to activate 2x Coins for everyone in the server for 20 minutes). When one player activates it, everyone in the chat thanks them, providing massive emotional reinforcement to buy it again.',
        pitfallToAvoid: 'Failing to disclose randomized odds. Roblox terms of service explicitly mandate that any paid randomized prize (eggs, crates, spins) must display exact percentage chances in the UI.'
      }
    ]
  },
  {
    id: 'phase-recurring',
    stepNumber: '04',
    title: 'Recurring Revenue: Subscriptions, Premium Payouts & Battle Passes',
    summary: 'Moving beyond one-off transactions into reliable monthly recurring Robux streams that compound over time.',
    duration: 'Week 5',
    keyTactics: [
      'In-Experience Subscriptions (Monthly auto-renewing Robux billing)',
      'Maximizing Roblox Premium Payouts (Passive playtime monetization)',
      '30-Day Battle Pass seasons with Free and Premium tiers',
      'Daily Streak multi-tiered reward escalators'
    ],
    deepDive: [
      {
        heading: 'Roblox Premium Payouts: Free Robux While You Sleep',
        content: 'Roblox automatically distributes a portion of subscription revenue to developers whose games are played by Roblox Premium subscribers. You do NOT have to sell anything to earn this. If a Premium user spends 3 hours in your game, Roblox calculates their engagement time and credits earned Robux to your pending balance automatically.',
        proTip: 'Add special perks for Premium players (e.g., "[Premium] +20% Coins & Exclusive Pet") to double their average playtime and skyrocket your Premium Payouts.',
        pitfallToAvoid: 'Ignoring AFK (Away From Keyboard) features. Games that allow safe AFK grinding or sleep farming generate millions of Premium Payout hours.'
      },
      {
        heading: 'In-Experience Subscriptions (Roblox Creator Feature)',
        content: 'Roblox now natively supports recurring auto-renewing subscriptions paid in real fiat currency or recurring Robux. Creators can offer a monthly membership (e.g., £2.99 / month or 350 Robux / month) that automatically renews until cancelled. This creates predictable monthly revenue like a SaaS business.',
        proTip: 'Give subscribers a recurring monthly bundle of in-game currency on the 1st of every month plus exclusive cosmetics.',
        pitfallToAvoid: 'Locking core gameplay behind a subscription. Subscriptions should offer cosmetic status, convenience, and passive currency drips, not wall off the main game.'
      }
    ]
  },
  {
    id: 'phase-devex',
    stepNumber: '05',
    title: 'The DevEx (Developer Exchange) Formula & Cashout Process',
    summary: 'The exact mathematics, rules, and step-by-step pipeline to convert virtual Robux into British Pounds (£ GBP) deposited in your UK bank.',
    duration: 'Ongoing',
    keyTactics: [
      'Understand the fixed DevEx conversion rate: $0.0035 USD per 1 Earned Robux',
      'Meet the 30,000 Robux minimum cashout threshold ($105 USD / ~£82 GBP)',
      'Ensure Robux is categorized as "Earned Robux" (Sales & Premium Payouts only)',
      'Tipalti account registration & identity verification'
    ],
    deepDive: [
      {
        heading: 'The Full Robux-to-£ Financial Pipeline',
        content: '1. Player spends 100 Robux in your experience.\n2. Roblox Marketplace Fee (30%): You receive 70 Net Earned Robux.\n3. Robux Escrow Hold: Robux sits in "Pending Sales" for 3 to 7 days for fraud prevention.\n4. DevEx Submission: Once you reach at least 30,000 Earned Robux, you submit a DevEx request via the Roblox Creator Hub.\n5. USD Conversion: Roblox calculates payout at $0.0035 USD per Robux (30,000 R$ = $105 USD; 1,000,000 R$ = $3,500 USD).\n6. Tipalti Transfer to UK: Tipalti converts USD to British Pounds (£ GBP) and wires directly to your UK bank account (Sort Code + Account Number) or PayPal.',
        proTip: 'Always choose Direct Bank Deposit (Wire / ACH) in Tipalti rather than PayPal to save on PayPal\'s high 3-4% foreign exchange conversion markup.',
        pitfallToAvoid: 'Never attempt to DevEx Robux acquired through trading limited items, purchasing on the website, or group funds transferred without proof of game sales. Roblox audit teams review every transaction history before approval; unearned Robux requests will be rejected.'
      }
    ]
  },
  {
    id: 'phase-uktax',
    stepNumber: '06',
    title: 'UK Tax Compliance, HMRC & Form W-8BEN',
    summary: 'How to legally claim 0% US withholding tax via the US-UK Treaty and declare DevEx earnings to HMRC as a UK creator.',
    duration: 'At First Cashout',
    keyTactics: [
      'Complete IRS Form W-8BEN on Tipalti (US-UK Tax Treaty Article 12)',
      'Claim 0% US Withholding Tax (Save 30% of your earnings!)',
      'HMRC £1,000 UK Trading Allowance',
      'Registering as a Sole Trader with HMRC if earning over £1,000 / year'
    ],
    deepDive: [
      {
        heading: 'Form W-8BEN: How to Avoid Losing 30% to the US IRS',
        content: 'Because Roblox is a US corporation (San Mateo, California), US law requires a 30% foreign withholding tax on international payouts UNLESS your country has an active tax treaty. The United Kingdom and the United States have a comprehensive Double Taxation Treaty. In Tipalti, you will fill out the digital Form W-8BEN. In Part II (Claim of Tax Treaty Benefits), cite Article 12 (Royalties / Digital Services), which reduces the US withholding tax rate from 30% down to 0%!\n\nThis means Roblox sends 100% of your earnings to your UK bank without any US deduction.',
        proTip: 'Have your UK National Insurance (NI) Number ready. It serves as your Foreign Tax Identifying Number (FTIN) on Form W-8BEN.',
        pitfallToAvoid: 'Leaving the Treaty Benefits section blank on W-8BEN. If you do not claim the treaty, 30% of your payout is automatically deducted and sent to the US government.'
      },
      {
        heading: 'HMRC & UK Self Assessment for Roblox Developers',
        content: 'In the United Kingdom:\n- Trading Allowance: You can earn up to £1,000 per tax year tax-free without needing to report it to HMRC.\n- Over £1,000/year: You must register for Self Assessment with HMRC as a Sole Trader (or Ltd company if making large sums).\n- Allowable Expenses: You can deduct legitimate game development costs from your taxable profit: computer hardware, monitor, Adobe/Blender subscriptions, sound effect licenses, Roblox Ads spend, and home office utility allowance.',
        proTip: 'Open a dedicated separate UK bank account (e.g. Monzo, Starling, or high-street bank) just for your Roblox DevEx deposits to keep accounting clean and stress-free.',
        pitfallToAvoid: 'Failing to track your exchange dates. Keep records of the exact GBP amount deposited on the day of payment for your annual tax return.'
      }
    ]
  }
];
