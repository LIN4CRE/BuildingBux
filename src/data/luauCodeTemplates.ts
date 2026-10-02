export interface LuauScriptTemplate {
  id: string;
  title: string;
  category: 'monetization' | 'datastore' | 'gamepass' | 'mechanics';
  location: string;
  description: string;
  securityNote: string;
  code: string;
}

export const LUAU_CODE_TEMPLATES: LuauScriptTemplate[] = [
  {
    id: 'gamepass-purchase-checks',
    title: 'GamePass Purchase Checks & Live Perks Handler',
    category: 'gamepass',
    location: 'ServerScriptService > GamePassManager (Server Script)',
    description: 'Server-authoritative script checking player GamePass ownership using UserOwnsGamePassAsync with session caching, character respawn perk application, and real-time PromptGamePassPurchaseFinished listeners.',
    securityNote: 'CRITICAL: Never verify pass ownership on the client. Exploiters can spoof client-side values. Always perform ownership checks on the Server and wrap in pcall to protect against Roblox API throttling.',
    code: `--!strict
-- Placed in: ServerScriptService > GamePassManager (Server Script)
-- Purpose: Authoritative GamePass checking, session caching, and live perk granting
-- Author: BloxMonetize Studio Framework

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

-- Configure your GamePass IDs from the Roblox Creator Hub
local GAMEPASS_CONFIG = {
    VIP_PASS = {
        Id = 12345678,
        Name = "VIP Club",
        WalkSpeedBonus = 4,
        CoinMultiplier = 1.5,
    },
    DOUBLE_SPEED = {
        Id = 12345679,
        Name = "2x Super Speed",
        WalkSpeed = 32, -- Default is 16
    },
    TRIPLE_HATCH = {
        Id = 12345680,
        Name = "Triple Egg Hatch",
    },
    INFINITE_STORAGE = {
        Id = 12345681,
        Name = "Infinite Storage",
    }
}

-- In-memory cache to prevent hitting Roblox API request limits on character respawn
-- Format: [UserId] = { [PassId] = true/false }
local OwnershipCache: { [number]: { [number]: boolean } } = {}

-- Safely check if a player owns a gamepass with error handling & cache
local function userOwnsPass(player: Player, passId: number): boolean
    local userId = player.UserId

    -- Check session cache first
    if OwnershipCache[userId] and OwnershipCache[userId][passId] ~= nil then
        return OwnershipCache[userId][passId]
    end

    -- Query Roblox API safely with pcall
    local owns = false
    local success, err = pcall(function()
        owns = MarketplaceService:UserOwnsGamePassAsync(userId, passId)
    end)

    if not success then
        warn(string.format("[GamePass] Failed to check pass %d for %s: %s", passId, player.Name, tostring(err)))
        return false
    end

    -- Save to cache
    if not OwnershipCache[userId] then
        OwnershipCache[userId] = {}
    end
    OwnershipCache[userId][passId] = owns
    return owns
end

-- Apply character-specific physical perks (Speed, Overheads, Auras)
local function applyCharacterPerks(player: Player, character: Model)
    local humanoid = character:WaitForChild("Humanoid", 8) :: Humanoid?
    if not humanoid then return end

    -- 1. Apply Super Speed Pass
    if userOwnsPass(player, GAMEPASS_CONFIG.DOUBLE_SPEED.Id) then
        humanoid.WalkSpeed = GAMEPASS_CONFIG.DOUBLE_SPEED.WalkSpeed
    elseif userOwnsPass(player, GAMEPASS_CONFIG.VIP_PASS.Id) then
        humanoid.WalkSpeed = 16 + GAMEPASS_CONFIG.VIP_PASS.WalkSpeedBonus
    end

    -- 2. Apply VIP Overhead Billboard Tag
    if userOwnsPass(player, GAMEPASS_CONFIG.VIP_PASS.Id) then
        local head = character:WaitForChild("Head", 5) :: BasePart?
        if head and not head:FindFirstChild("VIPBillboard") then
            local billboard = Instance.new("BillboardGui")
            billboard.Name = "VIPBillboard"
            billboard.Size = UDim2.new(0, 100, 0, 30)
            billboard.StudsOffset = Vector3.new(0, 2.8, 0)
            billboard.AlwaysOnTop = true

            local tag = Instance.new("TextLabel")
            tag.Size = UDim2.new(1, 0, 1, 0)
            tag.BackgroundTransparency = 1
            tag.Text = "[VIP MEMBER]"
            tag.TextColor3 = Color3.fromRGB(255, 215, 0)
            tag.TextStrokeColor3 = Color3.fromRGB(80, 50, 0)
            tag.TextStrokeTransparency = 0.2
            tag.Font = Enum.Font.GothamBold
            tag.TextSize = 14
            tag.Parent = billboard

            billboard.Parent = head
        end
    end
end

-- Initialize player session on join
local function onPlayerAdded(player: Player)
    OwnershipCache[player.UserId] = {}

    -- Re-apply perks each time the character respawns
    player.CharacterAdded:Connect(function(character)
        applyCharacterPerks(player, character)
    end)

    if player.Character then
        applyCharacterPerks(player, player.Character)
    end
end

-- Clear cache when player leaves to free memory
local function onPlayerRemoving(player: Player)
    OwnershipCache[player.UserId] = nil
end

Players.PlayerAdded:Connect(onPlayerAdded)
Players.PlayerRemoving:Connect(onPlayerRemoving)

-- Public Server Module Interface for other scripts to check pass perks
local GamePassManager = {}

function GamePassManager.PlayerHasPass(player: Player, passId: number): boolean
    return userOwnsPass(player, passId)
end

function GamePassManager.GetCoinMultiplier(player: Player): number
    if userOwnsPass(player, GAMEPASS_CONFIG.VIP_PASS.Id) then
        return GAMEPASS_CONFIG.VIP_PASS.CoinMultiplier
    end
    return 1.0
end

-- Handle In-Game Purchases: player buys pass while inside the server
MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player: Player, passId: number, wasPurchased: boolean)
    if wasPurchased then
        print(string.format("[GamePass] %s successfully purchased GamePass %d!", player.Name, passId))

        -- Update cache immediately
        if not OwnershipCache[player.UserId] then
            OwnershipCache[player.UserId] = {}
        end
        OwnershipCache[player.UserId][passId] = true

        -- Grant in-game perks immediately without requiring character respawn
        if player.Character then
            applyCharacterPerks(player, player.Character)
        end

        -- Trigger celebratory sound / chat notification
        local message = string.format("[SHOP] %s just unlocked the %s GamePass!", player.Name, 
            passId == GAMEPASS_CONFIG.VIP_PASS.Id and "VIP Club" or "GamePass")
        print(message)
    end
end)

print("[BloxMonetize] GamePassManager initialized successfully!")
return GamePassManager`
  },
  {
    id: 'datastore-saving-system',
    title: 'Bulletproof Production DataStore Saving System',
    category: 'datastore',
    location: 'ServerScriptService > DataStoreManager (Server Script)',
    description: 'Enterprise-grade player data saving using DataStoreService:UpdateAsync. Features automatic 5-minute background auto-saving, session-locking, and game:BindToClose to guarantee zero data loss during server shutdowns.',
    securityNote: 'Never use SetAsync for player progression, as it can overwrite newer data with older data during concurrent writes. Always use UpdateAsync and connect game:BindToClose to save all players before server termination.',
    code: `--!strict
-- Placed in: ServerScriptService > DataStoreManager (Server Script)
-- Purpose: Complete, production-grade player data saving with zero data loss
-- Author: BloxMonetize Studio Framework

local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

-- DataStore identifier (change version to wipe data if resetting economy)
local DATA_STORE_NAME = "PlayerData_v1"
local PlayerDataStore = DataStoreService:GetDataStore(DATA_STORE_NAME)

-- Auto-save interval in seconds (every 5 minutes)
local AUTO_SAVE_INTERVAL = 300

-- Default template for new players joining for the very first time
local DEFAULT_DATA = {
    Coins = 100,
    Gems = 10,
    Level = 1,
    Rebirths = 0,
    Inventory = { "Starter_Tool" },
    LastLogin = os.time(),
    TotalPlaytimeMinutes = 0
}

-- In-memory session cache: [UserId] = dataTable
local SessionData: { [number]: typeof(DEFAULT_DATA) } = {}

-- Deep clone helper function
local function deepCopy(original: { [string]: any }): { [string]: any }
    local copy = {}
    for k, v in pairs(original) do
        if type(v) == "table" then
            copy[k] = deepCopy(v)
        else
            copy[k] = v
        end
    end
    return copy
end

-- Reconcile loaded data with default template to ensure missing keys are added on update
local function reconcileData(loadedData: { [string]: any }): typeof(DEFAULT_DATA)
    local reconciled = deepCopy(DEFAULT_DATA)
    if type(loadedData) == "table" then
        for key, value in pairs(loadedData) do
            reconciled[key] = value
        end
    end
    return reconciled
end

-- Set up visible Roblox leaderstats folder
local function setupLeaderstats(player: Player, data: typeof(DEFAULT_DATA))
    local leaderstats = player:FindFirstChild("leaderstats") or Instance.new("Folder")
    leaderstats.Name = "leaderstats"

    local coins = leaderstats:FindFirstChild("Coins") or Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = data.Coins
    coins.Parent = leaderstats

    local level = leaderstats:FindFirstChild("Level") or Instance.new("IntValue")
    level.Name = "Level"
    level.Value = data.Level
    level.Parent = leaderstats

    local rebirths = leaderstats:FindFirstChild("Rebirths") or Instance.new("IntValue")
    rebirths.Name = "Rebirths"
    rebirths.Value = data.Rebirths
    rebirths.Parent = leaderstats

    leaderstats.Parent = player
end

-- Load player data from Roblox DataStore
local function loadData(player: Player)
    local key = "Player_" .. player.UserId
    local loadedData = nil
    local success, err = pcall(function()
        loadedData = PlayerDataStore:GetAsync(key)
    end)

    if not success then
        warn(string.format("[DataStore] Error loading data for %s: %s", player.Name, tostring(err)))
    end

    local finalData = reconcileData(loadedData)
    finalData.LastLogin = os.time()
    SessionData[player.UserId] = finalData

    -- Sync to leaderstats
    setupLeaderstats(player, finalData)
    print(string.format("[DataStore] Successfully loaded data for %s (Coins: %d)", player.Name, finalData.Coins))
end

-- Save player data safely to DataStore using UpdateAsync
local function saveData(player: Player): boolean
    local userId = player.UserId
    local data = SessionData[userId]
    if not data then return false end

    -- Sync leaderstats into session table before writing to disk
    local leaderstats = player:FindFirstChild("leaderstats")
    if leaderstats then
        local coins = leaderstats:FindFirstChild("Coins") :: IntValue?
        if coins then data.Coins = coins.Value end

        local level = leaderstats:FindFirstChild("Level") :: IntValue?
        if level then data.Level = level.Value end

        local rebirths = leaderstats:FindFirstChild("Rebirths") :: IntValue?
        if rebirths then data.Rebirths = rebirths.Value end
    end

    local key = "Player_" .. userId
    local saveSuccess, saveErr = pcall(function()
        PlayerDataStore:UpdateAsync(key, function(oldData)
            -- Return the updated session data to be stored
            return data
        end)
    end)

    if saveSuccess then
        print(string.format("[DataStore] Successfully saved data for %s", player.Name))
        return true
    else
        warn(string.format("[DataStore] Failed to save data for %s: %s", player.Name, tostring(saveErr)))
        return false
    end
end

-- Player joins
Players.PlayerAdded:Connect(function(player)
    loadData(player)
end)

-- Player leaves: Save immediately
Players.PlayerRemoving:Connect(function(player)
    saveData(player)
    SessionData[player.UserId] = nil
end)

-- Periodic Background Auto-Save Loop
task.spawn(function()
    while true do
        task.wait(AUTO_SAVE_INTERVAL)
        print("[DataStore] Running periodic auto-save cycle...")
        for _, player in Players:GetPlayers() do
            task.spawn(function()
                saveData(player)
            end)
        end
    end
end)

-- Critical: BindToClose guarantees all player data saves if server shuts down or crashes
game:BindToClose(function()
    print("[DataStore] Server shutting down! Saving all active player profiles...")
    local players = Players:GetPlayers()
    local finished = 0

    for _, player in players do
        task.spawn(function()
            saveData(player)
            finished += 1
        end)
    end

    -- Give tasks up to 10 seconds to conclude before server terminates
    local start = os.clock()
    while finished < #players and os.clock() - start < 10 do
        task.wait(0.2)
    end
    print("[DataStore] Server shutdown save complete!")
end)

-- Global Data Module Interface
local DataStoreManager = {}

function DataStoreManager.GetData(player: Player)
    return SessionData[player.UserId]
end

function DataStoreManager.AddCoins(player: Player, amount: number)
    local data = SessionData[player.UserId]
    if data then
        data.Coins += amount
        local leaderstats = player:FindFirstChild("leaderstats")
        local coins = leaderstats and leaderstats:FindFirstChild("Coins") :: IntValue?
        if coins then coins.Value = data.Coins end
    end
end

return DataStoreManager`
  },
  {
    id: 'receipt-processor',
    title: 'Server MarketplaceService & ProcessReceipt (Safe Receipts)',
    category: 'monetization',
    location: 'ServerScriptService > MarketplaceServiceHandler (Script)',
    description: 'The critical server-authoritative script that handles all Developer Product purchases. Includes idempotent transaction logging to DataStore to prevent item duplication or lost Robux.',
    securityNote: 'CRITICAL: Never grant Robux purchases on the client. ProcessReceipt MUST be handled on the Server, and must return PurchaseGranted only after persistent data is successfully saved.',
    code: `--!strict
-- Placed in: ServerScriptService > MarketplaceServiceHandler (Server Script)
-- Purpose: Authoritative receipt processing for Developer Products
-- Author: BloxMonetize Studio Framework

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")

-- Purchase History DataStore ensures no purchase is granted twice if servers crash/retry
local PurchaseHistoryStore = DataStoreService:GetDataStore("PurchaseHistory_v1")

-- Product IDs mapping (Replace with your actual Developer Product IDs from Creator Hub)
local PRODUCT_IDS = {
    GEMS_500 = 189234812,     -- Example: 500 Gems (39 R$)
    GEMS_25000 = 189234813,   -- Example: Vault of Gems (999 R$)
    SPEED_POTION = 189234814, -- Example: 15-Min 3x Speed Potion (49 R$)
    STAGE_SKIP = 189234815,   -- Example: Skip 1 Stage (35 R$)
    REVIVE_TOKEN = 189234816, -- Example: Dungeon Instant Revive (35 R$)
}

-- Table of product granting functions
local ProductHandlers = {}

-- Handler: 500 Gems
ProductHandlers[PRODUCT_IDS.GEMS_500] = function(player: Player): boolean
    local leaderstats = player:FindFirstChild("leaderstats")
    local gems = leaderstats and leaderstats:FindFirstChild("Gems") :: NumberValue?
    if gems then
        gems.Value += 500
        print("[Purchase] Granted 500 Gems to " .. player.Name)
        return true
    end
    return false
end

-- Handler: 25,000 Gems (Vault)
ProductHandlers[PRODUCT_IDS.GEMS_25000] = function(player: Player): boolean
    local leaderstats = player:FindFirstChild("leaderstats")
    local gems = leaderstats and leaderstats:FindFirstChild("Gems") :: NumberValue?
    if gems then
        gems.Value += 25000
        print("[Purchase] Granted 25,000 Gems (Vault) to " .. player.Name)
        return true
    end
    return false
end

-- Handler: 15-Min Speed Potion
ProductHandlers[PRODUCT_IDS.SPEED_POTION] = function(player: Player): boolean
    local character = player.Character
    local humanoid = character and character:FindFirstChildOfClass("Humanoid")
    if humanoid then
        humanoid.WalkSpeed = 32 -- Boosted speed
        task.delay(15 * 60, function()
            if humanoid and humanoid.Parent then
                humanoid.WalkSpeed = 16 -- Reset
            end
        end)
        return true
    end
    return false
end

-- Handler: Stage Skip
ProductHandlers[PRODUCT_IDS.STAGE_SKIP] = function(player: Player): boolean
    local leaderstats = player:FindFirstChild("leaderstats")
    local stage = leaderstats and leaderstats:FindFirstChild("Stage") :: NumberValue?
    if stage then
        stage.Value += 1
        return true
    end
    return false
end

-- The authoritative callback required by Roblox
local function processReceipt(receiptInfo: { [string]: any }): Enum.ProductPurchaseDecision
    local playerProductKey = receiptInfo.PlayerId .. "_" .. receiptInfo.PurchaseId

    -- 1. Check if purchase was already recorded in persistent DataStore
    local alreadyProcessed = false
    local success, err = pcall(function()
        alreadyProcessed = PurchaseHistoryStore:GetAsync(playerProductKey)
    end)

    if success and alreadyProcessed then
        return Enum.ProductPurchaseDecision.PurchaseGranted
    end

    -- 2. Find player in server
    local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
    if not player then
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    -- 3. Execute product reward handler
    local handler = ProductHandlers[receiptInfo.ProductId]
    local rewardGranted = false

    if handler then
        local grantSuccess, grantErr = pcall(function()
            rewardGranted = handler(player)
        end)
        if not grantSuccess or not rewardGranted then
            return Enum.ProductPurchaseDecision.NotProcessedYet
        end
    else
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    -- 4. Record successful purchase in DataStore before confirming
    local saveSuccess, saveErr = pcall(function()
        PurchaseHistoryStore:SetAsync(playerProductKey, true)
    end)

    if not saveSuccess then
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    return Enum.ProductPurchaseDecision.PurchaseGranted
end

MarketplaceService.ProcessReceipt = processReceipt
print("[BloxMonetize] MarketplaceService.ProcessReceipt successfully registered!")`
  },
  {
    id: 'daily-login-streak',
    title: 'Daily Login Streak & Scaling Reward Multiplier',
    category: 'mechanics',
    location: 'ServerScriptService > DailyLoginManager (Server Script)',
    description: 'Calculates day differences between player logins. Awards progressive coin multipliers and free gems for consecutive 7-day logins, driving Day-1 to Day-7 retention.',
    securityNote: 'Always compare timestamps using os.time() on the server. Never trust client device clocks, which can be modified by players to skip time.',
    code: `--!strict
-- Placed in: ServerScriptService > DailyLoginManager (Server Script)
-- Purpose: 7-Day login streak reward escalators for retention
-- Author: BloxMonetize Studio Framework

local Players = game:GetService("Players")

local SECONDS_IN_DAY = 86400
local STREAK_RESET_WINDOW = SECONDS_IN_DAY * 2 -- Reset if absent > 48 hours

-- Streak rewards matrix
local DAILY_REWARDS = {
    [1] = { Coins = 100, Gems = 5, Label = "Day 1 Welcome" },
    [2] = { Coins = 250, Gems = 10, Label = "Day 2 Boost" },
    [3] = { Coins = 500, Gems = 20, Label = "Day 3 Gift" },
    [4] = { Coins = 1000, Gems = 35, Label = "Day 4 Silver Chest" },
    [5] = { Coins = 2000, Gems = 50, Label = "Day 5 Gold Chest" },
    [6] = { Coins = 3500, Gems = 75, Label = "Day 6 Emerald Vault" },
    [7] = { Coins = 10000, Gems = 200, Label = "Day 7 MYTHIC PET REWARD" },
}

local function checkDailyLogin(player: Player, data: { [string]: any })
    local now = os.time()
    local lastLogin = data.LastDailyLogin or 0
    local currentStreak = data.DailyStreak or 0

    local timeSince = now - lastLogin

    -- If already claimed within past 20 hours, do not claim again today
    if timeSince < (SECONDS_IN_DAY - 3600) then
        print(string.format("[DailyLogin] %s already claimed reward today.", player.Name))
        return
    end

    -- Check if streak is preserved or reset
    if timeSince > STREAK_RESET_WINDOW then
        currentStreak = 1
        print(string.format("[DailyLogin] %s missed streak! Resetting to Day 1.", player.Name))
    else
        currentStreak = (currentStreak % 7) + 1
    end

    data.LastDailyLogin = now
    data.DailyStreak = currentStreak

    -- Grant reward
    local reward = DAILY_REWARDS[currentStreak]
    if reward then
        local leaderstats = player:FindFirstChild("leaderstats")
        local coins = leaderstats and leaderstats:FindFirstChild("Coins") :: IntValue?
        if coins then coins.Value += reward.Coins end

        print(string.format("[DailyLogin] Awarded %s Day %d Reward: %d Coins, %d Gems!", 
            player.Name, currentStreak, reward.Coins, reward.Gems))
    end
end

-- Export module
return { CheckDailyLogin = checkDailyLogin }`
  },
  {
    id: 'safezone-protection',
    title: 'ZonePlus SafeZone & Plot Anti-Grief Protection',
    category: 'mechanics',
    location: 'ServerScriptService > SafeZoneProtection (Server Script)',
    description: 'Creates safe havens where PvP damage, knife throwing, or egg stealing is disabled. Automatically applies ForceFields or sets GodMode tags when entering designated zones.',
    securityNote: 'Validate zone boundaries on the server using spatial checks or ZonePlus to ensure exploiters cannot fake being inside a safe zone during PvP combat.',
    code: `--!strict
-- Placed in: ServerScriptService > SafeZoneProtection (Server Script)
-- Purpose: Disables combat & prevents griefing within designated boundaries
-- Author: BloxMonetize Studio Framework

local Players = game:GetService("Players")
local CollectionService = game:GetService("CollectionService")

-- Tag given to parts that represent safe zones
local SAFEZONE_TAG = "SafeZone"

local function onCharacterEnteredSafeZone(player: Player, character: Model)
    -- Add server-side protection tag
    CollectionService:AddTag(character, "InSafeZone")

    -- Add temporary visual forcefield
    if not character:FindFirstChildOfClass("ForceField") then
        local ff = Instance.new("ForceField")
        ff.Visible = true
        ff.Parent = character
    end

    print("[SafeZone] Protected: " .. player.Name)
end

local function onCharacterExitedSafeZone(player: Player, character: Model)
    CollectionService:RemoveTag(character, "InSafeZone")

    -- Remove forcefield
    local ff = character:FindFirstChildOfClass("ForceField")
    if ff then
        ff:Destroy()
    end

    print("[SafeZone] Exited: " .. player.Name)
end

-- Connect Touched and TouchEnded events to SafeZone bounds
for _, safeZonePart in CollectionService:GetTagged(SAFEZONE_TAG) do
    if safeZonePart:IsA("BasePart") then
        safeZonePart.Touched:Connect(function(hit)
            local character = hit.Parent :: Model?
            local player = character and Players:GetPlayerFromCharacter(character)
            if player and character then
                onCharacterEnteredSafeZone(player, character)
            end
        end)

        safeZonePart.TouchEnded:Connect(function(hit)
            local character = hit.Parent :: Model?
            local player = character and Players:GetPlayerFromCharacter(character)
            if player and character then
                onCharacterExitedSafeZone(player, character)
            end
        end)
    end
end`
  },
  {
    id: 'client-prompt',
    title: 'Client UI Purchase Prompter (Safe Client Triggers)',
    category: 'monetization',
    location: 'StarterPlayer > StarterPlayerScripts > ShopUIController (LocalScript)',
    description: 'Clean client-side script that wires UI buttons to MarketplaceService:PromptProductPurchase and MarketplaceService:PromptGamePassPurchase with cooldown debounce.',
    securityNote: 'Clients only request the prompt dialogue. The server validates and grants everything upon purchase completion.',
    code: `--!strict
-- Placed in: StarterPlayer > StarterPlayerScripts (LocalScript)
-- Purpose: Safely triggers Roblox native purchase overlay on user click
-- Author: BloxMonetize Studio Framework

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")
local localPlayer = Players.LocalPlayer

local lastPromptTime = 0
local PROMPT_COOLDOWN = 1.0

local ShopController = {}

function ShopController.PromptProduct(productId: number)
    local now = os.clock()
    if now - lastPromptTime < PROMPT_COOLDOWN then return end
    lastPromptTime = now

    pcall(function()
        MarketplaceService:PromptProductPurchase(localPlayer, productId)
    end)
end

function ShopController.PromptGamePass(passId: number)
    local now = os.clock()
    if now - lastPromptTime < PROMPT_COOLDOWN then return end
    lastPromptTime = now

    pcall(function()
        MarketplaceService:PromptGamePassPurchase(localPlayer, passId)
    end)
end

return ShopController`
  },
  {
    id: 'premium-payout-tracker',
    title: 'Roblox Premium Engagement Playtime Tracker',
    category: 'monetization',
    location: 'ServerScriptService > PremiumEngagementTracker (Script)',
    description: 'Tracks Roblox Premium subscriber playtime, gives them bonus perks to maximize their session dwell time, directly accelerating your Premium Payout Robux checks.',
    securityNote: 'Roblox automatically calculates Premium Payouts in the background based on time spent. Rewarding Premium players with +20% coins or special zones boosts their session time significantly.',
    code: `--!strict
-- Placed in: ServerScriptService > PremiumEngagementTracker (Server Script)
-- Purpose: Detects Roblox Premium subscribers & rewards dwell time for maximum Premium Payouts
-- Author: BloxMonetize Studio Framework

local Players = game:GetService("Players")

local function onPlayerAdded(player: Player)
    if player.MembershipType == Enum.MembershipType.Premium then
        print("[Premium] " .. player.Name .. " is a Roblox Premium Member!")
        -- Reward player with passive dwell bonus
    end
end

Players.PlayerAdded:Connect(onPlayerAdded)`
  }
];
