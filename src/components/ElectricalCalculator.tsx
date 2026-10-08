import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Gauge,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const ElectricalCalculator: React.FC = () => {
  // Voltage drop state
  const [vdVoltage, setVdVoltage] = useState<number>(230);
  const [vdCurrent, setVdCurrent] = useState<number>(15);
  const [vdLength, setVdLength] = useState<number>(30); // meters
  const [vdWireGauge, setVdWireGauge] = useState<number>(2.5); // sq mm copper
  const [vdPhase, setVdPhase] = useState<'1' | '3'>('1');

  // Copper resistivity: ~0.0175 ohm * mm^2 / meter
  const copperResistivity = 0.0175;
  const wireResistance = (copperResistivity * vdLength) / vdWireGauge;
  // 1-phase has 2 conductors (go and return), 3-phase has sqrt(3) factor
  const totalResistance = vdPhase === '1' ? 2 * wireResistance : Math.sqrt(3) * wireResistance;
  const voltDrop = Number((vdCurrent * totalResistance).toFixed(2));
  const voltDropPercent = Number(((voltDrop / vdVoltage) * 100).toFixed(2));
  const endVoltage = Number((vdVoltage - voltDrop).toFixed(1));

  // Power Factor State
  const [pfActivePower, setPfActivePower] = useState<number>(10); // kW
  const [pfCurrent, setPfCurrent] = useState<number>(0.78); // current power factor
  const [pfTarget, setPfTarget] = useState<number>(0.98); // target power factor

  // Required capacitor kVAr: P * (tan(acos(PF1)) - tan(acos(PF2)))
  const angle1 = Math.acos(Math.min(1, Math.max(0.5, pfCurrent)));
  const angle2 = Math.acos(Math.min(1, Math.max(0.8, pfTarget)));
  const requiredKvar = Number(
    (pfActivePower * (Math.tan(angle1) - Math.tan(angle2))).toFixed(2)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Electrical Engineering Calculators & Safety Code</h2>
        </div>
        <p className="text-xs text-slate-400">
          Tools for calculating cable voltage drop, sizing power factor compensation, and NFPA 70E / IEC safety guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Voltage Drop Calculator */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Cable Voltage Drop Calculator
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Copper Conductors
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Supply System</label>
              <select
                value={vdPhase}
                onChange={(e) => {
                  setVdPhase(e.target.value as any);
                  if (e.target.value === '3') setVdVoltage(415);
                  else setVdVoltage(230);
                }}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
              >
                <option value="1">Single Phase (230V)</option>
                <option value="3">Three Phase (415V)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Load Current (Amperes)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={vdCurrent}
                onChange={(e) => setVdCurrent(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">One-Way Length (Meters)</label>
              <input
                type="number"
                min="1"
                step="1"
                value={vdLength}
                onChange={(e) => setVdLength(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Cable Size (sq. mm)</label>
              <select
                value={vdWireGauge}
                onChange={(e) => setVdWireGauge(parseFloat(e.target.value))}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              >
                <option value="1.5">1.5 sq.mm</option>
                <option value="2.5">2.5 sq.mm</option>
                <option value="4.0">4.0 sq.mm</option>
                <option value="6.0">6.0 sq.mm</option>
                <option value="10.0">10.0 sq.mm</option>
                <option value="16.0">16.0 sq.mm</option>
              </select>
            </div>
          </div>

          {/* Voltage Drop Result */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Voltage Drop:</span>
              <span className="text-white font-bold">{voltDrop} Volts</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Voltage Drop Percentage:</span>
              <span
                className={`font-bold ${
                  voltDropPercent > 5
                    ? 'text-rose-400'
                    : voltDropPercent > 3
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {voltDropPercent}%{' '}
                {voltDropPercent > 5 ? '(EXCESSIVE DROP!)' : voltDropPercent > 3 ? '(CAUTION)' : '(ACCEPTABLE)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Receiving End Voltage:</span>
              <span className="text-cyan-400 font-extrabold">{endVoltage} V</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            * Standard rule: Branch circuits should not exceed a 3% drop (max 5% including feeders) to prevent motor stall and premature equipment failure.
          </p>
        </div>

        {/* Tool 2: Power Factor kVAr Compensation */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Power Factor Capacitor Sizing
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Penalty Mitigation
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Active Load (kW)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={pfActivePower}
                onChange={(e) => setPfActivePower(parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Existing PF</label>
              <input
                type="number"
                min="0.5"
                max="0.99"
                step="0.01"
                value={pfCurrent}
                onChange={(e) => setPfCurrent(parseFloat(e.target.value) || 0.8)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Target PF</label>
              <input
                type="number"
                min="0.8"
                max="1.0"
                step="0.01"
                value={pfTarget}
                onChange={(e) => setPfTarget(parseFloat(e.target.value) || 0.98)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          {/* Result */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Required Capacitor Bank:</span>
              <span className="text-emerald-400 font-extrabold text-base">{requiredKvar} kVAr</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Current Apparent Power:</span>
              <span className="text-white">{(pfActivePower / pfCurrent).toFixed(1)} kVA</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Reduced Apparent Power:</span>
              <span className="text-cyan-400">{(pfActivePower / pfTarget).toFixed(1)} kVA</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            * Installing {requiredKvar} kVAr of capacitors reduces utility line losses, eliminates monthly low PF surcharges, and frees transformer capacity.
          </p>
        </div>
      </div>

      {/* Safety Code Reference */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          The 5 Cardinal Rules of Electrical Working Safety (NFPA 70E & Indian Electricity Rules)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {[
            { rule: '1. Disconnect', detail: 'Isolate completely and visibly disconnect all sources of power from the upstream breaker.' },
            { rule: '2. Lockout / Tagout', detail: 'Secure circuit breakers against re-connection using approved padlocks and warning tags.' },
            { rule: '3. Verify Dead', detail: 'Always verify the total absence of voltage across all conductors with a calibrated meter before touching.' },
            { rule: '4. Discharge & Earth', detail: 'Discharge large power capacitors and short-circuit conductors to earth where high-voltage induction exists.' },
            { rule: '5. Barrier & PPE', detail: 'Cover adjacent live parts with rubber blankets and wear 1000V dielectric gloves and eye protection.' },
          ].map((r, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="font-mono font-bold text-cyan-400 text-[11px] block mb-1">{r.rule}</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{r.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
