import React, { useState } from 'react';
import { ComputedMonthlyMetric, MonthlyEnergyRecord } from '../types/electrical';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  DollarSign,
  Layers,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface InteractiveChartsProps {
  metrics: ComputedMonthlyMetric[];
}

export const InteractiveCharts: React.FC<InteractiveChartsProps> = ({ metrics }) => {
  const [activeChart, setActiveChart] = useState<'consumptionBill' | 'voltageQuality' | 'wastage' | 'equipment'>('consumptionBill');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (metrics.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 font-mono text-xs">
        No monthly data available to render charts. Please add monthly records first.
      </div>
    );
  }

  // Chart data calculations
  const maxKwh = Math.max(...metrics.map((m) => m.record.kwh), 100);
  const maxBill = Math.max(...metrics.map((m) => m.record.billAmount), 1000);
  const maxWastageKwh = Math.max(...metrics.map((m) => m.estimatedWastageKwh), 10);
  const maxEquipment = Math.max(...metrics.map((m) => m.record.equipmentCount), 5);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl space-y-6">
      {/* Top Header & Chart Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Dynamic Visual Analytics
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              Live Responsive SVG
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Interactive Energy & Power Quality Charts</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Charts update in real-time as you add or edit monthly energy data records.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveChart('consumptionBill')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeChart === 'consumptionBill'
                ? 'bg-slate-800 text-cyan-400 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Consumption & Bill</span>
          </button>

          <button
            onClick={() => setActiveChart('voltageQuality')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeChart === 'voltageQuality'
                ? 'bg-slate-800 text-blue-400 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Voltage & Frequency</span>
          </button>

          <button
            onClick={() => setActiveChart('wastage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeChart === 'wastage'
                ? 'bg-slate-800 text-amber-400 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Estimated Wastage</span>
          </button>

          <button
            onClick={() => setActiveChart('equipment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeChart === 'equipment'
                ? 'bg-slate-800 text-purple-400 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Equipment Correlation</span>
          </button>
        </div>
      </div>

      {/* CHART 1: Consumption (kWh) & Bill Amount (₹) */}
      {activeChart === 'consumptionBill' && (
        <div>
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-4 font-mono gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500" />
                Consumption (kWh)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-400" />
                Bill Amount (₹)
              </span>
            </div>
            <span>Dual Metric Trend</span>
          </div>

          <div className="relative h-72 w-full flex items-end gap-3 sm:gap-6 pt-8 pb-3 px-3 border-b border-slate-800">
            {metrics.map((m, idx) => {
              const kwhHeight = Math.max(12, (m.record.kwh / maxKwh) * 200);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={m.record.id}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-20 z-30 bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-center min-w-[140px] pointer-events-none">
                      <span className="text-[10px] text-slate-400 block font-mono font-bold">
                        {m.record.monthLabel}
                      </span>
                      <span className="text-xs font-bold text-white font-mono block">
                        {m.record.kwh.toLocaleString()} kWh
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono block">
                        ₹{m.record.billAmount.toLocaleString()}
                      </span>
                      {m.kwhMoMChangePercent !== null && (
                        <span className="text-[10px] text-cyan-300 font-mono block">
                          MoM: {m.kwhMoMChangePercent > 0 ? '+' : ''}
                          {m.kwhMoMChangePercent}%
                        </span>
                      )}
                    </div>
                  )}

                  {/* Top Bill Value */}
                  <span className="text-[10px] text-emerald-400 font-mono font-bold mb-1.5">
                    ₹{(m.record.billAmount / 1000).toFixed(1)}k
                  </span>

                  {/* Bar */}
                  <div className="w-full max-w-[50px] rounded-t-xl bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-300 group-hover:brightness-125 group-hover:scale-105 shadow-lg shadow-cyan-500/10 flex items-start justify-center pt-1"
                    style={{ height: `${kwhHeight}px` }}
                  >
                    <span className="text-[9px] text-slate-950 font-bold font-mono">
                      {m.record.kwh}
                    </span>
                  </div>

                  {/* Month Label */}
                  <span className="text-[11px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {m.record.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-mono mt-3">
            Average cost per unit across logged timeline: ₹
            {(
              metrics.reduce((acc, m) => acc + m.record.billAmount, 0) /
              Math.max(1, metrics.reduce((acc, m) => acc + m.record.kwh, 0))
            ).toFixed(2)}{' '}
            / kWh.
          </p>
        </div>
      )}

      {/* CHART 2: Voltage & Frequency Quality */}
      {activeChart === 'voltageQuality' && (
        <div>
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-4 font-mono gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-400" />
                Measured Voltage (V)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400" />
                Nominal Baseline (230V)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-400" />
                Frequency (Hz)
              </span>
            </div>
            <span>Standard Tolerance: ±6% (216V - 244V)</span>
          </div>

          <div className="relative h-72 w-full flex items-end gap-3 sm:gap-6 pt-8 pb-3 px-3 border-b border-slate-800">
            {metrics.map((m, idx) => {
              // Scale voltage around 230V (180V to 260V span)
              const vHeight = Math.max(20, ((m.record.voltage - 180) / 80) * 190);
              const isAbnormal = Math.abs(m.voltageDeviationPercent) > 6;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={m.record.id}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-20 z-30 bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-center min-w-[140px] pointer-events-none">
                      <span className="text-[10px] text-slate-400 block font-mono font-bold">
                        {m.record.monthLabel}
                      </span>
                      <span className="text-xs font-bold text-white font-mono block">
                        Voltage: {m.record.voltage} V
                      </span>
                      <span className="text-xs font-bold text-purple-400 font-mono block">
                        Freq: {m.record.frequency} Hz
                      </span>
                      <span className="text-[10px] font-mono block text-slate-300">
                        Deviation: {m.voltageDeviationPercent > 0 ? '+' : ''}
                        {m.voltageDeviationPercent}%
                      </span>
                    </div>
                  )}

                  <span
                    className={`text-[10px] font-mono font-bold mb-1.5 ${
                      isAbnormal ? 'text-amber-400' : 'text-blue-400'
                    }`}
                  >
                    {m.record.voltage}V
                  </span>

                  <div
                    className={`w-full max-w-[45px] rounded-t-xl transition-all duration-300 group-hover:scale-105 ${
                      isAbnormal
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                        : 'bg-gradient-to-t from-blue-600 to-blue-400'
                    }`}
                    style={{ height: `${vHeight}px` }}
                  />

                  <span className="text-[11px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {m.record.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-mono mt-3">
            Indian & IEC 60038 standards mandate single-phase supply stay between 216.2V and 243.8V (230V ±6%)
            and frequency at 50 Hz ±1%.
          </p>
        </div>
      )}

      {/* CHART 3: Estimated Wastage */}
      {activeChart === 'wastage' && (
        <div>
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-4 font-mono gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" />
                Technical Wastage (kWh)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" />
                Cost Bleed (₹)
              </span>
            </div>
            <span>Calculated from Voltage Stress & Load Spikes</span>
          </div>

          <div className="relative h-72 w-full flex items-end gap-3 sm:gap-6 pt-8 pb-3 px-3 border-b border-slate-800">
            {metrics.map((m, idx) => {
              const wasteHeight = Math.max(8, (m.estimatedWastageKwh / maxWastageKwh) * 190);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={m.record.id}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-20 z-30 bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-center min-w-[140px] pointer-events-none">
                      <span className="text-[10px] text-slate-400 block font-mono font-bold">
                        {m.record.monthLabel}
                      </span>
                      <span className="text-xs font-bold text-amber-400 font-mono block">
                        Wasted: {m.estimatedWastageKwh} kWh
                      </span>
                      <span className="text-xs font-bold text-rose-400 font-mono block">
                        Cost: ₹{m.estimatedWastageCost.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <span className="text-[10px] text-rose-400 font-mono font-bold mb-1.5">
                    ₹{m.estimatedWastageCost}
                  </span>

                  <div
                    className="w-full max-w-[45px] rounded-t-xl bg-gradient-to-t from-amber-600 via-amber-500 to-rose-500 transition-all duration-300 group-hover:scale-105"
                    style={{ height: `${wasteHeight}px` }}
                  />

                  <span className="text-[11px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {m.record.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-mono mt-3">
            Cumulative financial wastage: ₹
            {metrics.reduce((acc, m) => acc + m.estimatedWastageCost, 0).toLocaleString()} across{' '}
            {metrics.reduce((acc, m) => acc + m.estimatedWastageKwh, 0).toLocaleString()} kWh.
          </p>
        </div>
      )}

      {/* CHART 4: Equipment Count Correlation */}
      {activeChart === 'equipment' && (
        <div>
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mb-4 font-mono gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                Equipment Count (Units)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400" />
                kWh Intensity per Appliance
              </span>
            </div>
            <span>Asset Load Density</span>
          </div>

          <div className="relative h-72 w-full flex items-end gap-3 sm:gap-6 pt-8 pb-3 px-3 border-b border-slate-800">
            {metrics.map((m, idx) => {
              const equipHeight = Math.max(15, (m.record.equipmentCount / maxEquipment) * 190);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={m.record.id}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-20 z-30 bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-center min-w-[140px] pointer-events-none">
                      <span className="text-[10px] text-slate-400 block font-mono font-bold">
                        {m.record.monthLabel}
                      </span>
                      <span className="text-xs font-bold text-purple-400 font-mono block">
                        {m.record.equipmentCount} Equipment Units
                      </span>
                      <span className="text-xs font-bold text-white font-mono block">
                        {m.kwhPerEquipment} kWh / Equipment
                      </span>
                    </div>
                  )}

                  <span className="text-[10px] text-purple-300 font-mono font-bold mb-1.5">
                    {m.record.equipmentCount} units
                  </span>

                  <div
                    className="w-full max-w-[45px] rounded-t-xl bg-gradient-to-t from-purple-700 to-purple-500 transition-all duration-300 group-hover:scale-105"
                    style={{ height: `${equipHeight}px` }}
                  />

                  <span className="text-[11px] text-slate-400 font-mono mt-2 truncate w-full text-center">
                    {m.record.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-mono mt-3">
            Average energy consumption per connected equipment: ~
            {(
              metrics.reduce((acc, m) => acc + m.kwhPerEquipment, 0) / Math.max(1, metrics.length)
            ).toFixed(1)}{' '}
            kWh / unit.
          </p>
        </div>
      )}
    </div>
  );
};
