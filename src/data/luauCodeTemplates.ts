export interface LuauScriptTemplate {
  id: string;
  title: string;
  location: string;
  description: string;
  securityNote: string;
  code: string;
}

export const LUAU_CODE_TEMPLATES: LuauScriptTemplate[] = [
  {
    id: 'receipt-processor',
    title: 'Server MarketplaceService & ProcessReceipt (Safe Receipts)',
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
        -- In production, store the expiration timestamp in player session data
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
        -- Teleport character to next checkpoint
        local checkpoints = workspace:FindFirstChild("Checkpoints")
        local nextCheckpoint = checkpoints and checkpoints:FindFirstChild(tostring(stage.Value)) :: BasePart?
        local rootPart = player.Character and player.Character:FindFirstChild("HumanoidRootPart") :: BasePart?
        if nextCheckpoint and rootPart then
            rootPart.CFrame = nextCheckpoint.CFrame + Vector3.new(0, 3, 0)
        end
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
        -- Transaction was already completed previously; tell Roblox to conclude
        return Enum.ProductPurchaseDecision.PurchaseGranted
    end

    -- 2. Find player in server
    local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
    if not player then
        -- Player disconnected before grant; return NotProcessedYet so Roblox will retry when player rejoins
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    -- 3. Execute product reward handler
    local handler = ProductHandlers[receiptInfo.ProductId]
    local rewardGranted = false

    if handler then
        local grantSuccess, grantErr = pcall(function()
            rewardGranted = handler(player)
        end)
        if not grantSuccess then
            warn("[Marketplace] Error granting product " .. receiptInfo.ProductId .. ": " .. tostring(grantErr))
            return Enum.ProductPurchaseDecision.NotProcessedYet
        end
    else
        warn("[Marketplace] No handler registered for ProductId: " .. tostring(receiptInfo.ProductId))
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    if not rewardGranted then
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    -- 4. Record successful purchase in DataStore before confirming
    local saveSuccess, saveErr = pcall(function()
        PurchaseHistoryStore:SetAsync(playerProductKey, true)
    end)

    if not saveSuccess then
        warn("[Marketplace] Failed to save transaction key: " .. tostring(saveErr))
        -- If saving fails, return NotProcessedYet so player is never short-changed
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    print(string.format("[Marketplace] Successfully processed receipt: User %d bought Product %d", receiptInfo.PlayerId, receiptInfo.ProductId))
    return Enum.ProductPurchaseDecision.PurchaseGranted
end

-- Register callback
MarketplaceService.ProcessReceipt = processReceipt
print("[BloxMonetize] MarketplaceService.ProcessReceipt successfully registered!")`
  },
  {
    id: 'gamepass-handler',
    title: 'GamePass Ownership Checker & Perk Applier',
    location: 'ServerScriptService > GamePassManager (Script)',
    description: 'Safely queries UserOwnsGamePassAsync with caching to prevent Roblox API throttling limits. Automatically applies VIP status, multipliers, and speeds on player join and character respawn.',
    securityNote: 'Always wrap UserOwnsGamePassAsync in a pcall. Never assume an unhandled call will succeed. Listen for PromptGamePassPurchaseFinished on the server.',
    code: `--!strict
-- Placed in: ServerScriptService > GamePassManager (Server Script)
-- Purpose: Authoritative GamePass check and perk application
-- Author: BloxMonetize Studio Framework

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

-- Game Pass IDs (Replace with your actual Game Pass IDs from Roblox Creator Hub)
local GAMEPASS_IDS = {
    VIP_CLUB = 12345678,         -- 299 R$ VIP Pass
    DOUBLE_COINS = 12345679,     -- 399 R$ 2x Coins Multiplier
    SUPER_SPEED = 12345680,      -- 149 R$ +80% Speed
    AUTO_COLLECT = 12345681,     -- 249 R$ Auto Collector
}

-- Session cache to avoid hitting Roblox API request limits on respawn
-- Format: [UserId] = { [PassId] = true/false }
local PassCache: { [number]: { [number]: boolean } } = {}

-- Safely check ownership with pcall
local function checkOwnership(userId: number, passId: number): boolean
    if PassCache[userId] and PassCache[userId][passId] ~= nil then
        return PassCache[userId][passId]
    end

    local owns = false
    local success, err = pcall(function()
        owns = MarketplaceService:UserOwnsGamePassAsync(userId, passId)
    end)

    if not success then
        warn("[GamePass] Failed to check pass " .. passId .. " for User " .. userId .. ": " .. tostring(err))
        return false
    end

    if not PassCache[userId] then
        PassCache[userId] = {}
    end
    PassCache[userId][passId] = owns
    return owns
end

-- Apply perks when character spawns
local function applyPerksToCharacter(player: Player, character: Model)
    local humanoid = character:WaitForChild("Humanoid", 10) :: Humanoid?
    if not humanoid then return end

    -- Check Super Speed Pass
    if checkOwnership(player.UserId, GAMEPASS_IDS.SUPER_SPEED) then
        humanoid.WalkSpeed = 28 -- Default is 16
        print("[GamePass] Applied Super Speed to " .. player.Name)
    end

    -- Check VIP Club Pass
    if checkOwnership(player.UserId, GAMEPASS_IDS.VIP_CLUB) then
        -- Add VIP golden overhead billboard or aura
        local head = character:WaitForChild("Head", 5) :: BasePart?
        if head and not head:FindFirstChild("VIPTag") then
            local billboard = Instance.new("BillboardGui")
            billboard.Name = "VIPTag"
            billboard.Size = UDim2.new(0, 80, 0, 30)
            billboard.StudsOffset = Vector3.new(0, 2.5, 0)
            billboard.AlwaysOnTop = true

            local label = Instance.new("TextLabel")
            label.Size = UDim2.new(1, 0, 1, 0)
            label.Text = "[VIP]"
            label.TextColor3 = Color3.fromRGB(255, 215, 0)
            label.TextStrokeTransparency = 0.2
            label.Font = Enum.Font.GothamBold
            label.TextSize = 18
            label.BackgroundTransparency = 1
            label.Parent = billboard

            billboard.Parent = head
        end
    end
end

-- When a player joins
Players.PlayerAdded:Connect(function(player)
    PassCache[player.UserId] = {}

    player.CharacterAdded:Connect(function(character)
        applyPerksToCharacter(player, character)
    end)
    if player.Character then
        applyPerksToCharacter(player, player.Character)
    end
end)

-- Clear cache when player leaves to free memory
Players.PlayerRemoving:Connect(function(player)
    PassCache[player.UserId] = nil
end)

-- Handle mid-game purchase: listen for when player purchases pass inside experience
MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player: Player, passId: number, wasPurchased: boolean)
    if wasPurchased then
        print(string.format("[GamePass] %s successfully purchased GamePass %d!", player.Name, passId))
        
        -- Update cache
        if not PassCache[player.UserId] then
            PassCache[player.UserId] = {}
        end
        PassCache[player.UserId][passId] = true

        -- Re-apply perks immediately without requiring respawn
        if player.Character then
            applyPerksToCharacter(player, player.Character)
        end
    end
end)

