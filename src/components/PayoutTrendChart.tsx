import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar, DollarSign, ArrowUpRight, Sparkles, Filter, Info } from 'lucide-react';
import { RobuxIcon, SterlingCoinIcon } from './Icons';
import { sounds } from '../utils/audio';

export interface PayoutRecord {
  id: string;
  date: string;
  robux: number;
  note: string;
}

interface PayoutTrendChartProps {
  payoutHistory: PayoutRecord[];
  usdToGbpRate: number;
  devexRateUsd?: number;
}

export const PayoutTrendChart: React.FC<PayoutTrendChartProps> = ({
  payoutHistory,
  usdToGbpRate,
  devexRateUsd = 0.0035
}) => {
  const [timeRange, setTimeRange] = useState<'6m' | 'all'>('6m');
  const [currency, setCurrency] = useState<'GBP' | 'USD'>('GBP');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Sort chronologically
  const sortedRecords = useMemo(() => {
    return [...payoutHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [payoutHistory]);

  // Filter for last 6 months or all
  const filteredRecords = useMemo(() => {
    if (sortedRecords.length === 0) return [];
    if (timeRange === 'all') return sortedRecords;

    // Use latest date in records or current date as anchor
    const latestDate = new Date(sortedRecords[sortedRecords.length - 1].date);
    const sixMonthsAgo = new Date(latestDate);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const filtered = sortedRecords.filter((r) => new Date(r.date) >= sixMonthsAgo);
    // If fewer than 2 records in 6-month window, show at least the last 4-6 records so trend is visible
    return filtered.length >= 2 ? filtered : sortedRecords.slice(-6);
  }, [sortedRecords, timeRange]);

  // Calculations for trend chart
  const pointsData = useMemo(() => {
    return filteredRecords.map((r) => {
      const usdVal = r.robux * devexRateUsd;
      const gbpVal = usdVal * usdToGbpRate;
      const value = currency === 'GBP' ? gbpVal : usdVal;
      return {
        ...r,
        usdVal,
        gbpVal,
        value,
        formattedDate: new Date(r.date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      };
    });
  }, [filteredRecords, devexRateUsd, usdToGbpRate, currency]);

  const currencySymbol = currency === 'GBP' ? '£' : '$';

  const totalRealMoney = useMemo(() => {
    return pointsData.reduce((sum, p) => sum + p.value, 0);
  }, [pointsData]);

  const avgRealMoney = pointsData.length > 0 ? totalRealMoney / pointsData.length : 0;
  const maxRealMoney = Math.max(...pointsData.map((p) => p.value), 200);
  const minRealMoney = Math.min(...pointsData.map((p) => p.value), 0);

  // Growth percentage from first to last point
  const growthRate = useMemo(() => {
    if (pointsData.length < 2) return 0;
    const first = pointsData[0].value;
    const last = pointsData[pointsData.length - 1].value;
    if (first === 0) return 0;
    return Math.round(((last - first) / first) * 100);
  }, [pointsData]);

  // SVG Chart Dimensions
  const svgWidth = 680;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Coordinate mapper
  const svgPoints = useMemo(() => {
    if (pointsData.length === 0) return [];
    if (pointsData.length === 1) {
      return [{ x: svgWidth / 2, y: paddingTop + chartHeight / 2, ...pointsData[0] }];
    }

    const yRange = maxRealMoney - Math.min(0, minRealMoney);

    return pointsData.map((pt, idx) => {
      const x = paddingX + (idx / (pointsData.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((pt.value - Math.min(0, minRealMoney)) / (yRange || 1)) * chartHeight;
      return { x, y, ...pt };
    });
  }, [pointsData, chartWidth, chartHeight, paddingX, paddingTop, maxRealMoney, minRealMoney]);

  // Polyline string for the line
  const polylinePoints = svgPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Closed path string for the gradient area fill
  const areaPath = svgPoints.length > 0
    ? `M ${svgPoints[0].x},${paddingTop + chartHeight} ` +
      svgPoints.map((p) => `L ${p.x},${p.y}`).join(' ') +
      ` L ${svgPoints[svgPoints.length - 1].x},${paddingTop + chartHeight} Z`
    : '';

  // 30k Robux Minimum Threshold line value
  const thresholdValue = currency === 'GBP'
    ? 30000 * devexRateUsd * usdToGbpRate
    : 30000 * devexRateUsd;
  const thresholdY = paddingTop + chartHeight - ((thresholdValue - Math.min(0, minRealMoney)) / ((maxRealMoney - Math.min(0, minRealMoney)) || 1)) * chartHeight;

  return (
    <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Real-World Currency Growth Velocity
            </span>
            {growthRate > 0 && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                +{growthRate}% over {timeRange === '6m' ? 'last 6 mos' : 'all payouts'}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white font-display pt-0.5">
            Historical DevEx Real-Money Trend Line
          </h3>
          <p className="text-[11px] text-slate-400">
            Tracking your actual cashout growth deposited directly into your bank account.
          </p>
        </div>

        {/* Currency & Range Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* 6M vs All Filter */}
          <div className="flex items-center bg-[#101726] border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setTimeRange('6m');
              }}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer text-[11px] ${
                timeRange === '6m'
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 6 Months
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setTimeRange('all');
              }}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer text-[11px] ${
                timeRange === 'all'
                  ? 'bg-slate-800 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Payouts
            </button>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-[#101726] border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => {
                sounds.playCoin();
                setCurrency('GBP');
              }}
              className={`px-2 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                currency === 'GBP'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              £ GBP
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playCoin();
                setCurrency('USD');
              }}
              className={`px-2 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-sky-950 text-sky-300 border border-sky-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-[#101726] border border-slate-800 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 font-mono block">Cashed Out ({timeRange.toUpperCase()}):</span>
          <div className="text-base font-bold font-mono text-emerald-300">
            {currencySymbol}{totalRealMoney.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <span className="text-[9px] text-slate-400 font-mono">{pointsData.length} recorded cashouts</span>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 font-mono block">Monthly Run-Rate:</span>
          <div className="text-base font-bold font-mono text-white">
            {currencySymbol}{avgRealMoney.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <span className="text-[9px] text-slate-400 font-mono">Average per event</span>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 font-mono block">Peak Record Payout:</span>
          <div className="text-base font-bold font-mono text-amber-400">
            {currencySymbol}{maxRealMoney.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <span className="text-[9px] text-slate-400 font-mono">Single highest payout</span>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 font-mono block">6-Mo Growth Velocity:</span>
          <div className="text-base font-bold font-mono text-emerald-400">
            +{growthRate}%
          </div>
          <span className="text-[9px] text-emerald-400/80 font-mono">Consistent expansion</span>
        </div>
      </div>

      {/* SVG Trend Line Chart */}
      <div className="bg-[#070b12] border border-slate-800/80 rounded-xl p-3 sm:p-4 relative overflow-hidden">
        {pointsData.length === 0 ? (
          <div className="h-52 flex flex-col items-center justify-center text-slate-500 text-xs space-y-1">
            <Info className="w-5 h-5 text-slate-600" />
            <span>No payout records found for this period.</span>
            <span className="text-[10px]">Add your first past cashout below to see your trend curve!</span>
          </div>
        ) : (
          <div className="relative w-full">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                {/* Emerald Area Gradient */}
                <linearGradient id="payoutAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>

                {/* Line Glow Filter */}
                <filter id="payoutGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingTop}
                x2={svgWidth - paddingX}
                y2={paddingTop}
                stroke="#1e293b"
                strokeDasharray="3,3"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={paddingTop + chartHeight / 2}
                x2={svgWidth - paddingX}
                y2={paddingTop + chartHeight / 2}
                stroke="#1e293b"
                strokeDasharray="3,3"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={paddingTop + chartHeight}
                x2={svgWidth - paddingX}
                y2={paddingTop + chartHeight}
                stroke="#334155"
                strokeWidth="1"
              />

              {/* 30,000 Robux Minimum Threshold Line */}
              {thresholdY >= paddingTop && thresholdY <= paddingTop + chartHeight && (
                <g>
                  <line
                    x1={paddingX}
                    y1={thresholdY}
                    x2={svgWidth - paddingX}
                    y2={thresholdY}
                    stroke="#f59e0b"
                    strokeDasharray="4,4"
                    strokeWidth="1.2"
                    strokeOpacity="0.6"
                  />
                  <text
                    x={svgWidth - paddingX}
                    y={thresholdY - 4}
                    fill="#f59e0b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    30k R$ Threshold ({currencySymbol}{thresholdValue.toFixed(0)})
                  </text>
                </g>
              )}

              {/* Gradient Area Fill */}
              {areaPath && (
                <path d={areaPath} fill="url(#payoutAreaGrad)" />
              )}

              {/* Main Trend Polyline */}
              {polylinePoints && (
                <polyline
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#payoutGlow)"
                  points={polylinePoints}
                />
              )}

              {/* Data Points */}
              {svgPoints.map((pt, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      sounds.playClick();
                      setHoveredPointIndex(idx);
                    }}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  >
                    {/* Invisible larger hit target */}
                    <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                    {/* Outer ring */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '7' : '4.5'}
                      fill="#0b0f17"
                      stroke="#34d399"
                      strokeWidth={isHovered ? '2.5' : '2'}
                      className="transition-all"
                    />

                    {/* Inner glowing center */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '3.5' : '2'}
                      fill="#10b981"
                      className="transition-all"
                    />

                    {/* X-axis date label */}
                    <text
                      x={pt.x}
                      y={paddingTop + chartHeight + 16}
                      fill={isHovered ? '#34d399' : '#64748b'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="transition-colors"
                    >
                      {pt.formattedDate}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Active Hover Tooltip */}
            {hoveredPointIndex !== null && svgPoints[hoveredPointIndex] && (
              <div
                className="absolute pointer-events-none z-30 bg-[#0b0f17] border border-emerald-500/70 p-2.5 rounded-xl shadow-xl shadow-black/80 text-xs space-y-1 transition-all"
                style={{
                  left: `${(svgPoints[hoveredPointIndex].x / svgWidth) * 100}%`,
                  top: `${(svgPoints[hoveredPointIndex].y / svgHeight) * 100}%`,
                  transform: 'translate(-50%, -125%)'
                }}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1">
                  <span>{svgPoints[hoveredPointIndex].date}</span>
                  <span className="text-emerald-400 font-bold">{svgPoints[hoveredPointIndex].robux.toLocaleString()} R$</span>
                </div>
                <div className="font-bold text-sm font-mono text-emerald-300">
                  {currencySymbol}{svgPoints[hoveredPointIndex].value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-1">
                  {svgPoints[hoveredPointIndex].note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
