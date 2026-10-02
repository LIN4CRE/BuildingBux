import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, ShieldCheck, AlertCircle, ExternalLink, CheckCircle2, DollarSign, UserCheck, Landmark, FileText, Sparkles } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon, DevExVaultIcon } from './Icons';
import { sounds } from '../utils/audio';

interface FaqItem {
  id: string;
  category: 'Eligibility' | 'Age & Identity' | 'Banking & Tipalti' | 'Taxes & W-8BEN' | 'Revenue & Groups';
  question: string;
  answer: string;
  proTip?: string;
  officialLink?: { label: string; url: string };
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'min-threshold',
    category: 'Eligibility',
    question: 'What is the exact minimum Robux requirement for DevEx?',
    answer: 'You must have a minimum of 30,000 "Earned Robux" in your account balance. At the official exchange rate of $0.0035 USD per Robux, 30,000 Robux converts to exactly $105.00 USD (approximately £81.90 GBP). You cannot submit requests below this 30k threshold.',
    proTip: 'Only "Earned Robux" qualify. Robux acquired through buying Robux with real money, trading limiteds, or gift cards DO NOT qualify for DevEx and will cause your cashout to be rejected.',
    officialLink: { label: 'Official DevEx Terms of Use', url: 'https://en.help.roblox.com/hc/en-us/articles/203314100' }
  },
  {
    id: 'eligibility-checklist',
    category: 'Eligibility',
    question: 'What account requirements must be met before submitting a DevEx request?',
    answer: 'To qualify for DevEx, your Roblox account must: (1) Have at least 30,000 Earned Robux, (2) Have a verified email address, (3) Have an active 2-Factor Authentication (2FA) authenticator app or email 2FA enabled, (4) Have an active, approved Tipalti account, (5) Be an account in good standing with no recent severe Community Standards or Terms of Use violations, and (6) Be at least 13 years old.',
    proTip: 'Roblox Premium is NO LONGER strictly required to submit DevEx requests as of recent policy updates, though having it increases security trust scores.',
    officialLink: { label: 'Roblox Creator Hub DevEx Portal', url: 'https://create.roblox.com/dashboard/devex' }
  },
  {
    id: 'age-requirements',
    category: 'Age & Identity',
    question: 'What are the age requirements for Roblox DevEx cashouts?',
    answer: 'You must be at least 13 years of age at the time of submitting your DevEx application. If you are between 13 and 17 years old (a minor under legal age), you must obtain explicit permission and consent from a parent or legal guardian to participate in DevEx.',
    proTip: 'For developers aged 13-17, the Tipalti account, bank account, and tax form (W-8BEN) must be completed in coordination with your parent/guardian. If the bank account is in the parent\'s name, the Tipalti payee details must match the parent exactly.',
    officialLink: { label: 'Roblox DevEx FAQ for Minors', url: 'https://en.help.roblox.com/hc/en-us/articles/203314100' }
  },
  {
    id: 'bank-settings-bacs',
    category: 'Banking & Tipalti',
    question: 'Should UK creators choose Direct BACS/Wire or PayPal in Tipalti?',
    answer: 'ALWAYS choose Direct BACS or Wire Transfer to your UK bank account (Monzo, Barclays, Starling, HSBC, NatWest, Lloyds). PayPal charges an aggressive 3.5% to 4.5% foreign exchange spread markup when converting USD to GBP, meaning on a $3,500 cashout you could lose up to £120+ just in conversion fees! Tipalti\'s direct bank transfer uses commercial wholesale forex rates and deposits clean British Pounds directly into your UK account.',
    proTip: 'In Tipalti, set your payment method to "Direct Deposit / BACS / Wire" and provide your 6-digit UK Sort Code and 8-digit Bank Account Number.',
    officialLink: { label: 'Tipalti Roblox Supplier Portal', url: 'https://suppliers.tipalti.com/roblox' }
  },
  {
    id: 'bank-name-match',
    category: 'Banking & Tipalti',
    question: 'Why did my DevEx get rejected due to name mismatch?',
    answer: 'The single most common reason for first-time DevEx rejection is a name discrepancy. The legal name entered on your Tipalti registration MUST match the legal name on your government-issued photo ID (Passport/Driving Licence) and the account holder name on your UK bank statement character-for-character.',
    proTip: 'Do not use your Roblox username or studio team name on Tipalti unless you have a legally incorporated UK Limited Company (Ltd) with a matching company business bank account.',
  },
  {
    id: 'w8ben-treaty',
    category: 'Taxes & W-8BEN',
    question: 'How do UK creators avoid the 30% US withholding tax?',
    answer: 'Because Roblox is a US corporation based in California, US tax law requires 30% tax withholding unless an international tax treaty applies. The United Kingdom and the United States have an official bilateral tax treaty. When filling out Form W-8BEN in Tipalti, UK residents cite Treaty Article 12 (Royalties / Software), which reduces the US withholding tax rate from 30% down to 0%!',
    proTip: 'In Part I, Line 6a of Form W-8BEN, you MUST provide your UK National Insurance (NI) Number or 10-digit UTR number as your Foreign Tax Identifying Number (FTIN) to validate your UK tax residency.',
    officialLink: { label: 'IRS Form W-8BEN Instructions', url: 'https://www.irs.gov/forms-pubs/about-form-w-8-ben' }
  },
  {
    id: 'processing-timeline',
    category: 'Banking & Tipalti',
    question: 'How long does a DevEx cashout take from submission to bank deposit?',
    answer: 'Standard processing takes 3 to 7 business days: (1) Roblox internal review: 2 to 4 business days to audit your Robux earnings for security and fraud prevention, (2) Tipalti disbursement: 1 business day to dispatch funds, and (3) UK Bank clearing: 1 to 2 business days for BACS/wire arrival in your UK account.',
    proTip: 'First-time DevEx requests take slightly longer (up to 10-14 days) due to mandatory identity verification and tax document validation through Tipalti.',
  },
  {
    id: 'group-payouts',
    category: 'Revenue & Groups',
    question: 'Can I DevEx Robux earned through a Roblox Group or studio split?',
    answer: 'Yes! Robux earned through Game Passes, Developer Products, or avatar items sold inside a Group are classified as Earned Robux. When the Group Owner distributes funds via Group Payouts (Recurring or One-Time) to team members, the recipient receives them as Earned Robux eligible for DevEx.',
    proTip: 'Roblox holds group revenue in a pending security escrow for 14 to 30 days before payout distribution is permitted to protect against unauthorized group compromise.',
  },
  {
    id: 'uk-sole-trader-tax',
    category: 'Taxes & W-8BEN',
    question: 'Do I have to pay UK tax on my DevEx earnings?',
    answer: 'Yes. While the US-UK treaty protects you from US tax (0%), HM Revenue & Customs (HMRC) treats Roblox DevEx cashouts as self-employment / trading income. If your total gross trading income across the UK tax year (6 April – 5 April) exceeds the £1,000 Trading Allowance, you must register as a Sole Trader and file a Self Assessment tax return.',
    proTip: 'You only pay UK tax on your Net Profit (Gross Income minus allowable business expenses like PC hardware, Blender plugins, and Roblox Ads).',
    officialLink: { label: 'GOV.UK Self Assessment Registration', url: 'https://www.gov.uk/register-for-self-assessment' }
  }
];

