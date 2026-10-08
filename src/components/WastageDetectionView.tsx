import React, { useState } from 'react';
import { WastageIssue, KPIStats } from '../types/energy';
import { CATEGORY_METADATA } from '../data/demoData';
import {
  AlertTriangle,
  ShieldAlert,
  Flame,
  CheckCircle,
  Filter,
  DollarSign,
  Zap,
  ArrowRight,
  TrendingDown,
  Info,
} from 'lucide-react';

interface WastageDetectionViewProps {
  issues: WastageIssue[];
  stats: KPIStats;
  currencySymbol?: string;
}

export const WastageDetectionView: React.FC<WastageDetectionViewProps> = ({
  issues,
  stats,
  currencySymbol = '₹',
}) => {
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const handleToggleResolve = (id: string) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = severityFilter === 'All' || issue.severity === severityFilter;
    const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
    return matchesSeverity && matchesCategory;
  });

  const highCount = issues.filter((i) => i.severity === 'High').length;
  const mediumCount = issues.filter((i) => i.severity === 'Medium').length;
  const lowCount = issues.filter((i) => i.severity === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold">Total Wastage</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {stats.potentialWastageKwh} kWh
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            {stats.wastagePercentage}% of entire power supply
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-rose-400 font-bold">Wastage Cost Drain</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {currencySymbol}{stats.potentialWastageCost.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Monitored audit expenditure
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-900 border border-red-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-red-400 font-bold">High Severity Anomalies</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {highCount} Incidents
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Immediate financial leakage
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Potential Monthly Savings</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            +{currencySymbol}{stats.potentialMonthlySavings.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            If anomalous spikes are resolved
          </span>
        </div>
      </div>

      {/* Main Wastage List & Filters */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Anomaly Diagnostics
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {issues.length} Total Events
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Potential Wastage Detected</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific timestamped consumption excursions flagged against baseline occupancy models.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              {(['All', 'High', 'Medium', 'Low'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    severityFilter === sev
                      ? 'bg-slate-800 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev} {sev === 'High' ? `(${highCount})` : sev === 'Medium' ? `(${mediumCount})` : ''}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="All">All Categories</option>
              {Object.keys(CATEGORY_METADATA).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Issues Grid / Cards */}
        <div className="space-y-3 mt-6">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No wastage incidents match the selected severity or category filter.
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const isResolved = resolvedIds.has(issue.id);
              const isHigh = issue.severity === 'High';
              const isMed = issue.severity === 'Medium';

              return (
                <div
                  key={issue.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isResolved
                      ? 'bg-slate-950/50 border-slate-800/60 opacity-60'
                      : isHigh
                      ? 'bg-slate-950 border-rose-900/50 shadow-md ring-1 ring-rose-500/10'
                      : isMed
                      ? 'bg-slate-950 border-amber-900/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      {/* Top badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isHigh
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : isMed
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {issue.severity} Severity
                        </span>

                        <span className="text-white font-bold">{issue.category}</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          • {issue.date} at {issue.time}
                        </span>
                      </div>

                      {/* Reason text */}
                      <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                        <strong className="text-slate-200">Root Cause:</strong> {issue.reason}
                      </p>

                      {/* Remediation */}
                      <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-emerald-300 flex items-start gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-emerald-400">Action:</strong> {issue.recommendedAction}
                        </span>
                      </div>
                    </div>

                    {/* Right Numbers & Action Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-left sm:text-right font-mono">
                        <span className="text-xs font-bold text-rose-400 block">
                          +{currencySymbol}{issue.costImpact} Drain
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Excess: {issue.excessKwh} kWh
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          ({issue.actualKwh} vs exp. {issue.expectedKwh})
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleResolve(issue.id)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                          isResolved
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{isResolved ? 'Resolved' : 'Mark Reviewed'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
