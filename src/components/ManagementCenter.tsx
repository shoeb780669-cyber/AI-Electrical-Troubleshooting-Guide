import React, { useState } from 'react';
import { KPIStats, WastageIssue, CategoryBreakdown, ActionPlanItem } from '../types/energy';
import {
  Briefcase,
  AlertOctagon,
  TrendingDown,
  Target,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ManagementCenterProps {
  stats: KPIStats;
  issues: WastageIssue[];
  categories: CategoryBreakdown[];
  actionPlan: ActionPlanItem[];
  onUpdateActionPlan: (plan: ActionPlanItem[]) => void;
  currencySymbol?: string;
}

export const ManagementCenter: React.FC<ManagementCenterProps> = ({
  stats,
  issues,
  categories,
  actionPlan,
  onUpdateActionPlan,
  currencySymbol = '₹',
}) => {
  const topCat = categories[0] || { category: 'Air Conditioning', percentage: 42, kwh: 520, cost: 4400 };

  const handleToggleStatus = (id: string) => {
    const updated = actionPlan.map((item) => {
      if (item.id === id) {
        const nextStatus: ActionPlanItem['status'] =
          item.status === 'Pending'
            ? 'In Progress'
            : item.status === 'In Progress'
            ? 'Completed'
            : 'Pending';

        if (nextStatus === 'Completed') {
          // Trigger subtle celebration confetti
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#10b981', '#06b6d4', '#f59e0b'],
            });
          } catch {
            // ignore
          }
        }

        return { ...item, status: nextStatus };
      }
      return item;
    });

    onUpdateActionPlan(updated);
  };

  const completedCount = actionPlan.filter((a) => a.status === 'Completed').length;
  const inProgressCount = actionPlan.filter((a) => a.status === 'In Progress').length;
  const totalCount = actionPlan.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Realized monthly financial recovery from completed actions
  const completedSavings = actionPlan
    .filter((a) => a.status === 'Completed')
    .reduce((acc, curr) => acc + curr.estimatedMonthlySaving, 0);

  return (
    <div className="space-y-6">
      {/* Section 1: Executive 6-Pillar Decision Framework */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Strategic Governance
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                MBA Decision Framework
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Energy Management Decision Center</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Transforming raw kilowatt-hour spikes into executive-level capital and operational decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Facility Management Oversight
            </span>
          </div>
        </div>

        {/* 6 Decision Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Current Situation */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold block mb-1">
                1. Current Situation
              </span>
              <h4 className="text-sm font-bold text-white mb-2">What is happening?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The facility consumed <strong>{stats.totalKwh.toLocaleString()} kWh</strong> over the monitored period,
                yielding an Energy Efficiency Score of <strong>{stats.efficiencyScore}/100</strong>. Sub-metering reveals
                substantial load when occupancy is zero.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300">
              Run-Rate: {stats.avgDailyKwh} kWh / day
            </div>
          </div>

          {/* 2. Key Problem */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold block mb-1">
                2. Key Problem
              </span>
              <h4 className="text-sm font-bold text-white mb-2">What is causing the biggest issue?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>{topCat.category}</strong> accounts for {topCat.percentage}% of all power. Heavy nocturnal
                cycling and unmanaged computer lab standby between 20:00 - 04:00 cause {stats.wastagePercentage}%
                avoidable leakage.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-amber-300">
              Excess Drain: {stats.potentialWastageKwh} kWh
            </div>
          </div>

          {/* 3. Financial Impact */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold block mb-1">
                3. Financial Impact
              </span>
              <h4 className="text-sm font-bold text-white mb-2">What is the estimated cost?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Total utility expenditure stands at <strong>{currencySymbol}{stats.totalCost.toLocaleString()}</strong>.
                Preventable wastage drains <strong>{currencySymbol}{stats.potentialWastageCost.toLocaleString()}</strong>,
                projecting to <strong>{currencySymbol}{stats.potentialMonthlySavings.toLocaleString()}</strong> lost monthly.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-rose-300">
              Annual Bleed: ~{currencySymbol}{(stats.potentialMonthlySavings * 12).toLocaleString()}
            </div>
          </div>

          {/* 4. Priority */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-900/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold block mb-1">
                4. Priority
              </span>
              <h4 className="text-sm font-bold text-white mb-2">What should management address first?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Immediate HVAC & IT Shutdown Protocol</strong>. This offers the highest return on investment
                with zero capital expenditure (₹0 CapEx) and requires no disruption to regular daytime business hours.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-purple-300">
              Urgency: Critical / Day 1 Action
            </div>
          </div>

          {/* 5. Recommended Action */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-900/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold block mb-1">
                5. Recommended Action
              </span>
              <h4 className="text-sm font-bold text-white mb-2">What should be done?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                1) Enforce automated 18:30 HVAC cut-off via timer relay. 2) Set default thermostat temperature to 24°C.
                3) Push workstation sleep policies across all campus desktop machines.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-blue-300">
              Operational Complexity: Low
            </div>
          </div>

          {/* 6. Expected Scenario */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-900/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold block mb-1">
                6. Expected Scenario
              </span>
              <h4 className="text-sm font-bold text-white mb-2">What could improve if followed?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Efficiency score will elevate from <strong>{stats.efficiencyScore}/100</strong> to <strong>91+/100</strong>,
                recovering up to <strong>{currencySymbol}{stats.potentialMonthlySavings.toLocaleString()}</strong> monthly
                and avoiding ~{Math.round(stats.co2EmissionsKg * 0.22)} kg in carbon emissions.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-300">
              Target Score: 92 / 100
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Prioritized Action Plan & Task Tracker */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Action Plan Execution Tracker
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">Prioritized Operational Interventions</h3>
            <p className="text-xs text-slate-400">
              Click status pills to transition actions: <span className="text-slate-400">Pending</span> →{' '}
              <span className="text-cyan-400">In Progress</span> →{' '}
              <span className="text-emerald-400">Completed</span>.
            </p>
          </div>

          {/* Progress & Recovered Metric */}
          <div className="flex items-center gap-4 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between items-center text-[11px] font-mono mb-1 gap-4">
                <span className="text-slate-400">Execution Progress:</span>
                <span className="text-emerald-400 font-bold">{completionPercent}%</span>
              </div>
              <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            <div className="border-l border-slate-800 pl-4 text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Recovered Value</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {currencySymbol}{completedSavings.toLocaleString()} / mo
              </span>
            </div>
          </div>
        </div>

        {/* Action Items Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Root Cause / Issue</th>
                <th className="pb-3 font-semibold">Recommended Intervention</th>
                <th className="pb-3 font-semibold text-right">Monthly Recovery</th>
                <th className="pb-3 font-semibold text-center">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {actionPlan.map((item) => {
                const isHigh = item.priority === 'High';
                const isMed = item.priority === 'Medium';

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Priority badge */}
                    <td className="py-3.5 pr-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isHigh
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isMed
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 pr-3 font-mono text-slate-300 font-medium">
                      {item.category}
                    </td>

                    {/* Issue */}
                    <td className="py-3.5 pr-3 text-slate-300 max-w-xs">{item.issue}</td>

                    {/* Action */}
                    <td className="py-3.5 pr-3 text-slate-200 max-w-sm">{item.action}</td>

                    {/* Potential Monthly Saving */}
                    <td className="py-3.5 pr-3 text-right font-mono font-bold text-emerald-400">
                      +{currencySymbol}{item.estimatedMonthlySaving.toLocaleString()}
                    </td>

                    {/* Status Toggle Button */}
                    <td className="py-3.5 text-center">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                          item.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : item.status === 'In Progress'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                        }`}
                      >
                        {item.status}
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
