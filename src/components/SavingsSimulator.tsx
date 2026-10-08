import React, { useState } from 'react';
import { KPIStats } from '../types/energy';
import { Sliders, Leaf, TrendingDown, DollarSign, Trees, Sparkles, ShieldAlert, Award } from 'lucide-react';

interface SavingsSimulatorProps {
  stats: KPIStats;
  currencySymbol?: string;
}

export const SavingsSimulator: React.FC<SavingsSimulatorProps> = ({
  stats,
  currencySymbol = '₹',
}) => {
  const [reductionPercent, setReductionPercent] = useState<number>(20);

  // Mathematical scenario projections based on monitored run-rate
  const baseMonthlyCost = stats.totalCost * (30 / Math.max(1, stats.recordCount / 168));
  const baseMonthlyKwh = stats.totalKwh * (30 / Math.max(1, stats.recordCount / 168));

  const monthlyKwhSaved = Math.round(baseMonthlyKwh * (reductionPercent / 100));
  const monthlyCostSaved = Math.round(baseMonthlyCost * (reductionPercent / 100));
  const annualCostSaved = Math.round(monthlyCostSaved * 12);
  const projectedMonthlyCost = Math.round(baseMonthlyCost - monthlyCostSaved);
  const projectedMonthlyKwh = Math.round(baseMonthlyKwh - monthlyKwhSaved);

  // Carbon and environmental equivalent (0.82 kg CO2 / kWh; 1 mature tree absorbs ~21.77 kg CO2 / year)
  const annualCo2KgSaved = Math.round(monthlyKwhSaved * 12 * 0.82);
  const treesEquivalent = Math.round(annualCo2KgSaved / 22);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Scenario Planning Engine
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Interactive What-If Model
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            What If You Reduce Energy Consumption?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate the bottom-line financial and carbon dividends of aggressive efficiency targets.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Scenario-Based Estimate</span>
        </div>
      </div>

      {/* Main Interactive Slider Area */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 mb-6 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="reduction-slider" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Target Consumption Reduction:
          </label>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {reductionPercent}%
            </span>
            <span className="text-xs text-slate-400 font-mono">cut</span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          id="reduction-slider"
          type="range"
          min={0}
          max={50}
          step={1}
          value={reductionPercent}
          onChange={(e) => setReductionPercent(Number(e.target.value))}
          aria-label="Target Consumption Reduction Percentage"
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
          <span>0% (Baseline Status Quo)</span>
          <span className="text-cyan-400">15% (Typical Low-Cost Target)</span>
          <span className="text-emerald-400">30% (High-Efficiency Campus)</span>
          <span>50% (Net-Zero Push)</span>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Projected Monthly Savings */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              Monthly Savings
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currencySymbol}{monthlyCostSaved.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 font-mono">
            Down from {currencySymbol}{Math.round(baseMonthlyCost).toLocaleString()}
          </span>
        </div>

        {/* Card 2: Annualized Financial Recovery */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
              Annualized Savings
            </span>
            <TrendingDown className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currencySymbol}{annualCostSaved.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 font-mono">
            Cumulative 12-Month Impact
          </span>
        </div>

        {/* Card 3: Energy Avoided */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
              Power Saved
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {monthlyKwhSaved.toLocaleString()} kWh
          </div>
          <span className="text-[11px] text-slate-400 block mt-1 font-mono">
            Projected monthly load: {projectedMonthlyKwh.toLocaleString()} kWh
          </span>
        </div>

        {/* Card 4: Environmental ESG Dividend */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-teal-950/40 to-slate-950 border border-teal-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-teal-400 uppercase font-semibold">
              Carbon Offset (CO₂)
            </span>
            <Leaf className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {annualCo2KgSaved.toLocaleString()} kg/yr
          </div>
          <span className="text-[11px] text-teal-300/80 block mt-1 font-mono flex items-center gap-1">
            <Trees className="w-3 h-3" /> ~{treesEquivalent} trees planted equivalent
          </span>
        </div>
      </div>

      {/* Disclaimers & Methodology Note */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 font-mono flex items-start gap-3">
        <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Business Analytics Integrity Note:</strong> All projected
          figures are strictly scenario-based mathematical calculations derived from your entered tariff
          profile and baseline records. EnergyIQ explicitly avoids claiming theoretical savings as
          guaranteed results.
        </p>
      </div>
    </div>
  );
};
