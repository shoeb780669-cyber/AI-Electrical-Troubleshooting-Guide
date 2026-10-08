import React, { useState } from 'react';
import { CategoryBreakdown, ApplianceCategory } from '../types/energy';
import { CATEGORY_METADATA } from '../data/demoData';
import {
  Snowflake,
  Lightbulb,
  Monitor,
  Server,
  Printer,
  Coffee,
  Cpu,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Info,
  X,
} from 'lucide-react';

interface CategoryFlowProps {
  categories: CategoryBreakdown[];
  currencySymbol?: string;
}

const CATEGORY_ICONS: Record<ApplianceCategory, React.ElementType> = {
  'Air Conditioning': Snowflake,
  'Lighting': Lightbulb,
  'Computers': Monitor,
  'Servers': Server,
  'Printers': Printer,
  'Kitchen Equipment': Coffee,
  'Other Appliances': Cpu,
};

export const CategoryFlow: React.FC<CategoryFlowProps> = ({ categories, currencySymbol = '₹' }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryBreakdown | null>(categories[0] || null);

  const totalKwh = categories.reduce((acc, c) => acc + c.kwh, 0);

  // Calculate SVG Donut slice coordinates
  let cumulativePercent = 0;
  const slices = categories.map((cat) => {
    const start = cumulativePercent;
    const end = cumulativePercent + cat.percentage;
    cumulativePercent = end;
    return { ...cat, start, end };
  });

  // Helper for SVG donut arc
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * (percent / 100) - Math.PI / 2);
    const y = Math.sin(2 * Math.PI * (percent / 100) - Math.PI / 2);
    return [x, y];
  };

  return (
    <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Energy Disaggregation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              Interactive Drilldown
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Where Is Your Energy Going?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any category to inspect AI root-cause analysis, wastage footprints, and corrective actions.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-mono block">Total Aggregated Load</span>
          <span className="text-lg font-bold text-white font-mono">{totalKwh.toLocaleString()} kWh</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full transform -rotate-90">
              {slices.map((slice) => {
                const [startX, startY] = getCoordinatesForPercent(slice.start);
                const [endX, endY] = getCoordinatesForPercent(slice.end);
                const largeArcFlag = slice.percentage > 50 ? 1 : 0;
                const pathData = [
                  `M ${startX} ${startY}`,
                  `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  `L 0 0`,
                ].join(' ');

                const isSelected = selectedCategory?.category === slice.category;

                return (
                  <path
                    key={slice.category}
                    d={pathData}
                    fill={slice.color}
                    opacity={isSelected ? 1 : 0.75}
                    stroke="#0f172a"
                    strokeWidth="0.04"
                    className="cursor-pointer transition-all duration-200 hover:opacity-100"
                    onClick={() => setSelectedCategory(slice)}
                  />
                );
              })}
              {/* Inner cutout for donut */}
              <circle cx="0" cy="0" r="0.68" fill="#0f172a" />
            </svg>

            {/* Center Callout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Selected</span>
              <span className="text-lg font-extrabold text-white font-mono leading-tight">
                {selectedCategory?.percentage.toFixed(1)}%
              </span>
              <span className="text-[10px] text-cyan-400 font-medium max-w-[90px] truncate">
                {selectedCategory?.category}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-mono mt-3 text-center">
            Click segment or cards to examine appliance load
          </p>
        </div>

        {/* Right: Category List with percentage bars */}
        <div className="lg:col-span-7 space-y-2.5">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.category] || Cpu;
            const isSelected = selectedCategory?.category === cat.category;

            return (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${cat.color}25`,
                      color: cat.color,
                      border: `1px solid ${cat.color}40`,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{cat.category}</span>
                      {cat.wastageCost > 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Leakage
                        </span>
                      )}
                    </div>
                    {/* Progress line */}
                    <div className="w-36 sm:w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-sm font-bold text-white font-mono">{cat.percentage.toFixed(1)}%</span>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {cat.kwh.toLocaleString()} kWh • {currencySymbol}{cat.cost.toLocaleString()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Category Detail Inspection Card */}
      {selectedCategory && (
        <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                Detailed Profile: {selectedCategory.category}
              </h4>
            </div>
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${selectedCategory.color}20`,
                color: selectedCategory.color,
              }}
            >
              {selectedCategory.percentage.toFixed(1)}% of Entire Facility
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Consumption</span>
              <span className="text-sm font-bold text-white font-mono">{selectedCategory.kwh} kWh</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Utility Cost</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">
                {currencySymbol}{selectedCategory.cost.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Identified Wastage</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {selectedCategory.wastageKwh} kWh
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Wastage Cost Drain</span>
              <span className="text-sm font-bold text-rose-400 font-mono">
                {currencySymbol}{selectedCategory.wastageCost.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
              <span className="text-cyan-400 font-bold block mb-0.5 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> AI Diagnostic Insight
              </span>
              <p className="text-slate-300 leading-relaxed">{selectedCategory.aiInsight}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
              <span className="text-emerald-400 font-bold block mb-0.5 flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5" /> Recommended Remediation
              </span>
              <p className="text-slate-200 leading-relaxed">{selectedCategory.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
