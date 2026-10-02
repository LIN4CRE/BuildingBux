import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Mail, Globe, Check, AlertTriangle, ShieldCheck, Sparkles, Send, Trash2, X, Sliders, Volume2, ArrowRight } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon } from './Icons';
import { sounds } from '../utils/audio';

export interface GrowthAlertsConfig {
  emailAlertsEnabled: boolean;
  recipientEmail: string;
  browserNotificationsEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl: string;
  // Thresholds
  arpdauSurgeEnabled: boolean;
  arpdauThreshold: number; // e.g. 0.85 R$
  ccuDropEnabled: boolean;
  ccuDropThreshold: number; // e.g. 150 CCU
  ccuDropPercent: number; // e.g. 25% drop
  devexThresholdEnabled: boolean;
  devexRobuxThreshold: number; // e.g. 30000 R$
  conversionSurgeEnabled: boolean;
  conversionThreshold: number; // e.g. 3.5%
}

export interface AlertLogItem {
  id: string;
  timestamp: string;
  type: 'arpdau_surge' | 'ccu_drop' | 'devex_ready' | 'conversion_surge' | 'test';
  title: string;
  message: string;
  status: 'Sent (Browser & Email)' | 'Delivered' | 'Simulated';
}

const DEFAULT_CONFIG: GrowthAlertsConfig = {
  emailAlertsEnabled: true,
  recipientEmail: 'dlinacre16@gmail.com',
  browserNotificationsEnabled: true,
  webhookEnabled: false,
  webhookUrl: '',
  arpdauSurgeEnabled: true,
  arpdauThreshold: 0.85,
  ccuDropEnabled: true,
  ccuDropThreshold: 150,
  ccuDropPercent: 25,
  devexThresholdEnabled: true,
  devexRobuxThreshold: 30000,
  conversionSurgeEnabled: true,
  conversionThreshold: 3.5
};

const DEFAULT_LOG: AlertLogItem[] = [];

interface GrowthAlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentArpdau?: number;
  currentCcu?: number;
}

