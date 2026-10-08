import React from 'react';
import { AIRecommendation, ActionPlanItem } from '../types/energy';
import { Lightbulb, CheckCircle2, Plus, ArrowRight, TrendingDown, Leaf, Clock, Award } from 'lucide-react';

interface RecommendationsViewProps {
  recommendations: AIRecommendation[];
  actionPlan: ActionPlanItem[];
  onAddToActionPlan: (rec: AIRecommendation) => void;
  currencySymbol?: string;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  actionPlan,
  onAddToActionPlan,
  currencySymbol = '₹',
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Prescriptive Intelligence
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono border border-emerald-500/20">
                Actionable Optimization
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">AI-Generated Business Recommendations</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeted engineering and operational interventions mathematically derived from your energy footprint.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono block">Action Plan Items</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {actionPlan.length} Active Directives
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {recommendations.map((rec) => {
            const isAlreadyAdded = actionPlan.some((item) => item.id.includes(rec.id));
            const isHigh = rec.priority === 'High';

            return (
              <div
                key={rec.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  isHigh
                    ? 'bg-slate-950 border-rose-900/50 shadow-lg ring-1 ring-rose-500/10'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  {/* Top metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {rec.implementationEase}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">{rec.title}</h4>

                  {/* Reason */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 mb-3 space-y-1">
                    <strong className="text-slate-400 font-mono text-[10px] uppercase block">
                      Diagnostic Reason:
                    </strong>
                    <p className="leading-relaxed">{rec.reason}</p>
                  </div>

                  {/* Action */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-slate-200 mb-4 space-y-1">
                    <strong className="text-emerald-400 font-mono text-[10px] uppercase block flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> Recommended Action:
                    </strong>
                    <p className="leading-relaxed">{rec.action}</p>
                  </div>
                </div>

                {/* Bottom Impact & Button */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Estimated Monthly Saving</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      +{currencySymbol}{rec.estimatedSavingCost.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToActionPlan(rec)}
                    disabled={isAlreadyAdded}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isAlreadyAdded
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer font-bold'
                    }`}
                  >
                    {isAlreadyAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>In Action Plan</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Action Plan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
