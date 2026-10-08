import React, { useState } from 'react';
import { EnergyRecord, CategoryBreakdown, KPIStats } from '../types/energy';
import { Calendar, Clock, BarChart3, TrendingUp, CheckCircle, ArrowRight, Zap, AlertTriangle } from 'lucide-react';

interface EnergyChartsProps {
  records: EnergyRecord[];
  categories: CategoryBreakdown[];
  stats: KPIStats;
  currencySymbol?: string;
}

export const EnergyCharts: React.FC<EnergyChartsProps> = ({
  records,
  categories,
  stats,
  currencySymbol = '₹',
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'hourly' | 'beforeAfter'>('daily');
  const [hoveredDailyIndex, setHoveredDailyIndex] = useState<number | null>(null);
  const [hoveredHourIndex, setHoveredHourIndex] = useState<number | null>(null);

  // Group records by Date
  const dailyMap = new Map<string, { totalKwh: number; wastageKwh: number; cost: number }>();
  records.forEach((r) => {
    const existing = dailyMap.get(r.date) || { totalKwh: 0, wastageKwh: 0, cost: 0 };
    existing.totalKwh += r.kwh;
    const excess = Math.max(0, r.kwh - r.expectedKwh);
    existing.wastageKwh += excess;
    dailyMap.set(r.date, existing);
  });

  const dailyData = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      formattedDate: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      totalKwh: Number(data.totalKwh.toFixed(1)),
      wastageKwh: Number(data.wastageKwh.toFixed(1)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const maxDailyKwh = Math.max(...dailyData.map((d) => d.totalKwh), 10);

  // Group records by Hour (0-23)
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const matching = records.filter((r) => r.hour === hour);
    const sumKwh = matching.reduce((acc, r) => acc + r.kwh, 0);
    const sumExpected = matching.reduce((acc, r) => acc + r.expectedKwh, 0);
    const sumWastage = matching.reduce((acc, r) => acc + Math.max(0, r.kwh - r.expectedKwh), 0);
    const count = Math.max(1, matching.length);

    const avgKwh = sumKwh / (count / 7); // normalize per day
    const avgExpected = sumExpected / (count / 7);
    const avgWastage = sumWastage / (count / 7);

    const isWorkingHours = hour >= 9 && hour <= 18;

    return {
      hour,
      label: `${hour.toString().padStart(2, '0')}:00`,
      avgKwh: Number(avgKwh.toFixed(1)),
      avgExpected: Number(avgExpected.toFixed(1)),
      avgWastage: Number(avgWastage.toFixed(1)),
      isWorkingHours,
    };
  });

  const maxHourlyKwh = Math.max(...hourlyData.map((h) => h.avgKwh), 5);

  // Before vs After Projected Scenario calculations
  const beforeKwh = stats.totalKwh;
  const beforeCost = stats.totalCost;
  const beforeWastage = stats.potentialWastageKwh;

  // With recommended optimization actions executed (eliminates ~80% of preventable wastage)
  const afterWastage = Number((beforeWastage * 0.18).toFixed(1));
  const afterKwh = Number((beforeKwh - (beforeWastage - afterWastage)).toFixed(1));
  const afterCost = Math.round(beforeCost - (stats.potentialWastageCost * 0.82));
  const projectedSavings = beforeCost - afterCost;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Quantitative Analytics
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">Energy Consumption & Variance Charts</h3>
        </div>

        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'daily'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Consumption</span>
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'hourly'
                ? 'bg-slate-800 text-purple-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24h Profile & Off-Hours</span>
          </button>
          <button
            onClick={() => setActiveTab('beforeAfter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'beforeAfter'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Before vs After</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Daily Consumption Chart */}
      {activeTab === 'daily' && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500" />
                Productive Energy (kWh)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" />
                Detected Wastage (kWh)
              </span>
            </div>
            <span>Monitored Period (7 Days)</span>
          </div>

          {/* Bar Chart Container */}
          <div className="relative h-64 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {dailyData.map((d, index) => {
              const productiveHeight = Math.max(8, ((d.totalKwh - d.wastageKwh) / maxDailyKwh) * 200);
              const wastageHeight = Math.max(0, (d.wastageKwh / maxDailyKwh) * 200);
              const isHovered = hoveredDailyIndex === index;

              return (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredDailyIndex(index)}
                  onMouseLeave={() => setHoveredDailyIndex(null)}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-16 z-20 bg-slate-950 border border-slate-700 p-2 rounded-lg shadow-xl text-center min-w-[130px] pointer-events-none">
                      <span className="text-[10px] text-slate-400 block font-mono">{d.formattedDate}</span>
                      <span className="text-xs font-bold text-white font-mono block">
                        Total: {d.totalKwh} kWh
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono block">
                        Excess: {d.wastageKwh} kWh
                      </span>
                    </div>
                  )}

                  {/* Stacked Bars */}
                  <div className="w-full max-w-[42px] flex flex-col items-center justify-end rounded-t-lg overflow-hidden transition-all duration-300 group-hover:brightness-125">
                    {/* Wastage chunk */}
                    {wastageHeight > 0 && (
                      <div
                        className="w-full bg-amber-500 transition-all duration-500"
                        style={{ height: `${wastageHeight}px` }}
                      />
                    )}
                    {/* Productive chunk */}
                    <div
                      className="w-full bg-cyan-500 transition-all duration-500"
                      style={{ height: `${productiveHeight}px` }}
                    />
                  </div>

                  {/* Date Label */}
                  <span className="text-[10px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {d.formattedDate.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-xs font-mono text-slate-400">
            <span>Average Daily Run-Rate: {stats.avgDailyKwh} kWh/day</span>
            <span className="text-amber-400">
              Peak Day Spike: {Math.max(...dailyData.map((d) => d.totalKwh))} kWh
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: Hourly 24h Profile & Off-Hours */}
      {activeTab === 'hourly' && (
        <div>
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-4 font-mono gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                Working Hours (09:00 - 18:00)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/80" />
                After-Hours Danger Zone
              </span>
            </div>
            <span className="text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              After-Hours Leakage: {stats.afterHoursKwh} kWh
            </span>
          </div>

          {/* Hourly chart */}
          <div className="relative h-64 w-full flex items-end gap-1 sm:gap-1.5 pt-6 pb-2 px-1 border-b border-slate-800">
            {hourlyData.map((h, index) => {
              const barHeight = Math.max(6, (h.avgKwh / maxHourlyKwh) * 190);
              const isHovered = hoveredHourIndex === index;

              return (
                <div
                  key={h.hour}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredHourIndex(index)}
                  onMouseLeave={() => setHoveredHourIndex(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-16 z-20 bg-slate-950 border border-slate-700 p-2 rounded-lg shadow-xl text-center min-w-[120px] pointer-events-none">
                      <span className="text-[10px] text-slate-400 block font-mono">{h.label}</span>
                      <span className="text-xs font-bold text-white font-mono block">
                        Avg Load: {h.avgKwh} kWh
                      </span>
                      <span className="text-[10px] font-mono block text-cyan-400">
                        {h.isWorkingHours ? 'Working Hours' : 'After-Hours Window'}
                      </span>
                    </div>
                  )}

                  <div
                    className={`w-full rounded-t transition-all duration-300 group-hover:scale-105 ${
                      h.isWorkingHours
                        ? 'bg-purple-500 group-hover:bg-purple-400'
                        : h.avgWastage > 1
                        ? 'bg-amber-500 group-hover:bg-amber-400'
                        : 'bg-slate-700 group-hover:bg-slate-600'
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />

                  {/* Hour tick on alternate hours */}
                  <span className="text-[9px] text-slate-500 font-mono mt-1">
                    {h.hour % 3 === 0 ? h.hour : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-mono mt-3 leading-relaxed">
            <strong className="text-amber-400">Business Pattern Insight:</strong> Notice the persistent
            plateau between 20:00 and 03:00. In a campus/office setting, baseline should drop to &lt; 2
            kWh, but unmonitored air conditioning and desktop systems held load at 5+ kWh.
          </p>
        </div>
      )}

      {/* TAB 3: Before vs After Optimization */}
      {activeTab === 'beforeAfter' && (
        <div className="py-2">
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-300 font-mono mb-6 flex items-center justify-between">
            <span>Scenario-Based Estimate: Projected outcome after implementing AI recommendations</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 font-bold">Illustrative Estimate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Before Box */}
            <div className="p-5 rounded-xl bg-slate-950 border border-rose-900/40 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  Current Status Quo (Before)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono border border-rose-800">
                  Unoptimized
                </span>
              </div>

              <div className="space-y-4 font-mono">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Total Consumption:</span>
                    <span className="text-white font-bold">{beforeKwh.toLocaleString()} kWh</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Estimated Utility Cost:</span>
                    <span className="text-rose-400 font-bold">
                      {currencySymbol}{beforeCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Detected Wastage:</span>
                    <span className="text-amber-400 font-bold">{beforeWastage} kWh</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${stats.wastagePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* After Box */}
            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-900/40 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Post-Remediation (After Target)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
                  Projected Scenario
                </span>
              </div>

              <div className="space-y-4 font-mono">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Projected Consumption:</span>
                    <span className="text-white font-bold">{afterKwh.toLocaleString()} kWh</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${((afterKwh / beforeKwh) * 100).toFixed(0)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Projected Utility Cost:</span>
                    <span className="text-emerald-400 font-bold">
                      {currencySymbol}{afterCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${((afterCost / beforeCost) * 100).toFixed(0)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Residual Wastage:</span>
                    <span className="text-emerald-300 font-bold">{afterWastage} kWh</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-500"
                      style={{ width: '4%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Estimated Monthly Financial Recovery
                </h4>
                <p className="text-xs text-slate-300">
                  Net reduction from eliminating after-hours HVAC run and workstation standby.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                +{currencySymbol}{Math.round(projectedSavings * (30 / 7)).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">per month projected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
