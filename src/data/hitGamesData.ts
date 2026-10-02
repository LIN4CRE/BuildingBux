export interface PromptSections {
  roleAndContext: string;
  architecture: string;
  coreMechanic: string;
  securityAndNetworking: string;
  codeContract: string;
}

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
  promptSections: PromptSections;
  aiPrompt: string; // Pre-compiled 5-section string
  monetizationAdvice: string;
}

export function format5SectionPrompt(sections: PromptSections, title: string): string {
  return `### SECTION 1: ROLE & SYSTEM OBJECTIVE
${sections.roleAndContext}

### SECTION 2: SYSTEM ARCHITECTURE & ROBLOX STUDIO PLACEMENT
${sections.architecture}

### SECTION 3: CORE GAMEPLAY MECHANICS & MATHEMATICAL RULES
${sections.coreMechanic}

### SECTION 4: NETWORKING & SERVER-AUTHORITATIVE ANTI-EXPLOIT SECURITY
${sections.securityAndNetworking}

### SECTION 5: COMPLETE LUAU CODE IMPLEMENTATION CONTRACT
${sections.codeContract}`;
}

const rawGames: Array<Omit<HitGameBlueprint, 'aiPrompt'>> = [
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
    promptSections: {
      roleAndContext: 'You are a Principal Roblox Luau Systems Architect. Build a complete, production-ready, client-server fishing system inspired by "Fisch" with fluid cast raycasting, high-tension reel minigame, randomized weight & mutation roll tables, and persistent data storage.',
      architecture: `1. ReplicatedStorage.FishingEvents:
   - RemoteEvent "CastBobber" (Client -> Server)
   - RemoteEvent "StartReelMinigame" (Server -> Client)
   - RemoteEvent "MinigameFinished" (Client -> Server)
   - RemoteFunction "SellFishAtMerchant" (Client -> Server)
2. ServerScriptService.FishingManager (Server Script)
3. StarterPlayer.StarterPlayerScripts.FishingUIController (LocalScript)
4. StarterGui.FishingGui (Reel Bar ScreenGui with TargetBracket and PlayerSlider frames)`,
      coreMechanic: `1. Tool Cast: Player activates Fishing Rod. Raycast from camera to terrain checks for Enum.Material.Water. If water is detected, spawn a bobber part connected to rod tip via RopeConstraint.
2. Bite Timer: Server task.delay(math.random(3, 7)) triggers fish bite alert.
3. Reel Minigame: A Target bracket oscillates between 0 and 1 along the Y-axis using math.sin(os.clock() * speed). Player holds Left-Click to raise their bar; releasing lets gravity pull it down. Player must keep their bar overlapping the target for 4.0 cumulative seconds.
4. Catch Loot Generation: Roll on weighted fish table: Common (60%), Rare (30%), Mythic (9%), Cosmic (1%). Generate random Weight (kg) = BaseWeight * math.random(80, 180)/100, and 5% chance of "Shiny" or "Abyssal" mutation multiplier.`,
      securityAndNetworking: `1. Server verifies player position is within 25 studs of the cast origin to stop teleport casting.
2. The server measures the exact elapsed time between StartReelMinigame and MinigameFinished. If client returns success faster than 3.5 seconds, reject and flag invalid.
3. All fish rewards, coin leaderstat increments, and inventory updates occur strictly on the Server with pcall.`,
      codeContract: `Provide complete, working, strict Luau code (--!strict):
1. Complete ServerScriptService.FishingManager script.
2. Complete StarterPlayerScripts.FishingUIController script.
Include full type annotations, event listeners, and leaderstats (Coins, TotalCaught). Do not omit functions or use placeholder comments.`
    },
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
    promptSections: {
      roleAndContext: 'You are a Senior Roblox Studio Game Engineer. Build an authoritative multiplayer base-heist system inspired by "Steal An Egg" where players sneak into rival territory, steal physical eggs, and carry them home under movement penalties.',
      architecture: `1. Workspace.BasePlots: Array of 6 Model plots, each containing "Pedestal" (Part with ProximityPrompt), "SpawnZone" (Part), and "EggModel".
2. ServerScriptService.BasePlotManager (Server Script)
3. ReplicatedStorage.HeistEvents:
   - RemoteEvent "AlarmTriggered" (Server -> All Clients)
   - RemoteEvent "EggBanked" (Server -> All Clients)
4. StarterPlayer.StarterCharacterScripts.CarryingDebuff (LocalScript)`,
      coreMechanic: `1. Base Claiming: On PlayerAdded, assign the player to the nearest available BasePlot and set ObjectValue PlotOwner = player.
2. Stealing: When a rival player activates the Pedestal ProximityPrompt (HoldDuration = 1.5s), create a WeldConstraint attaching the EggModel to their HumanoidRootPart at Vector3.new(0, 0, -1.5).
3. Debuff: Reduce robber WalkSpeed from 16 to 11 and prevent jumping.
4. Banking: Connect Touched event on the robber's home BasePlot SpawnZone. If the carried egg touches their own base, destroy the carried egg, award +100 Cash & +1 Steal to leaderstats, and respawn the victim's egg after 15 seconds.
5. Slap Tagging: If the robber takes damage or is slapped, un-weld the egg and drop it to the ground.`,
      securityAndNetworking: `1. Validate that the player interacting with the ProximityPrompt is NOT the owner of that base.
2. Confirm distance between player and pedestal is <= 10 studs on server before granting weld.
3. Prevent players from depositing stolen eggs in bases they do not own.`,
      codeContract: `Provide complete, strict Luau (--!strict) code for ServerScriptService.BasePlotManager with automatic base claiming, weld handling, alarm announcements, and leaderstats setup. No placeholders.`
    },
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
    promptSections: {
      roleAndContext: 'You are an Expert Combat Systems Developer in Roblox Luau. Engineer a high-frequency Blade Ball deflection mechanics engine with smooth client-side interpolation and rock-solid server-authoritative collision resolution.',
      architecture: `1. Workspace.BladeBallArena: Circular arena with barrier collision walls.
2. ServerScriptService.BladeBallServer (Server Script)
3. ReplicatedStorage.BallRemotes:
   - RemoteEvent "BlockAttempt" (Client -> Server)
   - RemoteEvent "BallTargetChanged" (Server -> All Clients)
   - RemoteEvent "ClashEffect" (Server -> All Clients)
4. StarterPlayer.StarterPlayerScripts.BladeBallClient (LocalScript with F / Left-Click keybindings)`,
      coreMechanic: `1. Spawning: Arena spawns a glowing neon red sphere (AssemblyLinearVelocity physics). Target is assigned to a random alive player in the arena.
2. Homing Loop: In RunService.Heartbeat, calculate direction = (targetRoot.Position - ball.Position).Unit. Apply linear velocity at BaseSpeed (starts at 35 studs/s).
3. Deflection Timing: When target presses F or Click, client fires "BlockAttempt". Server verifies ball distance <= 18 studs from target. If valid, pick a new random alive target (excluding current), increment Speed by 12%, play clash sound/particles, and update target highlight.
4. Elimination: If distance <= 3 studs and target did not block, call Humanoid:TakeDamage(1000) or BreakJoints(). The last player who successfully deflected receives +1 Win and +50 Gems.`,
      securityAndNetworking: `1. Server maintains authoritative ownership of the ball velocity and target player.
2. Clients cannot redirect the ball to an arbitrary player; the server selects the next target.
3. Server enforces a 0.6s cooldown on block attempts to prevent spam-blocking autoclickers.`,
      codeContract: `Provide fully typed (--!strict) production scripts for ServerScriptService.BladeBallServer and StarterPlayerScripts.BladeBallClient with complete target rotation, alive player arrays, and clash animations.`
    },
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
    promptSections: {
      roleAndContext: 'You are a Senior Roblox Vehicle Physics & Gameplay Engineer. Create a modular vehicle assembly, fluid mechanics, and procedural road streaming system modeled after "a dusty trip".',
      architecture: `1. Workspace.CarModel: Chassis model with VehicleSeat, 4 WheelHub snap attachments, EngineBay snap attachment, Radiator snap attachment, and FuelTank NumberValue (0-50L).
2. ServerScriptService.CarAssemblyEngine (Server Script)
3. ServerScriptService.RoadStreamer (Server Script)
4. ReplicatedStorage.VehicleEvents.PourFluid (RemoteEvent)
5. StarterPack.FuelCanTool (Tool with liquid level logic)`,
      coreMechanic: `1. Snap Assembly: Parts tagged "CarPart" (Engine, Radiator, Wheel) have ProximityPrompts. When brought near matching chassis attachment (<= 4 studs), weld with WeldConstraint and set installed status = true.
2. Fluid Dynamics: FuelCan tool contains 20.0 Liters. Pouring into FuelCap part increments tank fuel and decrements can volume at 2.0 L/sec with sound effect.
3. Drivetrain Loop: VehicleSeat only enables Throttle/Steer if EngineInstalled == true, RadiatorInstalled == true, and Fuel > 0. Every second of driving consumes 0.15L Fuel and generates +1.2°C Radiator Heat. If heat exceeds 110°C without Coolant, the engine stalls with smoke particles.
4. Procedural Road: RoadStreamer continuously monitors car position and clones 500-stud asphalt wasteland chunks 2,000 studs ahead, despawning distant chunks behind to preserve memory.`,
      securityAndNetworking: `1. All fluid volumes and part attachments are verified on the server.
2. Sitting in VehicleSeat uses standard Roblox network ownership: vehicle:SetNetworkOwner(driver).
3. Parts dropped by exploiters outside the map boundaries are clamped and respawned.`,
      codeContract: `Provide clean, modular, typed Luau scripts for CarAssemblyEngine and FluidSystem handling snap-welds, fluid pouring, and vehicle drivetrain throttling.`
    },
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
    promptSections: {
      roleAndContext: 'You are an Elite Roblox Combat & Sports Gameplay Programmer. Build an anime-style football ball possession, curved kick, and trait ability framework inspired by "Blue Lock: Rivals".',
      architecture: `1. Workspace.Stadium: Pitch model, LeftGoalPart, RightGoalPart, and SoccerBall (AssemblyLinearVelocity sphere).
2. ServerScriptService.SoccerMatchManager (Server Script)
3. ReplicatedStorage.BallEvents:
   - RemoteEvent "ShootBall" (Client -> Server: ChargePower, CurveDirection)
   - RemoteEvent "UseTraitAbility" (Client -> Server: TraitName)
   - RemoteEvent "GoalScored" (Server -> All Clients)
4. StarterPlayer.StarterCharacterScripts.BallDribbleController (LocalScript)`,
      coreMechanic: `1. Dribble Attachment: When a player's character touches the SoccerBall, set possession. In client RenderStepped, lerp ball CFrame to Character.HumanoidRootPart.CFrame * CFrame.new(0, -1.8, -2.5).
2. Charged Curve Kick: Holding Left Click fills ShotPower from 0 to 100 over 1.2s. On release, calculate impulse Vector3 = LookVector * (ShotPower * 1.5) + Vector3.new(0, ShotPower * 0.4, 0). Add lateral spin curve force using AssemblyAngularVelocity.
3. Goal Detection: Touched event on LeftGoalPart / RightGoalPart verifies ball entry, awards +1 Goal to leaderstats, plays anime stadium horn, and resets ball to center kick-off position.
4. Trait Abilities: Q key triggers "Direct Shot" (instant 100% volley without charging if ball is within 8 studs in mid-air).`,
      securityAndNetworking: `1. Ball possession handoff is validated on the server with distance checks (<= 7 studs).
2. ShotPower is clamped on the server (max 150 studs/sec) to block exploiter super-kicks.
3. Goal detection is strictly calculated by server touch parts with a 3-second debounce post-goal.`,
      codeContract: `Provide production-quality strict Luau scripts for SoccerMatchManager and BallDribbleController with possession transfer, curved kick impulse math, and goal reset routines.`
    },
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
    promptSections: {
      roleAndContext: 'You are a Senior Roblox Studio Systems Engineer. Build an idle RNG rolling engine and base display system modeled after "Sol\'s RNG" and "Build a base RNG" with weighted probabilities, luck multipliers, and aura equipping.',
      architecture: `1. ReplicatedStorage.AuraConfig (ModuleScript containing Aura table: Name, Odds, TierColor, ParticleEffectName)
2. ReplicatedStorage.RNGEvents.RequestRoll (RemoteFunction: Client -> Server)
3. ReplicatedStorage.RNGEvents.EquipAura (RemoteEvent: Client -> Server)
4. ServerScriptService.RNGServer (Server Script)
5. StarterGui.RNGScreenGui (Roll Button, Auto-Roll toggle, Inventory ScrollFrame)`,
      coreMechanic: `1. Rarity Table: Array of auras sorted by rarity: Common (1 in 2), Emerald (1 in 50), Galaxy (1 in 5,000), Supernova (1 in 150,000), Celestial (1 in 1,000,000), Archangel (1 in 25,000,000).
2. Roll Algorithm: Server calculates roll = Random.new():NextNumber(0, 1) / (PlayerLuckMultiplier). Iterate through auras in ascending rarity to return the highest tier won.
3. Roll Cutscene: If rolled aura odds >= 1 in 10,000, return a special flag so client triggers camera shake, golden beams, and global server chat announcement: "[GLOBAL] Player just rolled CELESTIAL (1 in 1,000,000)!"
4. Aura Equipping: Equipping parents ParticleEmitters to character UpperTorso and adds a stylized BillboardGui title above avatar.`,
      securityAndNetworking: `1. The client NEVER computes the roll result; Random.new() runs 100% on the server.
2. Enforce a 3.0s cooldown between manual rolls (or 1.0s if player owns Auto-Roll GamePass).
3. Inventory stores auras by string IDs in DataStore with pcall save guards.`,
      codeContract: `Provide complete strict Luau code for ReplicatedStorage.AuraConfig, ServerScriptService.RNGServer, and StarterGui roll controllers with full type annotations.`
    },
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
    promptSections: {
      roleAndContext: 'You are a Senior Roblox Gameplay Programmer. Build a farm plot growth cycle, crop harvesting, and pet breeder hatching system inspired by "Grow a Garden".',
      architecture: `1. Workspace.GardenPlots: Folder containing 3x3 SoilTile models with DirtPart, PlantSnap attachment, and ProximityPrompt.
2. ServerScriptService.GardenManager (Server Script)
3. ReplicatedStorage.GardenEvents:
   - RemoteEvent "PlantSeed" (Client -> Server)
   - RemoteEvent "WaterTile" (Client -> Server)
   - RemoteEvent "HarvestCrop" (Client -> Server)
4. StarterPack.WaterCanTool and StarterPack.SeedPouchTool`,
      coreMechanic: `1. Soil State Machine: Each tile has States: Empty -> Seeded -> Growing -> Mature -> Wilted.
2. Growth Tween: When seeded, spawn crop model at Vector3.new(0.1, 0.1, 0.1). Using TweenService, scale model size to 1.0x over BaseGrowthDuration (45s).
3. Water Mechanics: Holding WaterCan tool on tile halves remaining growth duration and changes soil color to dark brown mud.
4. Harvesting: When state == Mature, ProximityPrompt changes to "Harvest (+40 Coins)". Clicking harvests crop, awards Coins, and resets tile to Empty state.`,
      securityAndNetworking: `1. Server maintains timestamps (PlantTime, WaterTime) to compute exact growth states regardless of client lag.
2. Verify player distance <= 12 studs from soil tile before allowing plant or harvest actions.
3. Prevent duplicate harvest payouts using atomic state transitions.`,
      codeContract: `Provide complete strict Luau scripts for GardenManager with full state machine handling, plant scaling, and leaderstats coin awards.`
    },
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
    promptSections: {
      roleAndContext: 'You are a Senior Roblox Casual Mechanics Engineer. Build a physics dropper 2048-style merge engine inspired by "Merge a Nuke!" with identical collision fusing, pop animations, and nuclear launch rebirths.',
      architecture: `1. Workspace.MergeContainer: Glass container box with dropper beam overhead.
2. ServerScriptService.MergeGameManager (Server Script)
3. ReplicatedStorage.MergeEvents.DropBomb (RemoteEvent: Client -> Server: dropXPosition)
4. StarterGui.DropperGui (Mouse drag tracker on top boundary)`,
      coreMechanic: `1. Drop Control: Player aims mouse along X-axis. Clicking fires DropBomb. Server spawns Sphere Bomb at drop position with IntValue Level (Level 1 to Level 10).
2. Collision Fusing: Touched listener on bombs checks: if (other.Name == "Bomb" and other.Level.Value == self.Level.Value and not self.Merging and not other.Merging) then:
   - Set Merging = true on both parts to prevent infinite loops.
   - Calculate midpoint = (self.Position + other.Position) / 2.
   - Destroy both parts.
   - Spawn new Bomb of Level + 1 at midpoint, scaling size by 1.25x with a spring bounce tween.
   - Award Points = Level * 50 to player Uranium score.
3. Tsar Bomba Rebirth: Reaching Level 10 unlocks orbital launch button to wipe the jar and grant 10x multiplier.`,
      securityAndNetworking: `1. Clamp dropXPosition on server to prevent players spawning bombs outside the container.
2. Enforce a 0.8s cooldown between drops.
3. Merging lock flag prevents double-fusion race conditions.`,
      codeContract: `Provide complete strict Luau scripts for ServerScriptService.MergeGameManager and client mouse drag drop controller.`
    },
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
    promptSections: {
      roleAndContext: 'You are a Senior Roblox Simulator Developer. Build a complete character size-scaling workout simulator script modeled after "Muscle Legends".',
      architecture: `1. StarterPack.DumbbellTool (Tool with curl animation)
2. StarterPack.PunchTool (Combat tool)
3. ServerScriptService.WorkoutManager (Server Script)
4. Workspace.GymSafeZone (Part tagged "SafeZone" with ForceField logic)`,
      coreMechanic: `1. Lifting: When DumbbellTool activates, server plays lifting animation track and adds +1 Strength (or +2 if player has VIP pass).
2. Proportional Scaling: Listen to Strength.Changed. Calculate scaleFactor = math.clamp(1 + (Strength / 10000) * 2, 1.0, 3.5). Update Humanoid scales: BodyHeightScale = scaleFactor, BodyWidthScale = scaleFactor, BodyDepthScale = scaleFactor, HeadScale = math.clamp(scaleFactor * 0.75, 1, 2).
3. Combat Arena: Punch tool deals Damage = math.max(10, Strength * 0.05). If victim is inside GymSafeZone, damage is negated.`,
      securityAndNetworking: `1. Rate-limit dumbbell clicks on server to 0.4s to prevent macro exploiters clicking 100 times per second.
2. Character size updates execute on server HumanoidDescription to replicate across all players.`,
      codeContract: `Provide complete strict Luau code for ServerScriptService.WorkoutManager with scale calculation math and safe zone combat protection.`
    },
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
    promptSections: {
      roleAndContext: 'You are an Elite Roblox FPS/Combat Gameplay Engineer. Engineer a server-authoritative Revolver & Throwing Knife combat system inspired by "Murderers VS Sheriffs" and "Baddies".',
      architecture: `1. StarterPack.RevolverTool (Hitscan Gun)
2. StarterPack.KnifeTool (Melee + Throwing Knife)
3. ServerScriptService.WeaponManager (Server Script)
4. ReplicatedStorage.CombatEvents:
   - RemoteServer "FireBullet" (Client -> Server: origin, targetDirection)
   - RemoteServer "ThrowKnife" (Client -> Server: throwOrigin, throwVelocity)
   - RemoteEvent "SpawnTracer" (Server -> All Clients)
   - RemoteEvent "KillfeedNotification" (Server -> All Clients)`,
      coreMechanic: `1. Revolver Hitscan: Client clicks, fires "FireBullet". Server casts workspace:Raycast from barrel position along targetDirection (max 300 studs). If ray hits a character: Headshot = 150 damage (instant kill), Body = 90 damage. Spawn bullet tracer beam between barrel and hit point.
2. Throwing Knife: Right click throws a physics knife Part equipped with LinearVelocity and AlignOrientation. When knife hits a player, deal 100 damage and stick knife into surface.
3. Fast Respawn: Dead players respawn after 2.0s at random spawn points with full weapon kit.`,
      securityAndNetworking: `1. Server verifies shooter line of sight from character head to target to prevent wall-bang exploits.
2. Server validates ammo count and enforces 0.8s fire rate cooldown.
3. Damage is strictly awarded on the server.`,
      codeContract: `Provide complete strict Luau code for WeaponManager and RevolverTool client controller with raycast hit validation and tracer spawning.`
    },
    monetizationAdvice: 'Sell Custom Knife Skins (Chroma, Neon, Flame), Kill Sound Effects, and Custom Footstep Trails.'
  }
];

export const HIT_GAMES_LIST: HitGameBlueprint[] = rawGames.map((game) => ({
  ...game,
  aiPrompt: format5SectionPrompt(game.promptSections, game.title)
}));
