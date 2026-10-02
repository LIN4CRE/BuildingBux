export interface FreeResourceCategory {
  category: string;
  description: string;
  items: {
    name: string;
    url: string;
    type: 'Software' | 'Asset Pack' | 'Library' | 'Documentation' | 'Audio';
    cost: '100% Free' | 'Free Tier';
    description: string;
    whyYouNeedIt: string;
  }[];
}

export const FREE_CREATOR_RESOURCES: FreeResourceCategory[] = [
  {
    category: 'Essential Free Software & Engines',
    description: 'The core tools required to model, script, design UI, and edit sound without spending a penny.',
    items: [
      {
        name: 'Roblox Studio & Creator Hub',
        url: 'https://create.roblox.com',
        type: 'Software',
        cost: '100% Free',
        description: 'The official IDE and 3D game engine for creating and publishing Roblox experiences with built-in multiplayer server hosting.',
        whyYouNeedIt: 'You never pay for server hosting, cloud physics, or multiplayer networking. Roblox covers it all for free.'
      },
      {
        name: 'Blender 3D',
        url: 'https://www.blender.org',
        type: 'Software',
        cost: '100% Free',
        description: 'Open-source 3D modeling, sculpting, and rigging software. Industry standard for making Roblox pets, swords, and vehicles.',
        whyYouNeedIt: 'Export .FBX or .OBJ files directly into Roblox Studio as MeshParts with smooth shading.'
      },
      {
        name: 'Photopea (Free Photoshop Alternative)',
        url: 'https://www.photopea.com',
        type: 'Software',
        cost: '100% Free',
        description: 'Full-featured web-based image editor that runs in your browser and opens/saves .PSD files.',
        whyYouNeedIt: 'Design game icons, thumbnails, game pass badges, and UI buttons with drop shadows and gradients.'
      },
      {
        name: 'Audacity',
        url: 'https://www.audacityteam.org',
        type: 'Software',
        cost: '100% Free',
        description: 'Free, open-source multi-track audio editor and recorder.',
        whyYouNeedIt: 'Trim and normalize sound effects (pops, clinks, engine sounds) before uploading to Roblox.'
      }
    ]
  },
  {
    category: 'Free Open-Source Luau Game Libraries (GitHub)',
    description: 'Battle-tested frameworks used by top front-page games to handle saving, guns, and zones.',
    items: [
      {
        name: 'ProfileService (by loleris)',
        url: 'https://github.com/MadStudioRoblox/ProfileService',
        type: 'Library',
        cost: '100% Free',
        description: 'Universal standard for Roblox DataStores. Features session-locking to prevent item duplication bugs and rollbacks.',
        whyYouNeedIt: 'Never lose player data when servers crash. 90% of top simulator and RPG games use ProfileService.'
      },
      {
        name: 'ZonePlus (by Nanoblox)',
        url: 'https://github.com/1ForeverHD/ZonePlus',
        type: 'Library',
        cost: '100% Free',
        description: 'Optimized spatial region manager that detects when players enter or leave irregular 3D zones.',
        whyYouNeedIt: 'Crucial for Steal an Egg bases, safe zones, VIP rooms, and fishing water bodies.'
      },
      {
        name: 'FastCast Redux (by EtiTheSpirit)',
        url: 'https://github.com/XanTheAntiCheat/FastCastRedux',
        type: 'Library',
        cost: '100% Free',
        description: 'Advanced projectile physics library with bullet drop, piercing, and hit detection.',
        whyYouNeedIt: 'The absolute standard for Murderers VS Sheriffs, guns, bows, and throwing knives.'
      },
      {
        name: 'SimplePath (by Vocksel)',
        url: 'https://github.com/Vocksel/SimplePath',
        type: 'Library',
        cost: '100% Free',
        description: 'PathfindingService wrapper that handles obstacle avoidance, jumping, and AI tracking.',
        whyYouNeedIt: 'Essential for enemy zombies, bandit mobs, pet following, and automated bots.'
      }
    ]
  },
  {
    category: 'Free 3D Models, Textures & Audio Assets',
    description: 'Commercially licensed 100% free assets (CC0 / Public Domain) that you can legally use.',
    items: [
      {
        name: 'Kenney.nl (Asset Jesus)',
        url: 'https://kenney.nl/assets',
        type: 'Asset Pack',
        cost: '100% Free',
        description: 'Thousands of high-quality low-poly 3D models: cars, weapons, fish, animals, UI icons, and sounds.',
        whyYouNeedIt: '100% public domain (CC0). No attribution required. Perfect for Fisch, Tycoons, and Obbies.'
      },
      {
        name: 'Quaternius Game Assets',
        url: 'https://quaternius.com',
        type: 'Asset Pack',
        cost: '100% Free',
        description: 'Huge library of modular modular low-poly rigged characters, vehicles, weapons, and anime props.',
        whyYouNeedIt: 'All assets are CC0 free. Great for vehicles (a dusty trip) and fighters (Chicken Fighter).'
      },
      {
        name: 'Roblox Creator Store (Audio & APM Music)',
        url: 'https://create.roblox.com/store/audio',
        type: 'Audio',
        cost: '100% Free',
        description: 'Roblox\'s built-in library of over 100,000 professionally licensed sound effects and APM music tracks.',
        whyYouNeedIt: 'Guaranteed 100% safe from copyright strikes. Free to use in any Roblox experience.'
      },
      {
        name: 'Freesound.org',
        url: 'https://freesound.org',
        type: 'Audio',
        cost: '100% Free',
        description: 'Colossal collaborative database of creative commons sound effects (explosions, footsteps, coin jingles).',
        whyYouNeedIt: 'Find unique punch, slash, pop, or engine sounds for your custom mechanics.'
      }
    ]
  }
];