export const CreatorFaq: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('min-threshold');

  const categories = ['All', 'Eligibility', 'Age & Identity', 'Banking & Tipalti', 'Taxes & W-8BEN', 'Revenue & Groups'];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.proTip && item.proTip.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const toggleAccordion = (id: string) => {
    sounds.playClick();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Official Developer Knowledgebase</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
            Roblox Creator & DevEx Payout FAQ
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Essential answers on Developer Exchange (DevEx) eligibility rules, age requirements for teen developers, setting up Tipalti for direct UK bank deposits, and claiming 0% US tax withholding.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search DevEx questions (e.g. 30k, age 13, Tipalti, BACS, W-8BEN)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0b0f17] p-1 border border-slate-800 rounded-lg text-xs overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Fact Banner Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#101726] border border-slate-800 rounded-lg p-3.5 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 shrink-0">
            <RobuxIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Minimum Threshold</div>
            <div className="text-xs font-bold text-white font-mono">30,000 R$ (~£81.90 GBP)</div>
          </div>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-lg p-3.5 flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Minimum Age</div>
            <div className="text-xs font-bold text-white font-mono">13+ Years (Guardian Consent 13-17)</div>
          </div>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-lg p-3.5 flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 shrink-0">
            <SterlingCoinIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">UK Bank Tipalti Method</div>
            <div className="text-xs font-bold text-white font-mono">Direct BACS / Wire (Avoid PayPal 4% FX)</div>
          </div>
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-[#101726] border border-slate-800 rounded-xl p-8 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-slate-500 mx-auto" />
            <h3 className="text-xs font-bold text-white">No questions matched your search query.</h3>
            <p className="text-[11px] text-slate-400">Try searching for "30000", "age", "bank", or "W-8BEN".</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-[#101726] border rounded-xl transition-all overflow-hidden ${
                  isExpanded ? 'border-emerald-500/40 shadow-sm' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {faq.category}
                    </span>
                    <h3 className="text-sm font-bold text-white pt-1">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 space-y-3 text-xs border-t border-slate-800/60 bg-[#090d16]">
                    <p className="text-slate-300 leading-relaxed pt-2">
                      {faq.answer}
                    </p>

                    {faq.proTip && (
                      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="text-emerald-200/90 leading-relaxed text-[11px]">
                          <strong className="text-emerald-300">Creator Tip: </strong>
                          {faq.proTip}
                        </div>
                      </div>
                    )}

                    {faq.officialLink && (
                      <div className="pt-1">
                        <a
                          href={faq.officialLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300 font-medium transition-colors"
                        >
                          <span>{faq.officialLink.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
