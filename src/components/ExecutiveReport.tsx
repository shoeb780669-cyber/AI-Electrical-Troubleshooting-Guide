import React from 'react';
import { KPIStats, WastageIssue, CategoryBreakdown, ActionPlanItem, EnergyRecord } from '../types/energy';
import {
  Printer,
  Download,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
  ShieldCheck,
  TrendingDown,
  Layers,
} from 'lucide-react';

interface ExecutiveReportProps {
  stats: KPIStats;
  issues: WastageIssue[];
  categories: CategoryBreakdown[];
  actionPlan: ActionPlanItem[];
  records: EnergyRecord[];
  currencySymbol?: string;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({
  stats,
  issues,
  categories,
  actionPlan,
  records,
  currencySymbol = '₹',
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = ['Date', 'Time', 'Category', 'Actual_kWh', 'Expected_kWh', 'Excess_kWh', 'Occupancy', 'Notes'];
    const rows = records.map((r) => [
      r.date,
      r.time,
      `"${r.category}"`,
      r.kwh,
      r.expectedKwh,
      Math.max(0, Number((r.kwh - r.expectedKwh).toFixed(2))),
      r.occupancyStatus,
      `"${r.notes || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EnergyIQ_Audit_Report_${stats.dateRange.start}_to_${stats.dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const reportData = {
      project: {
        title: 'AI-Powered Energy Cost & Wastage Analytics for Smart Business Management',
        student: 'Mohammed Shoeb Ahmed',
        course: 'MBA – Final Year (Systems)',
        college: 'Amjad Ali Khan College of Business Administration (AAKCBA)',
        organization: 'Edunet Foundation',
        technology: 'Artificial Intelligence / Generative AI',
        subject: 'Business Analytics',
      },
      auditDate: new Date().toISOString(),
      monitoredPeriod: stats.dateRange,
      kpis: stats,
      categoryDisaggregation: categories,
      wastageIncidentsCount: issues.length,
      actionPlanSummary: actionPlan,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EnergyIQ_Dossier_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Executive Project Report & Management Dossier
          </h3>
          <p className="text-xs text-slate-400">
            Formatted for formal MBA academic submission and C-Suite facility management review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Formal Printable Report Sheet */}
      <div className="print-card rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl text-slate-100">
        {/* Academic Header Banner */}
        <div className="border-b-2 border-slate-700 pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-extrabold block mb-1">
                MBA FINAL-YEAR BUSINESS ANALYTICS CAPSTONE
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                EnergyIQ: AI-Powered Energy Cost & Wastage Analytics
              </h1>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                Decision Support System for Smart Commercial & Institutional Facilities
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1 min-w-[240px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Student: <strong>Mohammed Shoeb Ahmed</strong></span>
              </div>
              <div className="text-slate-400 pl-5">Course: MBA – Final Year (Systems)</div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[11px]">Amjad Ali Khan College of Business Administration</span>
              </div>
              <div className="text-slate-400 pl-5 text-[11px]">Organization: Edunet Foundation</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <div>Audit Period: <span className="text-slate-200">{stats.dateRange.start} to {stats.dateRange.end}</span></div>
            <div>Dataset Size: <span className="text-slate-200">{records.length} records</span></div>
            <div>Engine Mode: <span className="text-emerald-400">Zero-Cost Heuristic + GenAI</span></div>
            <div>Efficiency Score: <span className="text-cyan-400 font-bold">{stats.efficiencyScore} / 100</span></div>
          </div>
        </div>

        {/* Section 1: Executive KPI Summary */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            1. Executive Key Performance Indicators
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Energy</span>
              <span className="text-base font-bold text-white font-mono">{stats.totalKwh.toLocaleString()} kWh</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Utility Cost</span>
              <span className="text-base font-bold text-cyan-400 font-mono">{currencySymbol}{stats.totalCost.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Identified Wastage</span>
              <span className="text-base font-bold text-amber-400 font-mono">{stats.potentialWastageKwh} kWh</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Wastage Cost</span>
              <span className="text-base font-bold text-rose-400 font-mono">{currencySymbol}{stats.potentialWastageCost.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Wastage Ratio</span>
              <span className="text-base font-bold text-amber-300 font-mono">{stats.wastagePercentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Monthly Savings</span>
              <span className="text-base font-bold text-emerald-400 font-mono">+{currencySymbol}{stats.potentialMonthlySavings.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Major Anomaly & Wastage Findings */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            2. Major Wastage Incidents Detected ({issues.length} Events Flagged)
          </h2>

          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Date / Time</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Actual vs Benchmark</th>
                  <th className="p-2.5">Cost Drain</th>
                  <th className="p-2.5">Diagnostic Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {issues.slice(0, 6).map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-800/30">
                    <td className="p-2.5 font-mono text-slate-300">{issue.date} {issue.time}</td>
                    <td className="p-2.5 font-semibold text-white">{issue.category}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        issue.severity === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-slate-300">
                      {issue.actualKwh} kWh (exp. {issue.expectedKwh} kWh)
                    </td>
                    <td className="p-2.5 font-mono text-rose-400 font-bold">
                      +{currencySymbol}{issue.costImpact}
                    </td>
                    <td className="p-2.5 text-slate-300 max-w-sm">{issue.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Strategic Recommendations & Action Plan */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            3. Prioritized Strategic Interventions
          </h2>

          <div className="space-y-2.5">
            {actionPlan.map((action, idx) => (
              <div key={action.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-emerald-400 font-bold">REC-0{idx + 1}</span>
                    <span className="font-bold text-white">{action.action}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                      {action.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{action.issue}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    +{currencySymbol}{action.estimatedMonthlySaving.toLocaleString()}/mo
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Impact: {action.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Verification Footer */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>EnergyIQ Analytical Model Certified • Academic Demonstration Build</span>
          </div>
          <span>Report Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
