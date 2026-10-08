import React, { useState, useEffect, useRef } from 'react';
import { Gauge, Radio, Zap, Activity, ShieldCheck, RefreshCw, Eye } from 'lucide-react';

interface EnergyMeter3DProps {
  currentKwh: number;
  efficiencyScore: number;
  cost: number;
  currencySymbol?: string;
}

export const EnergyMeter3D: React.FC<EnergyMeter3DProps> = ({
  currentKwh,
  efficiencyScore,
  cost,
  currencySymbol = '₹',
}) => {
  const [viewMode, setViewMode] = useState<'meter' | 'sphere'>('meter');
  const [pulseCount, setPulseCount] = useState<number>(0);
  const sphereCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Meter pulse simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount((c) => c + 1);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // 3D Rotating Canvas Energy Sphere
  useEffect(() => {
    if (viewMode !== 'sphere') return;
    const canvas = sphereCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const height = (canvas.height = 320);
    const cx = width / 2;
    const cy = height / 2;
    const radius = 95;

    // Generate 3D sphere points (Fibonacci sphere)
    const numPoints = 180;
    const points: { x: number; y: number; z: number; origX: number; origY: number; origZ: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        origX: x * radius,
        origY: y * radius,
        origZ: z * radius,
      });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angleX += 0.007;
      angleY += 0.01;

      // Draw subtle background aura
      const radial = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 1.3);
      radial.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      radial.addColorStop(0.6, 'rgba(16, 185, 129, 0.15)');
      radial.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Rotate points
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Sort points by Z for correct depth
      const projected = points.map((p) => {
        // Rotate around Y
        let x1 = p.origX * cosY - p.origZ * sinY;
        let z1 = p.origZ * cosY + p.origX * sinY;

        // Rotate around X
        let y2 = p.origY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.origY * sinX;

        // Perspective projection
        const fov = 350;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        return { px, py, scale, z: z2 };
      });

      projected.sort((a, b) => a.z - b.z);

      // Connect near points with faint lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i += 3) {
        for (let j = i + 1; j < projected.length; j += 6) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 32) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0.05, 0.25 - dist / 120)})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Render points
      projected.forEach((pt) => {
        const alpha = Math.max(0.15, (pt.z + radius) / (2 * radius));
        const size = Math.max(1.2, pt.scale * 2.2);

        ctx.beginPath();
        ctx.arc(pt.px, pt.py, size, 0, Math.PI * 2);
        // Higher efficiency shifts towards emerald, lower towards cyan/amber
        const hue = efficiencyScore >= 80 ? 155 : efficiencyScore >= 60 ? 185 : 45;
        ctx.fillStyle = `hsla(${hue}, 85%, 65%, ${alpha})`;
        ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
        ctx.shadowBlur = alpha > 0.6 ? 6 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Central core readout
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(`${efficiencyScore}/100`, cx, cy - 4);

      ctx.font = '400 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('EFFICIENCY CORE', cx, cy + 12);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [viewMode, efficiencyScore]);

  return (
    <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col justify-between">
      {/* Top Header & Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              IoT Telemetry Feed
            </h4>
            <span className="text-[10px] text-slate-400">Class 0.2S Precision Grade</span>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
          <button
            onClick={() => setViewMode('meter')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
              viewMode === 'meter'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Meter View
          </button>
          <button
            onClick={() => setViewMode('sphere')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
              viewMode === 'sphere'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Energy Core
          </button>
        </div>
      </div>

      {/* Content View 1: 3D-Styled Smart Meter */}
      {viewMode === 'meter' ? (
        <div className="relative py-2 flex flex-col items-center">
          {/* Metallic Industrial Bezel */}
          <div className="relative w-full max-w-[280px] rounded-2xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-4 border-2 border-slate-700/80 shadow-2xl ring-1 ring-cyan-500/20">
            {/* Screws on corners */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
              <div className="w-1 h-0.5 bg-slate-900 rotate-45" />
            </div>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
              <div className="w-1 h-0.5 bg-slate-900 -rotate-45" />
            </div>
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
              <div className="w-1 h-0.5 bg-slate-900 rotate-12" />
            </div>
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
              <div className="w-1 h-0.5 bg-slate-900 -rotate-30" />
            </div>

            {/* Smart Meter Branding */}
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] font-extrabold tracking-widest text-slate-300 font-mono">
                ENERGYIQ • MTR-415
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400 font-mono">PULSE</span>
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    pulseCount % 2 === 0
                      ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                      : 'bg-rose-950 opacity-40'
                  }`}
                />
              </div>
            </div>

            {/* LCD Digital Backlit Screen */}
            <div className="rounded-xl bg-slate-950 p-3.5 border border-cyan-900/60 shadow-inner relative overflow-hidden">
              {/* Backlight glow */}
              <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none" />

              <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-1">
                <span>TOTAL ACTIVE ENERGY</span>
                <span>kWh REGISTER</span>
              </div>

              {/* Rolling Digital Counter */}
              <div className="flex items-baseline justify-between font-mono bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                <div className="flex gap-1">
                  {currentKwh
                    .toFixed(1)
                    .padStart(6, '0')
                    .split('')
                    .map((char, i) => (
                      <span
                        key={i}
                        className={`inline-block px-1.5 py-0.5 rounded text-lg font-bold ${
                          char === '.'
                            ? 'text-cyan-400 px-0'
                            : i >= 4
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                            : 'bg-slate-950 text-emerald-400 border border-slate-800'
                        }`}
                      >
                        {char}
                      </span>
                    ))}
                </div>
                <span className="text-sm font-bold text-cyan-400 font-mono ml-2">kWh</span>
              </div>

              {/* Sub-parameters */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                <div className="bg-slate-900/70 p-1 rounded text-center">
                  <span className="text-slate-400 block text-[9px]">VOLTAGE</span>
                  <span className="text-cyan-300 font-semibold">415.2 V</span>
                </div>
                <div className="bg-slate-900/70 p-1 rounded text-center">
                  <span className="text-slate-400 block text-[9px]">PF RATIO</span>
                  <span className="text-emerald-400 font-semibold">0.96 LAG</span>
                </div>
                <div className="bg-slate-900/70 p-1 rounded text-center">
                  <span className="text-slate-400 block text-[9px]">FREQ</span>
                  <span className="text-amber-300 font-semibold">50.0 Hz</span>
                </div>
              </div>
            </div>

            {/* Bottom calibration status */}
            <div className="flex items-center justify-between mt-2.5 px-1 text-[9px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Tamper Verified
              </span>
              <span>1600 imp/kWh</span>
            </div>
          </div>
        </div>
      ) : (
        /* Content View 2: 3D Rotating Energy Sphere */
        <div className="relative h-[250px] flex items-center justify-center">
          <canvas ref={sphereCanvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Calculated Billing Cost:</span>
        </div>
        <span className="font-bold text-white text-sm">
          {currencySymbol}{cost.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
