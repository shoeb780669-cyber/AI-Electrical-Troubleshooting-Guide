import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles, AlertCircle, ArrowRight, X } from 'lucide-react';

interface AiScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const SCAN_STAGES = [
  { id: 1, label: 'Collecting Energy Data...', detail: 'Harvesting 168+ hourly sub-metering points across all facility zones' },
  { id: 2, label: 'Cleaning Data...', detail: 'Validating null records, verifying power factor variance and date ranges' },
  { id: 3, label: 'Analysing Consumption Patterns...', detail: 'Calculating daytime baselines against historical occupancy calendars' },
  { id: 4, label: 'Detecting Anomalies...', detail: 'Isolating off-peak HVAC cycling, computer lab standby, and phantom loads' },
  { id: 5, label: 'Calculating Cost Impact...', detail: 'Applying multi-tiered Time-of-Use tariffs to determine financial loss' },
  { id: 6, label: 'Generating Recommendations...', detail: 'Formulating prioritised operational interventions and ROI estimates' },
  { id: 7, label: 'Analysis Complete', detail: 'Energy Intelligence dossier compiled successfully for executive review' },
];

export const AiScanModal: React.FC<AiScanModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < SCAN_STAGES.length - 1) {
          return prev + 1;
        } else {
          setIsFinished(true);
          clearInterval(interval);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.round(((currentStepIndex + 1) / SCAN_STAGES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden">
        {/* Glowing border accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />
        
        {/* Background Radar Pulse */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button if finished */}
        {isFinished && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              EnergyIQ Machine Analytics Engine
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Autonomous Statistical & Anomaly Scanning
            </p>
          </div>
        </div>

        {/* Visual Progress Gauge */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="text-cyan-400 font-semibold">
              {isFinished ? 'SCAN FINALIZED' : 'PROCESSING PIPELINE...'}
            </span>
            <span className="text-slate-300 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Sequence List */}
        <div className="space-y-2.5 mb-6 max-h-72 overflow-y-auto pr-1">
          {SCAN_STAGES.map((stage, idx) => {
            const isDone = idx < currentStepIndex || (isFinished && idx === currentStepIndex);
            const isCurrent = idx === currentStepIndex && !isFinished;
            const isPending = idx > currentStepIndex;

            return (
              <div
                key={stage.id}
                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20'
                    : isDone
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-slate-950/40 border-slate-900/60 text-slate-500 opacity-60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-mono text-emerald-400/90">Verified</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {stage.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          {!isFinished ? (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mr-auto">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Synthesizing heuristic anomalies...</span>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onComplete();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>Explore AI Wastage & Insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
