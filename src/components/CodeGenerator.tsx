import React, { useState } from 'react';
import { LUAU_CODE_TEMPLATES, LuauScriptTemplate } from '../data/luauCodeTemplates';
import { Copy, Check, ShieldAlert, Code2, FolderTree, Terminal } from 'lucide-react';

export const CodeGenerator: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('receipt-processor');
  const [copied, setCopied] = useState<boolean>(false);

  const currentTemplate = LUAU_CODE_TEMPLATES.find((t) => t.id === selectedTemplateId) || LUAU_CODE_TEMPLATES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentTemplate.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Production-Ready Luau Scripts</span>
            </div>
            <h1 className="text-xl font-bold text-white font-display">
              Roblox Studio Server-Authoritative Marketplace Code
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Copy-pasteable, secure Luau scripts engineered to handle Developer Products, Game Passes, and Premium Engagement without double-spending or exploit risks.
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start md:self-auto"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Script'}</span>
          </button>
        </div>

        {/* Script Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/80">
          {LUAU_CODE_TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplateId;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50 shadow-sm'
                    : 'bg-[#0b0f17] border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{tmpl.title.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Script Details Card */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white font-display">
              {currentTemplate.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <FolderTree className="w-3 h-3 text-emerald-400" />
              <span>Studio Location:</span>
              <code className="text-emerald-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                {currentTemplate.location}
              </code>
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-sm">
            {currentTemplate.description}
          </div>
        </div>

        {/* Security Warning Callout */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2.5 text-xs text-amber-200/90">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Security Rule: </span>
            {currentTemplate.securityNote}
          </div>
        </div>

        {/* Code Block Container */}
        <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#06090f]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0b0f17] border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">{currentTemplate.location}</span>
            <button
              onClick={handleCopyCode}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono leading-relaxed text-slate-200 overflow-x-auto max-h-[500px]">
            <code>{currentTemplate.code}</code>
          </pre>
        </div>
      </div>

      {/* Roblox Studio Setup Instructions */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-bold text-white mb-3">
          How to Install These Scripts into Roblox Studio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-emerald-400 font-mono font-bold block mb-1">01. Open Explorer</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              In Roblox Studio, go to the <strong>View</strong> tab and enable <strong>Explorer</strong> and <strong>Properties</strong>.
            </p>
          </div>
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-emerald-400 font-mono font-bold block mb-1">02. Insert Server Script</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Hover over <strong>ServerScriptService</strong>, click the <strong>+</strong> button, and insert a standard <strong>Script</strong> (not LocalScript).
            </p>
          </div>
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-emerald-400 font-mono font-bold block mb-1">03. Paste & Enable API</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Paste the code, then go to <strong>Game Settings &gt; Security</strong> and toggle on <strong>"Enable Studio Access to API Services"</strong> so DataStores work in testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
