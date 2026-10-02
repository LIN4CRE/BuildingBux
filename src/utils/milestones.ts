export interface Milestone {
  id: string;
  title: string;
  category: 'Players' | 'DevEx' | 'Tax' | 'Studio';
  thresholdText: string;
  description: string;
  unlocked: boolean;
  progress: number; // 0 to 100
  currentValueText: string;
  significance: string;
}

export function evaluateMilestones(params: {
  ccu: number;
  dau: number;
  monthlyNetRobux: number;
  annualGbp: number;
}): Milestone[] {
  const { ccu, dau, monthlyNetRobux, annualGbp } = params;

  return [
    {
      id: 'm-100-ccu',
      title: 'First 100 Concurrent Players (CCU)',
      category: 'Players',
      thresholdText: '100 Concurrent Players',
      description: 'Break out of friends-and-family testing and achieve self-sustaining server occupancy.',
      unlocked: ccu >= 100,
      progress: Math.min(100, Math.round((ccu / 100) * 100)),
      currentValueText: `${ccu.toLocaleString()} CCU`,
      significance: 'Roblox Discovery algorithm starts recommending games with stable 100+ CCU to the "Recommended For You" page.'
    },
    {
      id: 'm-10k-dau',
      title: '10,000 Daily Active Users (DAU)',
      category: 'Players',
      thresholdText: '10,000 Daily Active Players',
      description: 'Your game has achieved viral momentum across TikTok, YouTube, and the Roblox front page.',
      unlocked: dau >= 10000,
      progress: Math.min(100, Math.round((dau / 10000) * 100)),
      currentValueText: `${dau.toLocaleString()} DAU`,
      significance: 'At 10,000 DAU, even casual 0.35 R$ ARPDAU generates steady qualifying DevEx payouts every single month.'
    },
    {
      id: 'm-devex-30k',
      title: 'DevEx Cashout Minimum Unlocked',
      category: 'DevEx',
      thresholdText: '≥ 30,000 Earned Robux / Month',
      description: 'You have reached the official threshold required by Roblox to convert virtual Robux into real fiat currency.',
      unlocked: monthlyNetRobux >= 30000,
      progress: Math.min(100, Math.round((monthlyNetRobux / 30000) * 100)),
      currentValueText: `${monthlyNetRobux.toLocaleString()} Net R$`,
      significance: 'You can now submit your first cashout request on the Roblox Creator Hub for $105.00 USD (~£82.00 GBP).'
    },
    {
      id: 'm-tax-allowance',
      title: 'Income Exceeds UK Personal Allowance',
      category: 'Tax',
      thresholdText: '£12,570 / Year (£1,047.50 / Mo)',
      description: 'Your projected annual DevEx earnings now exceed the UK tax-free Personal Allowance (£12,570).',
      unlocked: annualGbp >= 12570,
      progress: Math.min(100, Math.round((annualGbp / 12570) * 100)),
      currentValueText: `£${Math.round(annualGbp).toLocaleString()} / yr`,
      significance: 'Statutory milestone: You are now legally required to register for Self Assessment with HMRC and declare trading profits.'
    },
    {
      id: 'm-fulltime-wage',
      title: 'Full-Time UK Average Wage',
      category: 'Studio',
      thresholdText: '£35,000 / Year (£2,916 / Mo)',
      description: 'Your Roblox creation now generates earnings equivalent to a full-time median UK software engineer salary.',
      unlocked: annualGbp >= 35000,
      progress: Math.min(100, Math.round((annualGbp / 35000) * 100)),
      currentValueText: `£${Math.round(annualGbp).toLocaleString()} / yr`,
      significance: 'Enables solo creators to transition to full-time independent Roblox game development.'
    },
    {
      id: 'm-higher-tax',
      title: 'UK Higher Rate Tax Threshold',
      category: 'Tax',
      thresholdText: '£50,270 / Year (£4,189 / Mo)',
      description: 'You have entered the UK 40% Higher Rate tax band.',
      unlocked: annualGbp >= 50270,
      progress: Math.min(100, Math.round((annualGbp / 50270) * 100)),
      currentValueText: `£${Math.round(annualGbp).toLocaleString()} / yr`,
      significance: 'At this income level, tax advisors strongly recommend incorporating a UK Limited Company (Ltd) to cap tax liability at 19%-25% Corporation Tax.'
    },
    {
      id: 'm-six-figure',
      title: 'Six-Figure Studio Milestone',
      category: 'Studio',
      thresholdText: '£100,000 / Year (£8,333 / Mo)',
      description: 'Your game has joined the elite top 0.1% tier of Roblox experiences worldwide.',
      unlocked: annualGbp >= 100000,
      progress: Math.min(100, Math.round((annualGbp / 100000) * 100)),
      currentValueText: `£${Math.round(annualGbp).toLocaleString()} / yr`,
      significance: 'Provides the financial backing to hire 3D modelers, animators, and sound designers to build multi-game franchises.'
    }
  ];
}

export function calculateUkTaxBands(annualProfit: number) {
  let personalAllowance = 12570;
  if (annualProfit > 100000) {
    const reduction = (annualProfit - 100000) / 2;
    personalAllowance = Math.max(0, 12570 - reduction);
  }

  const taxableIncome = Math.max(0, annualProfit - personalAllowance);

  let basicTax = 0;
  let higherTax = 0;
  let additionalTax = 0;

  const basicBandLimit = Math.max(0, 50270 - personalAllowance);
  const higherBandLimit = Math.max(0, 125140 - personalAllowance);

  if (taxableIncome > 0) {
    const basicTaxable = Math.min(taxableIncome, basicBandLimit);
    basicTax = basicTaxable * 0.20;

    if (taxableIncome > basicBandLimit) {
      const higherTaxable = Math.min(taxableIncome - basicBandLimit, higherBandLimit - basicBandLimit);
      higherTax = higherTaxable * 0.40;

      if (taxableIncome > higherBandLimit) {
        const additionalTaxable = taxableIncome - higherBandLimit;
        additionalTax = additionalTaxable * 0.45;
      }
    }
  }

  const totalIncomeTax = basicTax + higherTax + additionalTax;

  // Class 4 National Insurance (2024/25: 6% between £12,570 and £50,270, 2% above)
  let class4NI = 0;
  if (annualProfit > 12570) {
    const niBand1 = Math.min(annualProfit - 12570, 50270 - 12570);
    const niBand2 = Math.max(0, annualProfit - 50270);
    class4NI = (niBand1 * 0.06) + (niBand2 * 0.02);
  }

  const totalAnnualLiability = totalIncomeTax + class4NI;
  const netAnnualTakeHome = annualProfit - totalAnnualLiability;
  const effectiveTaxRate = annualProfit > 0 ? (totalAnnualLiability / annualProfit) * 100 : 0;

  return {
    personalAllowance,
    basicTax,
    higherTax,
    additionalTax,
    totalIncomeTax,
    class4NI,
    totalAnnualLiability,
    netAnnualTakeHome,
    effectiveTaxRate,
    monthly: {
      grossProfit: annualProfit / 12,
      incomeTax: totalIncomeTax / 12,
      nationalInsurance: class4NI / 12,
      totalLiability: totalAnnualLiability / 12,
      netTakeHome: netAnnualTakeHome / 12
    }
  };
}
