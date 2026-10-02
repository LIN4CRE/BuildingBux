import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertTriangle, ExternalLink, HelpCircle, RotateCcw, ShieldCheck, ChevronDown, ChevronUp, Download, Printer, FileText } from 'lucide-react';
import { sounds } from '../utils/audio';

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
  const [developerName, setDeveloperName] = useState<string>('Roblox Developer');
  const [taxYear, setTaxYear] = useState<string>('2024/2025');

  useEffect(() => {
    try {
      localStorage.setItem('blox_hmrc_checklist', JSON.stringify(completedIds));
    } catch (e) {
      console.warn('Could not save checklist to localStorage', e);
    }
  }, [completedIds]);

  const toggleItem = (id: string) => {
    sounds.playClick();
    setCompletedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (!prev.includes(id)) {
        sounds.playSuccess();
      }
      return updated;
    });
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

  // Generate printable formatted tax report HTML
  const generateReportHtml = () => {
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let itemsHtml = '';
    HMRC_CHECKLIST_ITEMS.forEach((item, index) => {
      const isDone = completedIds.includes(item.id);
      itemsHtml += `
        <tr style="border-bottom: 1px solid #e2e8f0; ${isDone ? 'background-color: #f0fdf4;' : ''}">
          <td style="padding: 10px; font-weight: 600; width: 40px; text-align: center;">
            ${isDone ? '<span style="color: #16a34a; font-size: 16px;">✓</span>' : '<span style="color: #94a3b8;">○</span>'}
          </td>
          <td style="padding: 10px;">
            <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${item.title}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">${item.summary}</div>
            ${item.deadline ? `<div style="font-size: 10px; color: #b45309; font-weight: 600; margin-top: 3px;">Deadline: ${item.deadline}</div>` : ''}
          </td>
          <td style="padding: 10px; font-size: 11px; color: #64748b; width: 140px;">
            ${item.category}
          </td>
          <td style="padding: 10px; font-weight: 700; font-size: 12px; width: 100px; text-align: right; color: ${isDone ? '#16a34a' : '#64748b'};">
            ${isDone ? 'COMPLETED' : 'PENDING'}
          </td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>HMRC Self Assessment Compliance Audit - ${developerName}</title>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          h1 { margin: 0; font-size: 22px; color: #0f172a; }
          .subtitle { color: #64748b; font-size: 12px; margin-top: 4px; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 24px; display: flex; justify-content: space-between; font-size: 12px; }
          .progress-bar-container { background: #e2e8f0; height: 10px; border-radius: 5px; overflow: hidden; margin-top: 8px; }
          .progress-bar-fill { background: #16a34a; height: 100%; width: ${percentCompleted}%; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { text-align: left; background: #f1f5f9; padding: 10px; font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1; }
          .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>UK HMRC Self Assessment Compliance Record</h1>
            <div class="subtitle">Roblox Developer Exchange (DevEx) Sole Trader Tax Audit Documentation</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #64748b;">
            <div>Date Generated: <strong>${dateStr}</strong></div>
            <div>Tax Year: <strong>${taxYear}</strong></div>
          </div>
        </div>

        <div class="meta-box">
          <div>
            <div>Developer / Creator: <strong>${developerName}</strong></div>
            <div style="margin-top: 4px;">Business Type: <strong>Sole Trader (Video Game Development / DevEx)</strong></div>
          </div>
          <div style="text-align: right; min-width: 180px;">
            <div>Audit Status: <strong>${completedCount} / ${totalCount} Steps Completed (${percentCompleted}%)</strong></div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill"></div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">Status</th>
              <th>Requirement & Action Item</th>
              <th style="width: 140px;">Category</th>
              <th style="width: 100px; text-align: right;">State</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 24px; padding: 12px; background: #fefce8; border: 1px solid #fef08a; border-radius: 6px; font-size: 11px; color: #713f12;">
          <strong>Official Record Notice:</strong> Keep this document along with your Tipalti DevEx payout receipts and UK bank statements. HM Revenue and Customs requires sole traders to maintain financial transaction records for a minimum of 5 years after 31 January of the relevant tax year.
        </div>

        <div class="footer">
          Generated via BloxMonetize Studio · UK Form W-8BEN &amp; HMRC Sole Trader Compliance Framework.
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
  };

  // Export PDF via Print Preview dialog
  const handlePrintPdf = () => {
    sounds.playClick();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateReportHtml());
      printWindow.document.close();
    }
  };

  // Download raw HTML/PDF backup file
  const handleDownloadReport = () => {
    sounds.playSuccess();
    const htmlContent = generateReportHtml();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hmrc-tax-checklist-${taxYear.replace('/', '-')}-${developerName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#101726] border border-slate-800 rounded-xl p-6 space-y-6">
      {/* Header with Progress Bar & Export Action */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>HMRC Sole Trader Compliance Tracker</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              UK Developer Self-Assessment Readiness Checklist
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Audit your Roblox DevEx earnings against UK tax law, track registration deadlines, and export an official PDF audit record.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Prints or saves this checklist as an official PDF document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Formatted PDF</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download HTML tax backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Record</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              title="Reset checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Developer Customization Inputs for PDF Export */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0b0f17] border border-slate-800 p-3 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 whitespace-nowrap">Developer Name / Handle:</span>
            <input
              type="text"
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white text-xs font-medium w-full focus:outline-none focus:border-emerald-500"
              placeholder="e.g. John Doe / BloxDev123"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 whitespace-nowrap">UK Tax Year:</span>
            <select
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white text-xs font-mono font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="2024/2025">2024/2025 (Current)</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Compliance Progress</span>
            <span className="font-mono text-emerald-400 font-bold">
              {completedCount} of {totalCount} Completed ({percentCompleted}%)
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
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
