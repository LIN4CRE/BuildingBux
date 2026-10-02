import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertTriangle, ExternalLink, HelpCircle, RotateCcw, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'Registration' | 'Banking & Records' | 'Deductions' | 'Filing & Deadlines';
  title: string;
  summary: string;
  guidance: string;
  pitfall: string;
  govUkLink?: string;
  deadline?: string;
}

const HMRC_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'trading-allowance',
    category: 'Registration',
    title: '1. Track Earnings vs £1,000 Trading Allowance',
    summary: 'Determine whether your gross Roblox DevEx cashouts exceed £1,000 across the UK tax year (6 April – 5 April).',
    guidance: 'If your total gross income from game development, dev products, commissions, and side hustles is £1,000 or less in a tax year, it is completely tax-free under HMRC\'s Trading Allowance and you do not need to notify HMRC or register.',
    pitfall: 'The £1,000 threshold applies to GROSS turnover (total cashout received), NOT your net profit after expenses.',
    govUkLink: 'https://www.gov.uk/guidance/tax-free-allowances-on-property-and-trading-income'
  },
  {
    id: 'gov-gateway',
    category: 'Registration',
    title: '2. Create a Government Gateway Account',
    summary: 'Set up your digital identity on GOV.UK to access HMRC online tax services.',
    guidance: 'Go to GOV.UK and create a Government Gateway account using your UK National Insurance (NI) Number and passport or UK driving licence for identity verification.',
    pitfall: 'Do not lose your 12-character User ID or password. HMRC will send verification codes to your mobile phone.',
    govUkLink: 'https://www.gov.uk/log-in-register-hmrc-online-services'
  },
  {
    id: 'register-sole-trader',
    category: 'Registration',
    title: '3. Register for Self Assessment as a Sole Trader',
    summary: 'Notify HMRC that you are operating as a self-employed game creator once your gross earnings exceed £1,000.',
    guidance: 'Register online via GOV.UK under the business type "Sole Trader" (e.g. "Software and Video Game Development"). Must be completed by 5 October following the end of the tax year in which you earned the money.',
    pitfall: 'Missing the 5 October registration deadline can result in late notification penalties from HMRC.',
    deadline: '5 October following tax year end',
    govUkLink: 'https://www.gov.uk/register-for-self-assessment/self-employed'
  },
  {
    id: 'obtain-utr',
    category: 'Registration',
    title: '4. Obtain Your 10-Digit UTR Number',
    summary: 'Receive your Unique Taxpayer Reference (UTR) letter from HMRC in the post.',
    guidance: 'After registering, HMRC will generate and post a 10-digit UTR number to your home address within 10 to 15 working days. This number identifies you for all future UK tax returns.',
    pitfall: 'You cannot submit a Self Assessment tax return without this 10-digit number, so register weeks in advance of filing deadlines.'
  },
  {
    id: 'dedicated-bank-account',
    category: 'Banking & Records',
    title: '5. Open a Dedicated Sole Trader / Business Account',
    summary: 'Separate your Roblox DevEx earnings from personal grocery and household spending.',
    guidance: 'Open a dedicated UK account (e.g. Monzo, Starling, Revolut Business, or high-street bank). Set Tipalti to deposit directly into this account so your audit trail is immaculate.',
    pitfall: 'Co-mingling personal savings with game revenue makes calculating tax deductions painful and invites scrutiny during HMRC audits.'
  },
  {
    id: 'devex-transaction-log',
    category: 'Banking & Records',
    title: '6. Maintain an Exchange Rate Transaction Log',
    summary: 'Record the exact date, gross Robux, DevEx USD payout, and actual GBP (£) received in your bank.',
    guidance: 'For every cashout, save: (1) Roblox Creator Hub DevEx confirmation email, (2) Tipalti payment receipt, and (3) Bank statement showing the final GBP credit with the date.',
    pitfall: 'HMRC requires you to keep all financial transaction records and invoices for at least 5 years after the 31 January submission deadline.'
  },
  {
    id: 'tax-pot-setaside',
    category: 'Banking & Records',
    title: '7. Set Aside 20% to 30% into a Tax Reserve Pot',
    summary: 'Automatically route a percentage of each DevEx cashout into a locked savings pot for tax day.',
    guidance: 'If you expect your total annual income to exceed the £12,570 Personal Allowance, move 25% of every payout into a tax savings pot. This ensures you are never surprised when your tax bill arrives.',
    pitfall: 'Spending 100% of your DevEx cashouts as soon as they hit your bank will leave you stranded when your Self Assessment bill is due.'
  },
  {
    id: 'allowable-expenses',
    category: 'Deductions',
    title: '8. Track & Categorize Allowable Business Expenses',
    summary: 'Legally reduce your taxable profit by deducting legitimate game development expenses.',
    guidance: 'You only pay tax on your Net Profit (Income minus Expenses). Keep receipts for: (1) PC hardware & monitors, (2) Blender plugins & software subscriptions, (3) Sound effects & music licenses, (4) Roblox Ads and sponsor campaigns, and (5) HMRC simplified home office allowance (£10–£26/mo).',
    pitfall: 'Personal games or clothing cannot be claimed. Expenses must be "wholly and exclusively" for your game development business.',
    govUkLink: 'https://www.gov.uk/expenses-if-youre-self-employed'
  },
  {
    id: 'file-self-assessment',
    category: 'Filing & Deadlines',
    title: '9. File Your Online Self Assessment by 31 January',
    summary: 'Complete your online tax return on GOV.UK before midnight on 31 January.',
    guidance: 'Log in to your Government Gateway account, fill in your DevEx turnover in the Self-Employment (SA103) section, declare your allowable expenses, and submit.',
    pitfall: 'Missing the 31 January midnight deadline results in an automatic £100 late filing penalty, even if you owe zero tax!',
    deadline: 'Midnight 31 January'
  },
  {
    id: 'pay-tax-and-nics',
    category: 'Filing & Deadlines',
    title: '10. Pay Income Tax & National Insurance Contributions',
    summary: 'Pay your calculated tax bill and Class 4 National Insurance before 31 January.',
    guidance: 'Pay online via direct bank transfer or approved debit card through GOV.UK using your UTR number as the payment reference.',
    pitfall: 'If your tax bill is over £1,000, HMRC will also ask for "Payments on Account" (advance payments toward next year\'s bill). Factor this into your cash flow.'
  }
];

