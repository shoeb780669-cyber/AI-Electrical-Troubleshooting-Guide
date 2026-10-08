import React from 'react';
import {
  DashboardSummaryKPIs,
  ComputedMonthlyMetric,
  MonthlyEnergyRecord,
} from '../types/electrical';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Activity,
  Layers,
  Wrench,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Gauge,
} from 'lucide-react';

interface DashboardOverviewProps {
  summary: DashboardSummaryKPIs;
  metrics: ComputedMonthlyMetric[];
  onOpenAddModal: () => void;
  onNavigateToTab: (tab: any) => void;
  onEditRecord: (record: MonthlyEnergyRecord) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  metrics,
  onOpenAddModal,
  onNavigateToTab,
  onEditRecord,
}) => {
  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Action Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Electrical Monitoring & Safety Center
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {summary.recordCount} Months Analyzed ({summary.earliestMonth} – {summary.latestMonth})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Electrical Troubleshooting Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Track monthly kWh consumption, electricity bills, voltage stability, and equipment loads
              with automated wastage calculations and AI diagnostic workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Monthly Data</span>
            </button>
            <button
              onClick={() => onNavigateToTab('troubleshoot')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Diagnose Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Power Quality Alert Banner (if voltage/frequency abnormal) */}
      {summary.powerQualityStatus !== 'Optimal' && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
            summary.powerQualityStatus === 'Critical Warning'
              ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
              : summary.powerQualityStatus === 'Sub-optimal'
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold uppercase font-mono tracking-wider">
                Power Quality Alert: {summary.powerQualityStatus}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 font-mono">
                Score: {summary.powerQualityScore}/100
              </span>
            </div>
            <p>
              Average voltage is <strong>{summary.averageVoltage}V</strong> (nominal 230V ±6%) with grid
              frequency at <strong>{summary.averageFrequency} Hz</strong>. Voltage stress accounts for an
              estimated <strong>{summary.totalEstimatedWastageKwh} kWh</strong> in technical resistive losses.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('troubleshoot')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 font-mono text-[11px] shrink-0 border border-slate-700"
          >
            Troubleshoot Voltage →
          </button>
        </div>
      )}

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Average Monthly Consumption */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold">Avg Monthly kWh</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-2xl font-extrabold text-white font-mono block">
              {summary.averageMonthlyKwh.toLocaleString()}{' '}
              <span className="text-xs text-slate-400 font-normal">kWh</span>
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Total Logged: {summary.totalKwh.toLocaleString()} kWh
          </div>
        </div>

        {/* Card 2: Average Monthly Bill */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold">Avg Monthly Bill</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono block">
              ₹{summary.averageMonthlyBill.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Effective Tariff: ₹{summary.avgCostPerKwh}/kWh
          </div>
        </div>

        {/* Card 3: Month-over-Month % Change */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold">Latest MoM Change</span>
              {summary.latestMoMChangePercent !== null && summary.latestMoMChangePercent < 0 ? (
                <TrendingDown className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingUp className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <span
              className={`text-2xl font-extrabold font-mono block ${
                summary.latestMoMChangePercent === null
                  ? 'text-slate-400'
                  : summary.latestMoMChangePercent < 0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {summary.latestMoMChangePercent === null
                ? 'N/A'
                : `${summary.latestMoMChangePercent > 0 ? '+' : ''}${summary.latestMoMChangePercent}%`}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Bill MoM:{' '}
            <span
              className={
                summary.latestBillMoMChangePercent && summary.latestBillMoMChangePercent > 0
                  ? 'text-rose-400 font-bold'
                  : 'text-emerald-400 font-bold'
              }
            >
              {summary.latestBillMoMChangePercent !== null
                ? `${summary.latestBillMoMChangePercent > 0 ? '+' : ''}${summary.latestBillMoMChangePercent}%`
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Card 4: Estimated Wastage */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-900/40 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold">Estimated Wastage</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-2xl font-extrabold text-amber-400 font-mono block">
              {summary.totalEstimatedWastageKwh}{' '}
              <span className="text-xs text-amber-300 font-normal">kWh</span>
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-rose-400 font-bold">
            Drain Cost: ₹{summary.totalEstimatedWastageCost.toLocaleString()}
          </div>
        </div>

        {/* Card 5: Voltage & Frequency Status */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold">Grid Voltage</span>
              <Gauge className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-2xl font-extrabold text-white font-mono block">
              {summary.averageVoltage} <span className="text-xs text-slate-400 font-normal">V</span>
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Frequency: {summary.averageFrequency} Hz
          </div>
        </div>

        {/* Card 6: Equipment Count */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold">Active Equipment</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-2xl font-extrabold text-purple-400 font-mono block">
              {summary.totalEquipmentTracked}{' '}
              <span className="text-xs text-slate-400 font-normal">Units</span>
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Load Intensity: {latestMetric ? latestMetric.kwhPerEquipment : 0} kWh/unit
          </div>
        </div>
      </div>

      {/* Middle Section: Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: Add or Edit Data */}
        <div
          onClick={onOpenAddModal}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
            Enter Monthly Energy Data
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Input new monthly kWh, electricity bill in rupees, voltage, frequency, and equipment counts.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 mt-3 font-semibold">
            Open Add Form <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Box 2: AI Troubleshooting Finder */}
        <div
          onClick={() => onNavigateToTab('troubleshoot')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
            AI Electrical Diagnostics
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Diagnose MCB tripping, motor humming, voltage fluctuations, electric shock sensations, and burning switchboards.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-blue-400 mt-3 font-semibold">
            Solve Electrical Issue <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Box 3: View Interactive Charts */}
        <div
          onClick={() => onNavigateToTab('charts')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
            Interactive Trend Charts
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Inspect responsive charts for consumption, monthly bill trends, voltage stability, and wastage tracking.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 mt-3 font-semibold">
            Explore Visual Trends <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Recent Monthly Records Overview Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Recent Energy & Voltage Records</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Auto-Calculated
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any month or edit button to update values and recalculate KPIs instantly.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('monthlyData')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Manage All Records ({metrics.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3 text-right">Consumption</th>
                <th className="p-3 text-right">Bill Amount</th>
                <th className="p-3 text-right">Rate / Unit</th>
                <th className="p-3 text-right">Voltage</th>
                <th className="p-3 text-right">Frequency</th>
                <th className="p-3 text-right">Equipment</th>
                <th className="p-3 text-right">MoM Change</th>
                <th className="p-3 text-right">Est. Wastage</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {metrics.slice(-5).map((m) => {
                const isReduction = m.kwhMoMChangePercent !== null && m.kwhMoMChangePercent < 0;
                const isIncrease = m.kwhMoMChangePercent !== null && m.kwhMoMChangePercent > 0;

                return (
                  <tr key={m.record.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white font-mono">{m.record.monthLabel}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {m.record.kwh.toLocaleString()} kWh
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                      ₹{m.record.billAmount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-300">₹{m.costPerKwh}</td>
                    <td className="p-3 text-right font-mono text-slate-200">
                      <span
                        className={
                          Math.abs(m.voltageDeviationPercent) > 6
                            ? 'text-amber-400 font-bold'
                            : 'text-slate-200'
                        }
                      >
                        {m.record.voltage}V
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-300">
                      {m.record.frequency} Hz
                    </td>
                    <td className="p-3 text-right font-mono text-purple-400">
                      {m.record.equipmentCount} units
                    </td>
                    <td className="p-3 text-right font-mono">
                      {m.kwhMoMChangePercent === null ? (
                        <span className="text-slate-500">—</span>
                      ) : (
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isReduction
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : isIncrease
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {m.kwhMoMChangePercent > 0 ? '+' : ''}
                          {m.kwhMoMChangePercent}%
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono text-amber-400">
                      {m.estimatedWastageKwh > 0 ? (
                        <span>
                          {m.estimatedWastageKwh} kWh <span className="text-[10px] text-slate-500">(₹{m.estimatedWastageCost})</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">0 kWh</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onEditRecord(m.record)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-mono cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
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
