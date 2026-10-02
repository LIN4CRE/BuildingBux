export interface GamePassItem {
  id: string;
  name: string;
  robuxPrice: number;
  category: 'convenience' | 'progression' | 'cosmetic' | 'vip' | 'power';
  description: string;
  recommendedFor: string;
  conversionImpact: string;
}

export interface DevProductItem {
  id: string;
  name: string;
  robuxPrice: number;
  category: 'currency' | 'boost' | 'revive' | 'gacha' | 'skip';
  description: string;
  frequency: 'high' | 'medium' | 'occasional';
  whaleAppeal: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  monthlyRobux: number;
  perks: string[];
  retentionBenefit: string;
}

export interface GenreBlueprint {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coreLoop: string[];
  retentionHooks: string[];
  gamePasses: GamePassItem[];
  devProducts: DevProductItem[];
  subscription: SubscriptionTier;
  recommendedPricingStrategy: string;
}

export interface DevExCalculation {
  grossRobux: number;
  robloxCutPercent: number; // 30%
  netRobux: number; // 70%
  devexUsd: number; // $0.0035 per net Robux
  usdToGbpRate: number; // e.g. 0.78
  netGbp: number;
  qualifiesForDevEx: boolean;
  minThreshold: number; // 30,000
}

export interface SimulationParams {
  averageCcu: number;
  sessionTurnoverRatio: number; // DAU multiplier, typically 10x CCU
  payingConversionPercent: number; // 1.5% - 4%
  arppuRobux: number; // Average Robux spent by spenders
  premiumPlayerShare: number; // ~15-25%
  premiumHoursPerPlayer: number;
  premiumPayoutRatePer1kHours: number; // approx 300 Robux per 1000 hours
}
