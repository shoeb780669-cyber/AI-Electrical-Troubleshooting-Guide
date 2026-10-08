import React, { useState } from 'react';
import {
  TroubleshootingIssue,
  TroubleCategory,
  SafetyHazardLevel,
} from '../types/electrical';
import {
  ELECTRICAL_KNOWLEDGE_BASE,
  searchTroubleshootingKnowledge,
  resolveElectricalIssueWithAI,
} from '../services/troubleshootingEngine';
import {
  Wrench,
  Search,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Printer,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Flame,
  Bot,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES: (TroubleCategory | 'All')[] = [
  'All',
  'Breakers & Protection',
  'Motors & Pumps',
  'Wiring & Panels',
  'Voltage & Power Quality',
  'HVAC & Refrigeration',
  'Earthing & Safety',
];

const QUICK_ISSUES = [
  'Frequent MCB / Circuit Breaker Tripping',
  'Voltage Fluctuations, Dips & Flickering Lights',
  'Electric Motor / Pump Overheating & Humming',
  'Electric Shock or Tingle from Appliance Metal Body',
  'Hot Switchboard, Burning Plastic Smell & Scorched Wires',
  'Unexplained Spike in Monthly Electricity Bill',
  'Air Conditioner Blowing Warm Air / Compressor Failing to Start',
  'Low Power Factor Penalty on Commercial Electricity Bill',
];

export const TroubleshootingSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<TroubleCategory | 'All'>('All');
  const [activeIssue, setActiveIssue] = useState<TroubleshootingIssue>(ELECTRICAL_KNOWLEDGE_BASE[0]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search filtered issues
  const matchingIssues = searchTroubleshootingKnowledge(searchQuery, selectedCategory);

  const handleDiagnose = async (customText?: string) => {
    const textToQuery = (customText || searchQuery).trim();
    if (!textToQuery) return;

    setIsAiLoading(true);
    try {
      const result = await resolveElectricalIssueWithAI(textToQuery, selectedCategory);
      setActiveIssue(result);
    } catch (err) {
      console.error('Error resolving issue:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyChecklist = () => {
    if (!activeIssue) return;
    const text = `=== ELECTRICAL TROUBLESHOOTING GUIDE: ${activeIssue.title} ===
Safety Level: ${activeIssue.safetyLevel}

SAFETY WARNINGS:
${activeIssue.safetyWarnings.map((w) => `- ${w}`).join('\n')}

PROBABLE CAUSES:
${activeIssue.probableCauses.map((c) => `- ${c}`).join('\n')}

RESOLUTION STEPS:
${activeIssue.resolutionSteps.map((s) => `Step ${s.step}: ${s.title}\n${s.detail}${s.caution ? `\nCAUTION: ${s.caution}` : ''}`).join('\n\n')}

TOOLS REQUIRED:
${activeIssue.toolsRequired.join(', ')}

WHEN TO CALL PROFESSIONAL:
${activeIssue.whenToCallProfessional}`;

    navigator.clipboard.writeText(text);
    setCopiedId('copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Diagnostic Search Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              AI-Powered Electrical Diagnostics
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Electrical Problem Diagnostics & Safety Protocols
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Describe any electrical fault or symptom below. The AI diagnostic engine will analyze the issue,
            highlight critical safety warnings, and generate a step-by-step resolution workflow.
          </p>

          {/* Search Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDiagnose();
            }}
            className="mt-5 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe issue (e.g., MCB trips when AC starts, water pump humming, burning smell, mild shocks...)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
            <button
              type="submit"
              disabled={isAiLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiLoading ? 'Analyzing...' : 'Diagnose with AI'}</span>
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Issue Chips */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono text-slate-500">Quick Diagnostics:</span>
            {QUICK_ISSUES.slice(0, 5).map((qTitle, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(qTitle);
                  handleDiagnose(qTitle);
                }}
                className="px-2 py-0.5 rounded bg-slate-950/80 hover:bg-slate-800 text-[10px] text-slate-300 hover:text-cyan-300 font-mono border border-slate-800 transition-colors"
              >
                {qTitle.split('(')[0].split('/')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Troubleshooting Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Matching Issues */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400">
              Matching Fault Protocols ({matchingIssues.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Select to View</span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {matchingIssues.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                No predefined faults match your query. Click <strong>"Diagnose with AI"</strong> above to
                generate a tailored safety and resolution guide!
              </div>
            ) : (
              matchingIssues.map((issue) => {
                const isSelected = activeIssue.id === issue.id;
                const isCritical = issue.safetyLevel === 'CRITICAL HAZARD';
                const isHigh = issue.safetyLevel === 'HIGH RISK';

                return (
                  <button
                    key={issue.id}
                    onClick={() => setActiveIssue(issue)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/95 border-cyan-500/60 shadow-lg ring-1 ring-cyan-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                      >
                        {issue.safetyLevel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{issue.category}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {issue.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-sans">
                      {issue.symptoms[0]}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Comprehensive Diagnostic Dossier */}
        <div className="lg:col-span-8">
          <div className="print-card rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                      activeIssue.safetyLevel === 'CRITICAL HAZARD'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : activeIssue.safetyLevel === 'HIGH RISK'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {activeIssue.safetyLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-400">• {activeIssue.category}</span>
                  {activeIssue.source && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
                      {activeIssue.source}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {activeIssue.title}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="no-print flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyChecklist}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                >
                  {copiedId === 'copied' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Guide</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: CRUCIAL SAFETY WARNINGS (High Visual Priority) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-950 to-slate-950 border-2 border-rose-600/40 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2 text-rose-400 mb-2 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Mandatory Electrical Safety Warnings (Do Not Skip!)</span>
              </div>

              <ul className="space-y-1.5 text-xs text-rose-200 font-sans">
                {activeIssue.safetyWarnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SECTION 2: PROBABLE ROOT CAUSES */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Probable Root Causes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeIssue.probableCauses.map((cause, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-cyan-400 font-mono font-bold text-[11px] shrink-0">
                      {idx + 1}.
                    </span>
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: STEP-BY-STEP RESOLUTION GUIDE */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Step-by-Step Resolution Guide
              </h4>

              <div className="space-y-3">
                {activeIssue.resolutionSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                      {step.step}
                    </div>

                    <div className="flex-1 space-y-1 text-xs">
                      <h5 className="font-bold text-white text-sm">{step.title}</h5>
                      <p className="text-slate-300 leading-relaxed font-sans">{step.detail}</p>
                      {step.caution && (
                        <div className="mt-2 p-2 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            <strong>Safety Check:</strong> {step.caution}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: TOOLS REQUIRED & PREVENTIVE MAINTENANCE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  Recommended Diagnostic Tools
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {activeIssue.toolsRequired.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-200 font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <h5 className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Preventive Maintenance Rule
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeIssue.preventiveMaintenance}
                </p>
              </div>
            </div>

            {/* SECTION 5: WHEN TO CALL A LICENSED PROFESSIONAL */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">When to call a Certified Electrician: </strong>
                <span>{activeIssue.whenToCallProfessional}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
