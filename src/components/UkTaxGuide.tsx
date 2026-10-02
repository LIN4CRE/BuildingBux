import React, { useState } from 'react';
import { Landmark, FileText, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink, HelpCircle, AlertCircle, ListChecks } from 'lucide-react';
import { UkTaxChecklist } from './UkTaxChecklist';
import { sounds } from '../utils/audio';

export const UkTaxGuide: React.FC = () => {
  const [activeView, setActiveView] = useState<'walkthrough' | 'checklist'>('walkthrough');
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: 'Roblox ID Verification & DevEx Application',
      subtitle: 'Veriff government ID check & submitting your first cashout request',
    },
    {
      num: 2,
      title: 'Tipalti Portal Registration',
      subtitle: 'Linking your UK bank account (Sort Code & Account Number)',
    },
    {
      num: 3,
      title: 'Form W-8BEN (0% US Tax Exemption)',
      subtitle: 'Claiming the US-UK Double Taxation Treaty Article 12',
    },
    {
      num: 4,
      title: 'HMRC & UK Sole Trader Compliance',
      subtitle: 'The £1,000 Trading Allowance, Self Assessment, and expenses',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
              <Landmark className="w-3.5 h-3.5" />
              <span>United Kingdom Developer Playbook</span>
            </div>
            <h1 className="text-xl font-bold text-white font-display">
              Exchanging Robux into British Pounds (£): Complete UK Guide
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Everything you need to navigate Tipalti, claim 0% US withholding tax via Form W-8BEN, and stay compliant with HMRC as a UK-based game creator.
            </p>
          </div>

          {/* Sub-view switcher */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start md:self-auto">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('walkthrough');
              }}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'walkthrough'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cashout Walkthrough</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveView('checklist');
              }}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeView === 'checklist'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>HMRC Tax Checklist</span>
            </button>
          </div>
        </div>

        {/* Step Tabs (only when in walkthrough mode) */}
        {activeView === 'walkthrough' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-6 pt-6 border-t border-slate-800/80">
            {steps.map((s) => {
              const isActive = activeStep === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => {
                    sounds.playClick();
                    setActiveStep(s.num);
                  }}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 border-emerald-500/50 shadow-sm'
                      : 'bg-[#0b0f17] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                      STEP 0{s.num}
                    </span>
                  </div>
                  <div className={`text-xs font-semibold leading-snug ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {s.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {s.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW 1: HMRC Self Assessment Checklist */}
      {activeView === 'checklist' && (
        <UkTaxChecklist />
      )}

      {/* VIEW 2: Cashout Steps Walkthrough */}
      {activeView === 'walkthrough' && (
        <>
          {/* Step 1: Roblox ID & DevEx Submit */}
          {activeStep === 1 && (
            <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-emerald-400">STEP 01</span>
                <h2 className="text-lg font-bold text-white font-display mt-0.5">
                  Roblox ID Verification & Submitting the DevEx Request
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Before Roblox can pay you real cash, you must verify your identity through their fraud prevention portal.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Phase A: Identity Verification (Veriff)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Log into Roblox, go to <strong>Settings &gt; Account Info</strong>, and click <strong>Verify My Age</strong>. You will be prompted to scan a QR code with your smartphone and present:
                  </p>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-5">
                    <li>A valid <strong>UK Passport</strong> or <strong>UK Full/Provisional Driving Licence</strong>.</li>
                    <li>A live selfie matching the photo on your government document.</li>
                    <li>Takes between 5 minutes to 2 hours for automated approval.</li>
                  </ul>
                </div>

                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Phase B: Submitting the DevEx Request
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Go to the <strong>Roblox Creator Hub &gt; Creations &gt; Developer Exchange (DevEx)</strong>. If you have at least 30,000 Earned Robux, the <strong>Cash Out</strong> button will become active.
                  </p>
                  <div className="bg-slate-900 border border-slate-800 rounded p-3 text-xs text-slate-300 space-y-1 font-mono">
                    <div>• Choose the amount of Robux to exchange (e.g. 30,000 or 100,000)</div>
                    <div>• Enter your legal name and contact email address</div>
                    <div>• Submit the form</div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Roblox's finance department reviews requests within <strong>3 to 5 business days</strong> to verify that your Robux was legitimately earned from game sales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tipalti Setup */}
          {activeStep === 2 && (
            <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-emerald-400">STEP 02</span>
                <h2 className="text-lg font-bold text-white font-display mt-0.5">
                  Tipalti Registration & UK Bank Account Linking
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Once Roblox approves your initial request, you will receive an invitation email from Tipalti (Roblox's payment partner).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-400" />
                    Recommended: Direct Bank Wire (BACS / IBAN)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Choose <strong>Direct Deposit / Wire Transfer</strong> to your UK bank (e.g. Barclays, HSBC, Lloyds, NatWest, Monzo, Starling).
                  </p>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>• <strong>Bank Name:</strong> e.g. Monzo Bank Ltd</div>
                    <div>• <strong>Sort Code:</strong> 6 digits (e.g. 04-00-04)</div>
                    <div>• <strong>Account Number:</strong> 8 digits</div>
                    <div>• <strong>Currency:</strong> Select <strong>GBP (£)</strong></div>
                  </div>
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-2.5 text-[11px] text-emerald-300">
                    Funds convert from USD at institutional wholesale exchange rates directly into your UK bank with low flat transaction fees.
                  </div>
                </div>

                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Alternative: PayPal (Beware of FX fees)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You can also receive payout into a UK PayPal account. However, PayPal charges a <strong>3.5% to 4% foreign exchange conversion fee</strong> when converting USD to GBP (£).
                  </p>
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded p-2.5 text-[11px] text-amber-300">
                    On a £1,000 cashout, PayPal may take ~£35-£40 in hidden exchange spreads compared to direct bank deposit.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Form W-8BEN */}
          {activeStep === 3 && (
            <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-emerald-400">STEP 03</span>
                <h2 className="text-lg font-bold text-white font-display mt-0.5">
                  IRS Form W-8BEN: How to Legally Avoid 30% US Withholding
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Inside Tipalti, non-US citizens must complete Form W-8BEN. Doing this correctly saves 30% of your earnings.
                </p>
              </div>

              <div className="bg-teal-950/20 border border-teal-500/40 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-teal-200">The US-UK Double Taxation Treaty</h3>
                  <p className="text-xs text-teal-300/80 mt-1 leading-relaxed">
                    Under the official US-UK Income Tax Treaty (Article 12 - Royalties), UK residents are exempt from US federal withholding tax. By claiming this treaty on Form W-8BEN, the withholding rate drops from <strong>30% down to 0%</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white">How to Complete Each Section on Tipalti:</h3>

                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-200 font-semibold">
                    <span>Part I, Line 1: Name & Permanent Address</span>
                    <span className="font-mono text-emerald-400 text-[11px]">UK Resident</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Must match your legal name and UK residence address registered with your bank.
                  </p>
                </div>

                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-200 font-semibold">
                    <span>Part I, Line 6a: Foreign Tax Identifying Number (FTIN)</span>
                    <span className="font-mono text-emerald-400 text-[11px]">Crucial Field!</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Enter your <strong>UK National Insurance (NI) Number</strong> (e.g. QQ 12 34 56 A) or your 10-digit <strong>Unique Taxpayer Reference (UTR)</strong> from HMRC. This proves to the IRS that you pay taxes in the UK.
                  </p>
                </div>

                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-200 font-semibold">
                    <span>Part II, Line 9 & 10: Claim of Tax Treaty Benefits</span>
                    <span className="font-mono text-emerald-400 text-[11px]">0% Withholding</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Select <strong>United Kingdom</strong> as your country. In Line 10, cite <strong>Article 12 (Royalties / Computer Software)</strong> and specify a <strong>0% rate of withholding</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: HMRC & UK Taxes */}
          {activeStep === 4 && (
            <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400">STEP 04</span>
                  <h2 className="text-lg font-bold text-white font-display mt-0.5">
                    HMRC Compliance & UK Sole Trader Registration
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Once DevEx money arrives in your UK bank, how do you report it to HM Revenue and Customs?
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('checklist')}
                  className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>Open HMRC Checklist</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-2">
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Under £1,000 / year: Tax-Free Allowance
                  </h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    The UK government offers a <strong>£1,000 Trading Allowance</strong> every tax year (6 April to 5 April). If your total gross income from game development, freelancing, and side hustles is less than £1,000 in a year, you do not need to register with HMRC or file a tax return.
                  </p>
                </div>

                <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-2">
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Over £1,000 / year: Register as Sole Trader
                  </h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    If your gross DevEx earnings exceed £1,000 in a tax year, you must register as a <strong>Sole Trader</strong> on GOV.UK and complete an annual Self Assessment tax return.
                  </p>
                </div>
              </div>

              <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-4 space-y-3">
                <h3 className="text-xs font-bold text-white">
                  Allowable Business Expenses (Reducing Your Tax Bill):
                </h3>
                <p className="text-xs text-slate-400">
                  You only pay tax on your <strong>profit</strong> (Income minus Expenses). Legitimate expenses you can deduct from your DevEx income include:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    • <strong>PC Hardware & Monitors:</strong> Dev PC, graphics card, mouse, keyboard.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    • <strong>Software & Asset Licenses:</strong> Blender plugins, Adobe Creative Cloud, sound effects.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    • <strong>Roblox Advertising:</strong> Robux or fiat currency spent on Roblox Ads or TikTok promotions.
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    • <strong>Home Office Allowance:</strong> Flat rate £10-£26/month HMRC simplified expense for home working.
                  </div>
                </div>
              </div>

              {/* Official Portals Link Strip */}
              <div className="bg-[#0e1420] border border-slate-800 rounded-lg p-4 space-y-2.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official GOV.UK &amp; Tipalti Portals</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href="https://www.gov.uk/register-for-self-assessment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#0b0f17] hover:bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 flex items-center justify-between group"
                  >
                    <span>GOV.UK Self Assessment</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                  </a>
                  <a
                    href="https://www.gov.uk/guidance/tax-free-allowances-on-property-and-trading-income"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#0b0f17] hover:bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 flex items-center justify-between group"
                  >
                    <span>£1,000 Trading Allowance</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                  </a>
                  <a
                    href="https://suppliers.tipalti.com/roblox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#0b0f17] hover:bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 flex items-center justify-between group"
                  >
                    <span>Tipalti Roblox Supplier</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
