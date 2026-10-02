import React, { useState } from 'react';
import { LUAU_CODE_TEMPLATES, LuauScriptTemplate } from '../data/luauCodeTemplates';
import { Copy, Check, ShieldAlert, Code2, FolderTree, Terminal, Layers, Database, CreditCard, Sparkles, Filter } from 'lucide-react';
import { sounds } from '../utils/audio';

export const CodeGenerator: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('gamepass-purchase-checks');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Scripts', icon: Layers },
    { id: 'gamepass', label: 'GamePass Checks', icon: CreditCard },
    { id: 'datastore', label: 'DataStore Saving', icon: Database },
    { id: 'monetization', label: 'Receipts & Prompts', icon: Code2 },
    { id: 'mechanics', label: 'Game Mechanics', icon: Sparkles },
  ];

  const filteredTemplates = LUAU_CODE_TEMPLATES.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  const currentTemplate =
    filteredTemplates.find((t) => t.id === selectedTemplateId) ||
    filteredTemplates[0] ||
    LUAU_CODE_TEMPLATES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentTemplate.code);
    sounds.playSuccess();
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
              <span>Production-Ready Luau Script Library</span>
            </div>
            <h1 className="text-xl font-bold text-white font-display">
              Roblox Studio Modular Luau Script Library
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Server-authoritative, copy-pasteable scripts for GamePass verification, bulletproof DataStore saving, receipt processing, and daily login retention.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Script!' : 'Copy Current Script'}</span>
            </button>

            <a
              href={`https://arena.ai/agent?prompt=${encodeURIComponent(`Here is a Roblox Luau script for ${currentTemplate.title}:\n\n` + currentTemplate.code)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCopyCode}
              className="px-3.5 py-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 hover:text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm group"
              title="Opens Arena.ai/agent with this Luau script pre-loaded"
            >
              <span>Send prompt to Arena.ai/agent</span>
            </a>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/80">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat.id);
                  const firstOfCat = LUAU_CODE_TEMPLATES.find(
                    (t) => cat.id === 'all' || t.category === cat.id
                  );
                  if (firstOfCat) setSelectedTemplateId(firstOfCat.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isCatActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'bg-[#0b0f17] border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Script Tabs under active category */}
        <div className="flex gap-2 overflow-x-auto pb-1 mt-3">
          {filteredTemplates.map((tmpl) => {
            const isSelected = tmpl.id === currentTemplate.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTemplateId(tmpl.id);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-display">
                {currentTemplate.title}
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 uppercase">
                {currentTemplate.category}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
              <span>Roblox Studio Destination:</span>
              <code className="text-emerald-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[11px]">
                {currentTemplate.location}
              </code>
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-sm">
            {currentTemplate.description}
          </div>
        </div>

        {/* Security Alert Callout */}
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
            <span className="font-mono text-slate-400 text-[11px]">{currentTemplate.location}</span>
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

      {/* Integration Guide Grid */}
      <div className="bg-[#101726] border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-bold text-white mb-3">
          How to Deploy These Scripts in Roblox Studio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-emerald-400 font-mono font-bold block mb-1">01. Server vs Client</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Place DataStore & GamePass scripts in <strong>ServerScriptService</strong>. Exploiters have zero access to ServerScriptService.
            </p>
          </div>
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-emerald-400 font-mono font-bold block mb-1">02. Enable API Access</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              In Studio, open <strong>Home &gt; Game Settings &gt; Security</strong> and enable <strong>"Enable Studio Access to API Services"</strong> so DataStores function.
            </p>
          </div>
          <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3">
            <span className="text-emerald-400 font-mono font-bold block mb-1">03. BindToClose Safety</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              The DataStore script includes <strong>game:BindToClose</strong>, guaranteeing that if servers crash or update, all player stats save to the cloud first.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
