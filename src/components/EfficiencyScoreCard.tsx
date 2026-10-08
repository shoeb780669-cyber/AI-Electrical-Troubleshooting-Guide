import React from 'react';
import { EfficiencyBreakdown, KPIStats } from '../types/energy';
import { Award, ShieldCheck, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface EfficiencyScoreCardProps {
  stats: KPIStats;
  breakdown: EfficiencyBreakdown;
  onExploreRecommendations?: () => void;
}

export const EfficiencyScoreCard: React.FC<EfficiencyScoreCardProps> = ({
  stats,
  breakdown,
  onExploreRecommendations,
}) => {
  const score = breakdown.overall;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 80 ? '#10b981' : score >= 60 ? '#06b6d4' : score >= 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Energy Efficiency Score
              </h4>
              <span className="text-[10px] text-slate-400">Benchmark Rating Index</span>
            </div>
          </div>

          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded font-bold"
            style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
          >
            {score >= 80 ? 'Grade A - High' : score >= 60 ? 'Grade B - Moderate' : 'Grade C - Inefficient'}
          </span>
        </div>

        {/* Circular Gauge */}
        <div className="flex items-center justify-center my-3">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#1e293b"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke={scoreColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white font-mono leading-none tracking-tight">
                {score}
              </span>
              <span className="text-[11px] font-mono text-slate-400 mt-1">/ 100 PTS</span>
            </div>
          </div>
        </div>

        {/* Weighted Sub-Scores */}
        <div className="space-y-2 mt-4 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Wastage Control (40%):</span>
            <span className="font-bold text-white">{breakdown.wastageControl} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${breakdown.wastageControl}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-slate-300 pt-1">
            <span className="text-slate-400">After-Hours Discipline (25%):</span>
            <span className="font-bold text-white">{breakdown.afterHoursDiscipline} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${breakdown.afterHoursDiscipline}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-slate-300 pt-1">
            <span className="text-slate-400">Peak Load Management (20%):</span>
            <span className="font-bold text-white">{breakdown.peakLoadManagement} / 100</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${breakdown.peakLoadManagement}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rationale Explanation */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed font-sans">
        <p>
          <strong className="text-slate-200">Score Rationale:</strong> Deductions reflect {stats.potentialWastageKwh} kWh
          in preventable off-peak drain (primarily {stats.topWastageCategory}). Remediating scheduled HVAC shutdown can
          elevate this rating to 92+.
        </p>
      </div>
    </div>
  );
};