export const UkTaxChecklist: React.FC = () => {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('blox_hmrc_checklist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    try {
      localStorage.setItem('blox_hmrc_checklist', JSON.stringify(completedIds));
    } catch (e) {
      console.warn('Could not save checklist to localStorage', e);
    }
  }, [completedIds]);

  const toggleItem = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset all checklist progress?')) {
      setCompletedIds([]);
    }
  };

  const categories = ['all', 'Registration', 'Banking & Records', 'Deductions', 'Filing & Deadlines'];

  const filteredItems = HMRC_CHECKLIST_ITEMS.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  const completedCount = completedIds.length;
  const totalCount = HMRC_CHECKLIST_ITEMS.length;
  const percentCompleted = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header with Progress Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>HMRC Sole Trader Compliance Tracker</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              UK Developer Self-Assessment Readiness Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Step-by-step audit to ensure your Roblox DevEx earnings comply with UK tax law and avoid HMRC penalties.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-emerald-400">
                {completedCount} of {totalCount} Completed
              </div>
              <div className="text-[11px] text-slate-400">
                {percentCompleted}% HMRC Ready
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              title="Reset checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Trading Allowance (£1k)</span>
            <span>Registration (5 Oct)</span>
            <span>Tax Return (31 Jan)</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 bg-[#0b0f17] border border-slate-800/80'
            }`}
          >
            {cat === 'all' ? 'All Steps' : cat}
          </button>
        ))}
      </div>

      {/* Checklist Accordion Items */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => {
          const isDone = completedIds.includes(item.id);
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-lg border transition-all ${
                isDone
                  ? 'bg-emerald-950/10 border-emerald-500/30'
                  : 'bg-[#0b0f17] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Item Summary Row */}
              <div className="p-3.5 flex items-start justify-between gap-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex items-start gap-3 text-left cursor-pointer group flex-1"
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {item.category}
                      </span>
                      {item.deadline && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                          Deadline: {item.deadline}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer shrink-0 mt-0.5"
                  title="Toggle details"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded Detailed Guidance */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3 text-xs bg-slate-900/40 rounded-b-lg">
                  <div>
                    <strong className="text-slate-200 block mb-1">Official HMRC Guidance:</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {item.guidance}
                    </p>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-500/30 rounded p-2.5 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-amber-200/90 text-[11px] leading-relaxed">
                      <strong className="text-amber-300">Common Mistake: </strong>
                      {item.pitfall}
                    </p>
                  </div>

                  {item.govUkLink && (
                    <div className="pt-1">
                      <a
                        href={item.govUkLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                      >
                        <span>View Official Guidance on GOV.UK</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