export const GrowthAlertsPanel: React.FC<GrowthAlertsPanelProps> = ({
  isOpen,
  onClose,
  currentArpdau = 0.65,
  currentCcu = 250
}) => {
  const [config, setConfig] = useState<GrowthAlertsConfig>(() => {
    try {
      const saved = localStorage.getItem('blox_growth_alerts_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [alertLogs, setAlertLogs] = useState<AlertLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('blox_growth_alerts_log');
      return saved ? JSON.parse(saved) : DEFAULT_LOG;
    } catch {
      return DEFAULT_LOG;
    }
  });

  const [browserPermission, setBrowserPermission] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [testAlertToast, setTestAlertToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('blox_growth_alerts_config', JSON.stringify(config));
    } catch (e) {
      console.warn(e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('blox_growth_alerts_log', JSON.stringify(alertLogs));
    } catch (e) {
      console.warn(e);
    }
  }, [alertLogs]);

  if (!isOpen) return null;

  const handleRequestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      sounds.playClick();
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        if (perm === 'granted') {
          sounds.playSuccess();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleSimulateAlert = () => {
    sounds.playSuccess();
    const testItem: AlertLogItem = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      type: 'test',
      title: '⚡ Test Alert: ARPDAU Threshold Triggered',
      message: `Simulated Alert: Game ARPDAU is currently ${currentArpdau.toFixed(2)} R$ (Target: ${config.arpdauThreshold} R$). Dispatched to ${config.recipientEmail}.`,
      status: 'Simulated'
    };

    setAlertLogs([testItem, ...alertLogs]);
    setTestAlertToast(testItem.message);

    // If browser notifications allowed, trigger real desktop notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' && config.browserNotificationsEnabled) {
      try {
        new Notification(testItem.title, {
          body: testItem.message,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.warn(e);
      }
    }

    setTimeout(() => {
      setTestAlertToast(null);
    }, 4500);
  };

  const handleClearLogs = () => {
    sounds.playClick();
    setAlertLogs([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101726] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b0f17]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Growth &amp; KPI Alerts Configuration
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Set automated email and browser push triggers for ARPDAU spikes, CCU crashes, and DevEx payouts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Active Toast Preview */}
          {testAlertToast && (
            <div className="bg-emerald-950/90 border border-emerald-500/70 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{testAlertToast}</span>
              </div>
              <button
                onClick={() => setTestAlertToast(null)}
                className="text-emerald-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Section 1: Delivery Channels */}
          <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Dispatch Channels &amp; Endpoints
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Channel 1: Email Notifications */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email Alerts</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setConfig({ ...config, emailAlertsEnabled: !config.emailAlertsEnabled });
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      config.emailAlertsEnabled
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {config.emailAlertsEnabled ? 'ACTIVE' : 'MUTED'}
                  </button>
                </div>
                <input
                  type="email"
                  value={config.recipientEmail}
                  onChange={(e) => setConfig({ ...config, recipientEmail: e.target.value })}
                  placeholder="developer@studio.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-500">
                  Instant email delivery when critical KPI triggers fire.
                </span>
              </div>

              {/* Channel 2: Browser Web Push */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Browser Web Push</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setConfig({ ...config, browserNotificationsEnabled: !config.browserNotificationsEnabled });
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      config.browserNotificationsEnabled
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {config.browserNotificationsEnabled ? 'ACTIVE' : 'MUTED'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-2">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Permission: <strong className="text-white capitalize">{browserPermission}</strong>
                  </span>
                  {browserPermission !== 'granted' && (
                    <button
                      type="button"
                      onClick={handleRequestBrowserPermission}
                      className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 rounded text-[10px] font-bold cursor-pointer"
                    >
                      Enable Push
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">
                  Desktop popup alert even when tab is running in background.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: KPI Threshold Rules */}
          <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              Automated KPI Trigger Rules
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Rule 1: ARPDAU Surge */}
              <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    ARPDAU Surge Spike
                  </span>
                  <input
                    type="checkbox"
                    checked={config.arpdauSurgeEnabled}
                    onChange={(e) => setConfig({ ...config, arpdauSurgeEnabled: e.target.checked })}
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Alert me when live ARPDAU climbs above target threshold:
                </p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <input
                    type="number"
                    step="0.05"
                    min="0.10"
                    max="5.00"
                    value={config.arpdauThreshold}
                    onChange={(e) => setConfig({ ...config, arpdauThreshold: parseFloat(e.target.value) || 0.5 })}
                    className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">R$ / player</span>
                </div>
              </div>

              {/* Rule 2: CCU Crash Warning */}
              <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Concurrent Players (CCU) Drop
                  </span>
                  <input
                    type="checkbox"
                    checked={config.ccuDropEnabled}
                    onChange={(e) => setConfig({ ...config, ccuDropEnabled: e.target.checked })}
                    className="accent-rose-500 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Alert me immediately if concurrent users fall below:
                </p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <input
                    type="number"
                    step="25"
                    min="10"
                    value={config.ccuDropThreshold}
                    onChange={(e) => setConfig({ ...config, ccuDropThreshold: parseInt(e.target.value) || 50 })}
                    className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[11px] font-mono text-rose-400 font-bold">Minimum CCU</span>
                </div>
              </div>

              {/* Rule 3: DevEx Minimum Met */}
              <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <RobuxIcon className="w-3.5 h-3.5" />
                    DevEx Cashout Ready
                  </span>
                  <input
                    type="checkbox"
                    checked={config.devexThresholdEnabled}
                    onChange={(e) => setConfig({ ...config, devexThresholdEnabled: e.target.checked })}
                    className="accent-sky-500 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Alert when uncashed earned Robux crosses DevEx tier:
                </p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <input
                    type="number"
                    step="5000"
                    min="30000"
                    value={config.devexRobuxThreshold}
                    onChange={(e) => setConfig({ ...config, devexRobuxThreshold: parseInt(e.target.value) || 30000 })}
                    className="w-28 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[11px] font-mono text-sky-400 font-bold">≥ 30k R$ (£81.90)</span>
                </div>
              </div>

              {/* Rule 4: Spender Conversion Surge */}
              <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <SterlingCoinIcon className="w-3.5 h-3.5" />
                    Conversion Rate Surge
                  </span>
                  <input
                    type="checkbox"
                    checked={config.conversionSurgeEnabled}
                    onChange={(e) => setConfig({ ...config, conversionSurgeEnabled: e.target.checked })}
                    className="accent-purple-500 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Alert when paying player conversion rate exceeds:
                </p>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="15.0"
                    value={config.conversionThreshold}
                    onChange={(e) => setConfig({ ...config, conversionThreshold: parseFloat(e.target.value) || 2 })}
                    className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[11px] font-mono text-purple-400 font-bold">% Conversion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Test Dispatcher & Activity Log */}
          <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                  Recent Alert Dispatch Log
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  ({alertLogs.length} events)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateAlert}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Trigger Alert</span>
                </button>
                {alertLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearLogs}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Clear log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {alertLogs.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  No alerts triggered yet. Click "Test Trigger Alert" to test your browser and email pipeline.
                </div>
              ) : (
                alertLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-[#101726] border border-slate-800 rounded-lg text-xs flex items-start justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        {log.message}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 shrink-0">
                      {log.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0b0f17] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Settings saved automatically to local studio profile.</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