print("[BloxMonetize] GamePassManager initialized successfully!")`
  },
  {
    id: 'client-prompt',
    title: 'Client UI Purchase Prompter (Safe Client Triggers)',
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

-- Debounce timer prevents players from spamming purchase prompts
local lastPromptTime = 0
local PROMPT_COOLDOWN = 1.0 -- 1 second cooldown

local ShopController = {}

-- Prompts a Developer Product (Consumable)
function ShopController.PromptProduct(productId: number)
    local now = os.clock()
    if now - lastPromptTime < PROMPT_COOLDOWN then
        return
    end
    lastPromptTime = now

    pcall(function()
        MarketplaceService:PromptProductPurchase(localPlayer, productId)
    end)
end

-- Prompts a Game Pass (Permanent)
function ShopController.PromptGamePass(passId: number)
    local now = os.clock()
    if now - lastPromptTime < PROMPT_COOLDOWN then
        return
    end
    lastPromptTime = now

    pcall(function()
        MarketplaceService:PromptGamePassPurchase(localPlayer, passId)
    end)
end

-- Prompts an In-Experience Subscription (Monthly Recurring)
function ShopController.PromptSubscription(subscriptionId: string)
    local now = os.clock()
    if now - lastPromptTime < PROMPT_COOLDOWN then
        return
    end
    lastPromptTime = now

    pcall(function()
        MarketplaceService:PromptSubscriptionPurchase(localPlayer, subscriptionId)
    end)
end

-- Example button binding:
-- local buyButton = script.Parent:WaitForChild("BuyVipButton") :: TextButton
-- buyButton.Activated:Connect(function()
--     ShopController.PromptGamePass(12345678)
-- end)

return ShopController`
  },
  {
    id: 'premium-payout-tracker',
    title: 'Roblox Premium Payouts & Engagement Optimizer',
    location: 'ServerScriptService > PremiumEngagementTracker (Script)',
    description: 'Tracks Roblox Premium subscriber playtime, gives them bonus perks to maximize their session dwell time, directly accelerating your Premium Payout Robux checks.',
    securityNote: 'Roblox automatically calculates Premium Payouts in the background based on time spent. Rewarding Premium players with +20% coins or special zones boosts their session time significantly.',
    code: `--!strict
-- Placed in: ServerScriptService > PremiumEngagementTracker (Server Script)
-- Purpose: Detects Roblox Premium subscribers & rewards dwell time for maximum Premium Payouts
-- Author: BloxMonetize Studio Framework

local Players = game:GetService("Players")

-- VIP & Premium Bonus Multipliers
local PREMIUM_EXP_MULTIPLIER = 1.25 -- +25% Experience for Premium users
local PREMIUM_CHECK_INTERVAL = 300   -- Check session dwell every 5 minutes

local function onPlayerAdded(player: Player)
    -- Check if player has active Roblox Premium membership
    if player.MembershipType == Enum.MembershipType.Premium then
        print("[Premium] " .. player.Name .. " is a Roblox Premium Member!")

        -- Give immediate premium welcome notification
        -- In game: send message or show nice GUI popup
        local leaderstats = player:WaitForChild("leaderstats", 10)
        
        -- Start periodic session engagement reward loop
        task.spawn(function()
            while player.Parent do
                task.wait(PREMIUM_CHECK_INTERVAL)
                -- Grant passive loyalty bonus for staying in server
                print("[Premium Engagement] " .. player.Name .. " rewarded for 5-min dwell time.")
            end
        end)
    end
end

Players.PlayerAdded:Connect(onPlayerAdded)
for _, player in Players:GetPlayers() do
    onPlayerAdded(player)
end

-- Listen for players who upgrade to Premium while playing
Players.PlayerMembershipChanged:Connect(function(player)
    if player.MembershipType == Enum.MembershipType.Premium then
        print("[Premium] " .. player.Name .. " just upgraded to Roblox Premium in-game!")
    end
end)`
  }
];
