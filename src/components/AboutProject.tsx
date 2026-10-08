import React from 'react';
import {
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Zap,
  DollarSign,
  TrendingUp,
  FileCode,
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-extrabold block mb-2">
            MBA Final-Year Systems & Business Analytics Capstone Project
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            AI-Powered Energy Cost & Wastage Analytics for Smart Business Management
          </h1>
          <p className="text-base text-slate-300 mt-3 leading-relaxed">
            Turn Energy Data into Smarter Business Decisions. Demonstrating how Artificial Intelligence,
            machine analytics, and Generative AI bridge the gap between technical kilowatt-hour metering
            and executive decision support.
          </p>
        </div>
      </div>

      {/* Project Metadata Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase">Student Investigator</span>
          </div>
          <h3 className="text-lg font-bold text-white">Mohammed Shoeb Ahmed</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">MBA – Final Year (Systems Specialization)</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase">Academic Institution</span>
          </div>
          <h3 className="text-base font-bold text-white leading-snug">
            Amjad Ali Khan College of Business Administration
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Affiliated with Osmania University (AAKCBA)</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase">Subject Area</span>
          </div>
          <h3 className="text-lg font-bold text-white">Business Analytics</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Supported by Edunet Foundation</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase">Technology Stack</span>
          </div>
          <h3 className="text-base font-bold text-white">Artificial Intelligence / GenAI</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Zero-Cost Heuristic + Statistical Engine</p>
        </div>
      </div>

      {/* Methodology Section: Data -> AI -> Insight -> Action -> Value */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Core Analytical Methodology</h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          The application follows a closed-loop analytical paradigm designed to convert uninterpreted
          telemetry into measurable bottom-line business value.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              step: '1. DATA',
              title: 'Sub-Meter Telemetry',
              desc: 'High-frequency logging of kWh by category, time, and occupancy flag.',
              color: 'text-sky-400',
              border: 'border-sky-500/30',
            },
            {
              step: '2. AI ENGINE',
              title: 'Pattern Analytics',
              desc: 'Automated baseline modeling, statistical variance checks, and after-hours filters.',
              color: 'text-purple-400',
              border: 'border-purple-500/30',
            },
            {
              step: '3. INSIGHT',
              title: 'Root-Cause Findings',
              desc: 'Pinpoints specific anomalies such as nocturnal HVAC run and phantom loads.',
              color: 'text-amber-400',
              border: 'border-amber-500/30',
            },
            {
              step: '4. ACTION',
              title: 'Decision Support',
              desc: 'Generates prioritized operational intervention roadmaps for facility managers.',
              color: 'text-emerald-400',
              border: 'border-emerald-500/30',
            },
            {
              step: '5. VALUE',
              title: 'Bottom-Line Recovery',
              desc: 'Measurable reductions in utility expenditure, peak charges, and carbon emissions.',
              color: 'text-green-400',
              border: 'border-green-500/30',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl bg-slate-950 border ${item.border} flex flex-col justify-between`}
            >
              <div>
                <span className={`text-[10px] font-mono font-bold ${item.color} uppercase block mb-1`}>
                  {item.step}
                </span>
                <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zero-Cost Architecture & Academic Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Zero-Cost Architecture */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Zero-Cost Architectural Principles</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            In compliance with strict project design principles, EnergyIQ is entirely built upon
            open-source technologies without any mandatory paid dependencies:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>100% Free & Open-Source:</strong> Built with React, TypeScript, Vite, Tailwind CSS, SVG & HTML5 Canvas.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>No Mandatory Cloud Payments:</strong> Runs locally with zero credit card or subscription requirements.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Heuristic AI Engine:</strong> Uses a full local rule and statistical analysis pipeline that operates offline.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Privacy First:</strong> Energy datasets are processed locally in browser memory without third-party exposure.</span>
            </li>
          </ul>
        </div>

        {/* Academic Integrity & Result Classification */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Scientific Transparency & Labels</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            To uphold academic and MBA scientific integrity, all analytical results in EnergyIQ are
            explicitly categorized:
          </p>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-cyan-400 font-bold">Calculated:</span>
              <span className="text-slate-300">Total kWh, base tariff bills, exact sums.</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-amber-400 font-bold">Detected by Rules:</span>
              <span className="text-slate-300">After-hours spikes, baseline variances.</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-purple-400 font-bold">AI Explanation:</span>
              <span className="text-slate-300">Natural language diagnosis and reasons.</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-emerald-400 font-bold">Projected Scenario:</span>
              <span className="text-slate-300">What-If simulation (never labeled as guaranteed).</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
