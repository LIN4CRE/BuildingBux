export interface HitGameBlueprint {
  id: string;
  title: string;
  genre: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToBuild: string;
  popularityHook: string;
  coreMechanic: string;
  freeTechStack: string[];
  stepByStepBuild: string[];
  aiPrompt: string;
  monetizationAdvice: string;
}

export const HIT_GAMES_LIST: HitGameBlueprint[] = [
  {
    id: 'fisch',
    title: 'Fisch',
    genre: 'Exploration & Fishing Simulator',
    difficulty: 'Intermediate',
    timeToBuild: '2–3 Weeks',
    popularityHook: 'Chill atmospheric fishing + high-tension minigame reel bar + weather events + rare fish mutations.',
    coreMechanic: 'Cast line onto water volume (Raycast) -> fish bites after random delay -> UI bar balance minigame (keep slider within moving fish bracket) -> catch fish with weight & mutation stats -> sell at marina.',
    freeTechStack: [
      'ProfileService (Save player inventory, rods, and caught fish weights safely)',
      'TweenService & UserInputService (Smooth reel minigame UI movement)',
      'Roblox Free Water Terrain + Atmosphere Effects',
      'Free Fish 3D models from Kenney.nl or simple low-poly Blender models'
    ],
    stepByStepBuild: [
      '1. Create a simple tropical island surrounded by Roblox Smooth Water.',
      '2. Script a Fishing Rod tool with a cast animation using Animation Editor.',
      '3. When bobber touches water, start a random 3–8 second wait timer.',
      '4. Trigger a ScreenGui reel minigame: player must hold click to keep their progress bar over a fluctuating target.',
      '5. Award random fish based on biome loot tables (e.g. 70% Trout, 25% Salmon, 5% Golden Marlin).',
      '6. Add an NPC Merchant on the dock with a ProximityPrompt to sell fish for Coins.'
    ],
    aiPrompt: 'Write a complete Roblox Luau client-server fishing system. On tool activate, player casts a bobber using a Raycast into Terrain Water. After 3-6 seconds, trigger a Gui minigame where a target slider bounces between 0 and 1 using math.sin, and the player holds Left-Click to move their cursor. If the player stays within the target for 4 seconds, fire a RemoteEvent to server to award a fish with randomized weight and cash value.',
    monetizationAdvice: 'Sell Lucky Bait potions (Developer Products) and exotic Rod passes like "Enchanted Carbon Rod" or "Sonar Fish Radar".'
  },
  {
    id: 'steal-an-egg',
    title: 'Steal An Egg / Steal a Brainrot',
    genre: 'Social Base Heist & PvP Tug-of-War',
    difficulty: 'Beginner',
    timeToBuild: '1 Week',
    popularityHook: 'Hilarious social griefing, sneaking into someone\'s base, grabbing their prize, and sprinting while avoiding traps.',
    coreMechanic: 'Each player has a podium base with a prize egg/item. Players sneak into rival bases, hold E to steal, and must carry it back to their base without getting tagged or eliminated.',
    freeTechStack: [
      'ProximityPrompt (Interact with pedestals)',
      'CollectionService & Tagging (Managing base ownership and stealable items)',
      'ZonePlus (Detecting when a player enters/exits another player\'s private base)',
      'SoundService (Funny scream / alert SFX when an egg is stolen)'
    ],
    stepByStepBuild: [
      '1. Create 6 base plots arranged in a circle with a central arena.',
      '2. Assign each joining player their own base with a pedestal spawning an Egg or Brainrot Meme prop.',
      '3. Add a ProximityPrompt on the egg: holding E attaches the egg to the robber\'s back and reduces WalkSpeed by 20%.',
      '4. Trigger a loud server alarm: "[Player] stole [Victim]\'s Egg!"',
      '5. If the robber reaches their own base safely, deposit coins and add +1 Steal to leaderstats. If tagged/hit with a slap bat, drop the egg.'
    ],
    aiPrompt: 'Write a Roblox Luau script for a base-stealing game. Each player is assigned a Base plot on join. The base has an "Egg" model with a ProximityPrompt. When another player holds the prompt, weld the egg to their HumanoidRootPart, reduce WalkSpeed to 12, and emit an alarm. If they touch their own Base zone, delete the carried egg, award 100 Cash, and respawn the victim\'s egg after 15 seconds.',
    monetizationAdvice: 'Sell Laser Security Gates (GamePass), Speed Sneakers (+50% sprint while carrying), and Slap Gloves to knock thieves out.'
  },
  {
    id: 'blade-ball',
    title: 'Blade Ball',
    genre: 'Competitive Action Deflection Arena',
    difficulty: 'Intermediate',
    timeToBuild: '2 Weeks',
    popularityHook: 'Pure adrenaline reflex battle: a homing red ball accelerates toward a player, who must time their sword block to deflect it back.',
    coreMechanic: 'A Ball part continuously tracks and accelerates toward the targeted player. Player presses F or Left-Click within a deflection distance window to redirect it toward another random player at higher speed.',
    freeTechStack: [
      'BodyVelocity or AlignPosition (Homing ball physics)',
      'RunService.Heartbeat (Tracking ball distance to target player)',
      'UserInputService (Instant client deflection input)',
      'Free particle beams and neon clash sparks from Roblox Toolbox'
    ],
    stepByStepBuild: [
      '1. Create a circular enclosed combat arena with barrier walls.',
      '2. Spawn a glowing neon red sphere that picks a random player as target.',
      '3. In RunService.Heartbeat, interpolate the sphere\'s velocity directly towards target\'s HumanoidRootPart.',
      '4. If target activates sword block within 15 studs of the ball, deflect it, increment ball speed by 15%, and target a new alive player.',
      '5. If ball touches player without blocking, eliminate player and award tokens to the last deflector.'
    ],
    aiPrompt: 'Write a Roblox Luau script for a Blade Ball deflection mechanic. Spawn a Part representing the homing ball. In RunService.Heartbeat, lerp or steer the ball towards a target Player character at a speed that increases on every hit. When the targeted player presses Space or Click, check if the distance from character to ball is less than 15 studs; if true, play a clash particle, pick a new random target player, and increase speed by 10%. If ball touches the player without blocking, kill player with BreakJoints.',
    monetizationAdvice: 'Sell Sword Cosmetic Skins (crates/gacha), Custom Ability Cards (Teleport, Forcefield, Dash), and Finishers.'
  },
  {
    id: 'a-dusty-trip',
    title: 'a dusty trip / Build A Plane',
    genre: 'Survival Road Trip & Vehicle Assembly',
    difficulty: 'Intermediate',
    timeToBuild: '2–3 Weeks',
    popularityHook: 'Endless procedurally generated wasteland road trip with friends, fixing up a janky vehicle with scrap parts, gas, and coolant.',
    coreMechanic: 'Weld wheels, engine, and doors to a chassis frame. Pour gasoline into fuel tank using physics liquid cans. Drive along endless modular road chunks while dodging bandits and sandstorms.',
    freeTechStack: [
      'Roblox VehicleSeat + CylindricalConstraints / Springs (Physics suspension)',
      'WeldConstraint (Attaching scavenged doors, radiators, and engines)',
      'NumberValues (Fuel, Oil, Water coolant temperatures)',
      'Modular Road Chunk Spawner (Generates 500-stud desert road sections ahead of vehicle)'
    ],
    stepByStepBuild: [
      '1. Build a barebones car chassis with 4 wheels attached via CylindricalConstraints.',
      '2. Create interactive parts (Engine, Radiator, Wheels, Gas Can) that can be picked up with DragDetectors or Welds.',
      '3. Implement a fuel tank script: holding a Jerry Can over the tank transfers fuel liters.',
      '4. When sitting in VehicleSeat, vehicle only moves if Engine is installed, Fuel > 0, and Coolant is not empty.',
      '5. Script an infinite desert road generator that spawns new gas stations and abandoned huts every 1,000 studs.'
    ],
    aiPrompt: 'Create a Roblox Luau vehicle assembly and fluid system. A car model has slots for Engine, Radiator, and 4 Wheels. Scrap parts can be picked up with ProximityPrompts and snapped into place with WeldConstraints. A FuelCan tool has a liquid capacity (20L); pouring it into the FuelCap increases the car\'s Fuel value. The VehicleSeat script only activates Throttle if Fuel > 0, deducting 0.1L per second while driving.',
    monetizationAdvice: 'Sell Starter Jerry Cans, Emergency Radiator Coolant, Radio GamePass (custom boombox music), and armored vehicle bodykits.'
  },
  {
    id: 'blue-lock-rivals',
    title: 'Blue Lock: Rivals',
    genre: 'Anime Sports Combat & Football (Soccer)',
    difficulty: 'Advanced',
    timeToBuild: '3–4 Weeks',
    popularityHook: 'High-octane anime soccer with flashy special shot moves, flow state auras, slide tackles, and egoist rankings.',
    coreMechanic: 'Physics soccer ball with hitboxes. Players can dribble, pass, slide tackle, and build up an "Awakening Flow" gauge to unleash cinematic curve shots.',
    freeTechStack: [
      'Ball physics with AssemblyLinearVelocity (Curve and spin)',
      'Custom character animations made in Roblox Animation Editor',
      'FastCast or Raycast prediction for shot trajectory',
      'SoundService & ParticleEmitters for anime impact flashes'
    ],
    stepByStepBuild: [
      '1. Create a stadium pitch with 2 goal nets that detect when the ball part passes the goal line.',
      '2. When player character runs into ball, give player ball possession by lerping the ball in front of feet.',
      '3. Clicking triggers a Shoot meter: holding charges distance and velocity.',
      '4. Add special trait skills (Direct Shot, King\'s Dribble, Snake Slide) mapped to Q, E, R keys.',
      '5. Add an Ability Roll NPC in the lobby where players spin for traits with distinct rarity percentages.'
    ],
    aiPrompt: 'Write a Roblox Luau football ball-handling and curved shoot system. When a player touches a SoccerBall part, parent ownership to the player and update ball CFrame in RunService.RenderStepped directly 3 studs in front of the character. When user presses LeftClick, calculate a forward launch Vector3 with an upward curve using AssemblyLinearVelocity, and grant goal detection when ball hits a GoalBox Part.',
    monetizationAdvice: 'Sell Ability Trait Rerolls (Developer Products) and Custom Goal Celebration VFX / Anime Auras.'
  },
  {
    id: 'build-a-base-rng',
    title: 'Build a Base RNG / Sol\'s RNG Type',
    genre: 'Idle RNG & Base Expansion',
    difficulty: 'Beginner',
    timeToBuild: '1 Week',
    popularityHook: 'Hyper-satisfying spinning for 1 in 10,000,000 rare auras/trophies and displaying them on your custom tycoon base.',
    coreMechanic: 'Player clicks "ROLL". RNG rolls a random item based on weighted probability table (e.g. Common 1/2 to Celestial 1/1,000,000). Player crafts luck totems on their base to increase odds.',
    freeTechStack: [
      'math.random / Random.new() with weighted tables',
      'ParticleEmitter & BillboardGui (Aura visual effects)',
      'ProfileService (Saving unlocked auras and base plot)',
      'Camera Tweening for dramatic roll reveal sequences'
    ],
    stepByStepBuild: [
      '1. Define a Lua table with 20 tiers of Auras, their odds, and visual models.',
      '2. Create a "Roll" button on ScreenGui with a 3-second cooldown.',
      '3. When clicked, generate random number and evaluate through rarity array.',
      '4. Play dramatic screen shake and sound effect if player rolls rare item (> 1 in 1,000).',
      '5. Allow player to place pedestals on their plot to display their rarest auras to friends.'
    ],
    aiPrompt: 'Write a Roblox Luau RNG rolling engine. Define an array of Auras with Name, Odds (e.g. Common 1/2, Rare 1/10, Legendary 1/500, Galactic 1/100000), and Color. When client clicks Roll button, compute random roll on server with luck multiplier support. Return the won aura, equip neon particle effects onto character, and broadcast a global chat message if the aura rarity is higher than 1 in 10,000.',
    monetizationAdvice: 'Sell 2x Luck Potions (15 min), Auto-Roll GamePass, and Aura Storage Expansion passes.'
  },
  {
    id: 'grow-a-garden',
    title: 'Grow a Garden / Grow a Chicken Fighter',
    genre: 'Farming Tycoon & Pet Breeder / Battler',
    difficulty: 'Beginner',
    timeToBuild: '1–2 Weeks',
    popularityHook: 'Cozy planting seeds, watering crops, watching them physically grow, breeding fighter pets, and sending them into auto-battles.',
    coreMechanic: 'Plant seed in soil tile -> water timer -> plant model scales up -> harvest for fruits/eggs -> hatch eggs into rooster fighters -> send into arena dungeon.',
    freeTechStack: [
      'TweenService (Smooth plant growth scale from size 0.1 to 1.0)',
      'DataStoreService / ProfileService (Saving farm tile states & timers)',
      'ProximityPrompts (Planting, watering, and harvesting)',
      'Low poly crop models from Kenney.nl'
    ],
    stepByStepBuild: [
      '1. Create a 3x3 grid of dirt soil plots.',
      '2. Equip a "Carrot Seed" tool and click on soil to plant.',
      '3. Script a growth timer: plant model scales using TweenService over 45 seconds.',
      '4. Press E with a Water Can tool to cut growth time in half.',
      '5. Harvested crops are sold at the barn stall for Coins to buy Golden Chicken Eggs.',
      '6. Hatch chickens with randomized Attack, Speed, and Health stats for auto-arena battles.'
    ],
    aiPrompt: 'Write a Roblox Luau garden farming tile script. A DirtTile model has a ProximityPrompt. When player holds a Seed tool, plant it, setting growth Stage = 1. Using task.spawn, every 10 seconds scale the plant model CFrame/Size by 1.5x until Stage 4 (Mature). When mature, change prompt to "Harvest (+50 Coins)" and reset soil tile. Include support for watering can tool that doubles growth rate.',
    monetizationAdvice: 'Sell Auto-Waterer Sprinkler (GamePass), 2x Crop Value Multiplier, and Golden Egg Hatch booster.'
  },
  {
    id: 'merge-a-nuke',
    title: 'Merge a Nuke!',
    genre: 'Idle Incremental & 2048 Physics Merger',
    difficulty: 'Beginner',
    timeToBuild: '1 Week',
    popularityHook: 'Dropping explosive barrels that merge on collision into bigger bombs, culminating in firing a colossal nuke at target cities.',
    coreMechanic: 'Physics balls/bombs drop into a glass jar. When two identical Level 1 bombs touch, they fuse into a Level 2 bomb with a satisfying pop sound effect and particle burst.',
    freeTechStack: [
      'Touched event or Spatial Queries (Detecting identical bomb collisions)',
      'TweenService (Spawn pop animation)',
      'Roblox Free Explosion Instances + Camera Shake',
      'Simple low poly sphere / barrel meshes with numbered decals'
    ],
    stepByStepBuild: [
      '1. Build a transparent glass container with an open top.',
      '2. Player clicks or drags mouse along top beam to drop bombs.',
      '3. When Bomb A touches Bomb B with matching Level value, destroy both and spawn Bomb Level+1 with a visual pop.',
      '4. Award Uranium energy points per merge.',
      '5. Once the maximum "Tsar Bomba" is achieved, player triggers a launch cutscene that obliterates a target test dummy town for massive rebirth points.'
    ],
    aiPrompt: 'Write a Roblox Luau merge game script. When player clicks, drop a sphere bomb from top spawner. Each bomb has an IntValue "Level". Connect a Touched event: if two parts with the same Level touch, destroy one part, increment the other to Level+1, scale size by 1.25x, play a pop sound, and award Points = Level * 50 to the player leaderstats.',
    monetizationAdvice: 'Sell Bomb Shaker (agitates trapped bombs), Rainbow Wildcard Bomb (merges with anything), and 2x Energy pass.'
  },
  {
    id: 'muscle-legends',
    title: 'Muscle Legends',
    genre: 'Workout Simulator & Size-Scaling Brawler',
    difficulty: 'Beginner',
    timeToBuild: '1 Week',
    popularityHook: 'Clicking to lift dumbbells, watching your character avatar visibly grow into a gigantic muscular giant, and dominating the central fight pit.',
    coreMechanic: 'Clicking dumbbell tool increments Strength. Strength value scales character scale properties (BodyProportionScale, BodyDepthScale, BodyHeightScale). Rebirthing unlocks elemental stones and gym auras.',
    freeTechStack: [
      'Humanoid.BodyDepthScale / BodyHeightScale (Direct avatar size resizing)',
      'Roblox Animation Editor (Dumbbell curl animation)',
      'leaderstats (Strength, Agility, Gems, Rebirths)',
      'Safe zones with ForceFields where fighting is disabled'
    ],
    stepByStepBuild: [
      '1. Give player a starter 1lb Dumbbell tool.',
      '2. On Tool.Activated, play lifting animation, award +1 Strength to leaderstats.',
      '3. When Strength passes thresholds (100, 500, 2,500), update HumanoidDescription scale values to make avatar physically larger.',
      '4. Add Punch tool: deals damage equal to Strength * 0.1 to non-safezone players.',
      '5. Add Treadmills that increment Agility while walking on them.'
    ],
    aiPrompt: 'Write a complete Roblox Luau weight lifting simulator script. When player activates Dumbbell tool, play curl animation and add +2 Strength. Connect a leaderstat listener: every time Strength increases, update the player\'s character Humanoid scales (BodyHeightScale, BodyWidthScale, BodyDepthScale, HeadScale) proportionally up to a max 3x scale. In the center arena, allow players with Punch tool to deal damage based on their Strength stat.',
    monetizationAdvice: 'Sell 2x Strength GamePass, Auto-Lift (infinite clicks), +3 Pets Equipped, and Instant Rebirth packs.'
  },
  {
    id: 'murderers-vs-sheriffs',
    title: 'Murderers VS Sheriffs / Baddies',
    genre: 'Fast-Paced Round-Based Arena PvP',
    difficulty: 'Intermediate',
    timeToBuild: '2 Weeks',
    popularityHook: 'Instant-action deathmatch. Everyone has a knife and a revolver. Instant respawns, headshot dings, and knife throwing trickshots.',
    coreMechanic: 'Fast round resets or continuous FFA. Throwing knife has physical projectile arc. Revolver has hitscan raycasting. Player kills yield cash for knife/gun skins and kill effects.',
    freeTechStack: [
      'FastCast Redux (Bullet projectile raycasting with drop)',
      'RaycastParams (Hitbox validation on server)',
      'Custom Killfeed Gui & sound feedback (headshot ding)',
      'Free weapon models from Roblox Creator Store'
    ],
    stepByStepBuild: [
      '1. Create a compact city or warehouse map with cover boxes.',
      '2. Script a Raycast revolver: Left click fires a bullet trace ray; if it hits a humanoid, deal 100 damage (instant kill).',
      '3. Script a Throwing Knife: Right click throws knife with projectile physics.',
      '4. Display an on-screen kill counter and streak sound effect ("Double Kill", "Unstoppable").',
      '5. Add weapon case unboxing in the shop with animated skins.'
    ],
    aiPrompt: 'Write a Roblox Luau Server-Authoritative Gun & Knife script. Gun uses workspace:Raycast from camera to mouse position. Validate on server that player has line of sight and ammo. If raycast hits a character head, deal 150 damage, if torso 100 damage. Spawn bullet tracer beam from barrel to hit point. Knife can be thrown using an AlignOrientation / LinearVelocity projectile that sticks into walls or kills on contact.',
    monetizationAdvice: 'Sell Custom Knife Skins (Chroma, Neon, Flame), Kill Sound Effects, and Custom Footstep Trails.'
  }
];