export interface StepByStepLaunchPhase {
  step: string;
  title: string;
  duration: string;
  objective: string;
  actionItems: string[];
  freeToolsUsed: string[];
  keySecret: string;
}

export const STEP_BY_STEP_PUBLISH_ROADMAP: StepByStepLaunchPhase[] = [
  {
    step: '01',
    title: 'Install & Setup Roblox Studio (Cost: £0.00)',
    duration: 'Day 1',
    objective: 'Download Roblox Studio, set up your development environment, and configure API access.',
    actionItems: [
      'Download Roblox Studio from create.roblox.com (100% free).',
      'Open the "Baseplate" or "Flat Terrain" template.',
      'Enable "Explorer" and "Properties" under the View tab.',
      'Save your game to Roblox Cloud: File > Publish to Roblox As... (creates your cloud place for free).',
      'Go to Game Settings > Security > Enable "Studio Access to API Services" so DataStores work.'
    ],
    freeToolsUsed: ['Roblox Studio', 'Roblox Creator Dashboard'],
    keySecret: 'Publishing to the cloud immediately unlocks auto-backups and allows you to test on your phone with the Roblox app.'
  },
  {
    step: '02',
    title: 'Build the Core Loop Prototype in 48 Hours',
    duration: 'Days 2–3',
    objective: 'Create the minimum playable mechanic before adding menus or polishing graphics.',
    actionItems: [
      'Pick 1 mechanic from the hit games list (e.g., Fishing reel, Stealing pedestal, Muscle dumbbells).',
      'Use simple placeholder blocks (gray cubes, spheres) for parts.',
      'Write the single Server Script that awards points/leaderstats when the action happens.',
      'Test the loop yourself: Does clicking or interacting feel satisfying for 5 minutes straight?'
    ],
    freeToolsUsed: ['Roblox Studio Built-in Parts', 'Roblox Luau Scripting'],
    keySecret: 'Never spend 3 weeks building a massive map first. If the 30-second core loop is boring, a fancy map won\'t save it.'
  },
  {
    step: '03',
    title: 'Bulletproof Data Saving with ProfileService',
    duration: 'Day 4',
    objective: 'Ensure player levels, coins, tools, and high scores save permanently without data loss.',
    actionItems: [
      'Download the free ProfileService.lua module from GitHub.',
      'Place ProfileService inside ServerScriptService.',
      'Create a DataManager script that loads player profile on PlayerAdded and releases it on PlayerRemoving.',
      'Test auto-saving by rejoing in Studio test mode.'
    ],
    freeToolsUsed: ['ProfileService (GitHub, MIT License)'],
    keySecret: 'Data loss is the #1 reason new games get flooded with 1-star dislikes. ProfileService prevents 99.9% of save corruptions.'
  },
  {
    step: '04',
    title: 'Sleek UI, Sound Feedback & Game Feel',
    duration: 'Day 5',
    objective: 'Make every action feel juicy with sound effects, particle sparkles, and clean UI.',
    actionItems: [
      'Create UI buttons with rounded corners (UICorner) and subtle borders (UIStroke).',
      'Add free click and success sounds from Roblox Audio Library (Search "Coin", "Pop", "Success").',
      'Add TweenService effects: make numbers pop (+10!) and float upwards when rewarded.',
      'Test on Roblox Device Emulator on mobile phone resolution (iPhone 11).'
    ],
    freeToolsUsed: ['Photopea (Free UI)', 'Roblox APM Audio Store'],
    keySecret: 'Sound effects and visual pop-ups trigger dopamine. Players stay 3x longer in games with great auditory feedback.'
  },
  {
    step: '05',
    title: 'Hook Up Monetization (Passes & Dev Products)',
    duration: 'Day 6',
    objective: 'Add your store catalog so players can spend Robux from day one.',
    actionItems: [
      'In Creator Hub > Passes, create 3 Game Passes (e.g. VIP Club 299 R$, 2x Cash 399 R$, Speed +50% 99 R$).',
      'Create 2 Developer Products (e.g. 500 Coins Pouch 39 R$, 15-Min Potion 49 R$).',
      'Paste the MarketplaceService.ProcessReceipt script from BloxMonetize Luau Generator into ServerScriptService.',
      'Link GUI buttons to prompt the purchases using MarketplaceService:PromptGamePassPurchase.'
    ],
    freeToolsUsed: ['BloxMonetize Luau Generator', 'Roblox Creator Store'],
    keySecret: 'Always include a 99 R$ impulse pass. Once a player makes their first purchase, they are 5x more likely to buy again.'
  },
  {
    step: '06',
    title: 'Publish Publicly & Free Organic TikTok / YouTube Growth',
    duration: 'Day 7',
    objective: 'Launch your game to the public and drive your first 100 concurrent players without ad spend.',
    actionItems: [
      'In Game Settings, set Experience Privacy to "Public".',
      'Design a vibrant thumbnail (1920x1080) and icon (512x512) on Photopea featuring high contrast and bright colors.',
      'Record a 15-second exciting gameplay clip with OBS Studio (Free) or phone screen recorder.',
      'Post on TikTok / YouTube Shorts with a catchy hook: "I made a game where you can steal brainrot eggs from your friends..."',
      'Invite 5 friends to play simultaneously: having 5-10 CCU kicks the Roblox discovery algorithm into gear!'
    ],
    freeToolsUsed: ['Photopea', 'OBS Studio (Free recorder)', 'TikTok / YouTube Shorts'],
    keySecret: 'Roblox\'s algorithm promotes games that have high Average Session Time (>12 minutes). Optimize retention to get free front-page impressions.'
  }
];
