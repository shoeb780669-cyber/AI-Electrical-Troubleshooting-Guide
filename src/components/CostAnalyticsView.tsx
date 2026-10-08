import React, { useState } from 'react';
import { KPIStats, TariffConfig, CategoryBreakdown, EnergyRecord } from '../types/energy';
import {
  DollarSign,
  Zap,
  TrendingDown,
  Clock,
  Sliders,
  AlertCircle,
  ShieldCheck,
  Check,
  RotateCcw,
} from 'lucide-react';

interface CostAnalyticsViewProps {
  stats: KPIStats;
  tariff: TariffConfig;
  onUpdateTariff: (newTariff: TariffConfig) => void;
  categories: CategoryBreakdown[];
  records: EnergyRecord[];
  currencySymbol?: string;
}

export const CostAnalyticsView: React.FC<CostAnalyticsViewProps> = ({
  stats,
  tariff,
  onUpdateTariff,
  categories,
  records,
  currencySymbol = '₹',
}) => {
  const [baseRate, setBaseRate] = useState<number>(tariff.baseRatePerKwh);
  const [peakRate, setPeakRate] = useState<number>(tariff.peakRatePerKwh);
  const [offPeakRate, setOffPeakRate] = useState<number>(tariff.offPeakRatePerKwh);
  const [useTou, setUseTou] = useState<boolean>(tariff.useTimeOfUse);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(tariff.currencySymbol);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  // Time-of-Use breakdown
  let peakCost = 0;
  let offPeakCost = 0;
  let standardCost = 0;

  records.forEach((r) => {
    const isPeak = r.hour >= tariff.peakStartHour && r.hour < tariff.peakEndHour;
    const isOffPeak = r.hour >= tariff.offPeakStartHour || r.hour < tariff.offPeakEndHour;

    if (useTou && isPeak) {
      peakCost += r.kwh * tariff.peakRatePerKwh;
    } else if (useTou && isOffPeak) {
      offPeakCost += r.kwh * tariff.offPeakRatePerKwh;
    } else {
      standardCost += r.kwh * tariff.baseRatePerKwh;
    }
  });

  const handleApplyTariff = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTariff({
      ...tariff,
      baseRatePerKwh: baseRate,
      peakRatePerKwh: peakRate,
      offPeakRatePerKwh: offPeakRate,
      useTimeOfUse: useTou,
      currencySymbol: selectedCurrency,
      currency: selectedCurrency === '₹' ? 'INR' : selectedCurrency === '$' ? 'USD' : 'EUR',
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const totalCalculatedCost = Math.round(peakCost + offPeakCost + standardCost);

  return (
    <div className="space-y-6">
      {/* Top Tariff Simulator & Settings Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Financial Modeling & Tariffs
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                Dynamic Tariff Engine
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Electricity Tariff Structure</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize local utility rates to reflect commercial two-part or Time-of-Use (ToU) contracts.
            </p>
          </div>

          {savedNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
              <span>Tariff Applied!</span>
            </div>
          )}
        </div>

        {/* Tariff Form */}
        <form onSubmit={handleApplyTariff} className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Currency Unit</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="₹">₹ (Indian Rupee - INR)</option>
              <option value="$">$ (US Dollar - USD)</option>
              <option value="€">€ (Euro - EUR)</option>
              <option value="£">£ (British Pound - GBP)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Standard Rate ({selectedCurrency}/kWh)</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={baseRate}
              onChange={(e) => setBaseRate(parseFloat(e.target.value))}
              className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Peak Surcharge ({selectedCurrency}/kWh)</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={peakRate}
              onChange={(e) => setPeakRate(parseFloat(e.target.value))}
              className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">Off-Peak Rate ({selectedCurrency}/kWh)</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={offPeakRate}
              onChange={(e) => setOffPeakRate(parseFloat(e.target.value))}
              className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              Recalculate Costs
            </button>
          </div>
        </form>

        <div className="mt-3 flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useTou}
              onChange={(e) => setUseTou(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 accent-cyan-500"
            />
            <span>Enable Time-of-Use (ToU) Differential Pricing (14:00-19:00 Peak, 22:00-06:00 Off-Peak)</span>
          </label>
        </div>
      </div>

      {/* Financial Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Peak Window Drain */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/30 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold">Peak-Window Cost</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currencySymbol}{Math.round(peakCost).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Charged at highest tariff ({currencySymbol}{tariff.peakRatePerKwh}/kWh)
          </span>
          <div className="mt-3 text-[10px] text-amber-300/80 font-mono">
            Opportunity: Shift non-critical pumping and pre-cooling
          </div>
        </div>

        {/* Standard Daytime Cost */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Standard Shift Cost</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currencySymbol}{Math.round(standardCost).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Regular daytime facility operation
          </span>
          <div className="mt-3 text-[10px] text-cyan-300/80 font-mono">
            Directly proportional to workforce attendance
          </div>
        </div>

        {/* Off-Hours & Night Cost */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-900/30 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-rose-400 font-bold">After-Hours Spend</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currencySymbol}{stats.afterHoursCost.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Incurred outside normal operational windows
          </span>
          <div className="mt-3 text-[10px] text-rose-300/80 font-mono">
            Primary target for immediate management reduction
          </div>
        </div>
      </div>

      {/* Category Cost Breakdown Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <h3 className="text-base font-bold text-white mb-4">Category-Wise Financial Expenditure</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Consumption (kWh)</th>
                <th className="p-3 text-right">Share of Total</th>
                <th className="p-3 text-right">Incurred Cost</th>
                <th className="p-3 text-right">Wastage Drain</th>
                <th className="p-3 text-right">Monthly Projection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {categories.map((c) => {
                const monthlyProj = Math.round(c.cost * (30 / Math.max(1, stats.recordCount / 168)));

                return (
                  <tr key={c.category} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-white">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded mr-2"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.category}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-300">{c.kwh.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-slate-400">{c.percentage.toFixed(1)}%</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {currencySymbol}{c.cost.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-rose-400">
                      {c.wastageCost > 0 ? `+${currencySymbol}${c.wastageCost.toLocaleString()}` : '₹0'}
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-400 font-semibold">
                      {currencySymbol}{monthlyProj.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
