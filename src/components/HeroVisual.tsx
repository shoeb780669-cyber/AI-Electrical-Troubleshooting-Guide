import React, { useState, useEffect, useRef } from 'react';
import { Zap, Cpu, Activity, AlertTriangle, Lightbulb, TrendingDown, Layers, Play, Pause } from 'lucide-react';

interface HeroVisualProps {
  onExploreClick?: () => void;
  onLaunchClick?: () => void;
}

interface PipelineStep {
  id: string;
  label: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgGradient: string;
  metric: string;
  detail: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'electricity',
    label: 'Electricity',
    sub: 'Grid Supply & Inflow',
    icon: Zap,
    color: '#38bdf8',
    borderColor: 'border-sky-500/40',
    bgGradient: 'from-sky-950/60 to-slate-900/80',
    metric: '415V 3-Phase',
    detail: 'Continuous power feed from utility substation entering facility master breaker.',
  },
  {
    id: 'meter',
    label: 'Smart Meter',
    sub: 'IoT Sub-Metering',
    icon: Activity,
    color: '#06b6d4',
    borderColor: 'border-cyan-500/40',
    bgGradient: 'from-cyan-950/60 to-slate-900/80',
    metric: '15-min Intervals',
    detail: 'Digital energy logging capturing voltage, active power, and category loads.',
  },
  {
    id: 'data',
    label: 'Energy Data',
    sub: 'Time-Series Raw Stream',
    icon: Layers,
    color: '#6366f1',
    borderColor: 'border-indigo-500/40',
    bgGradient: 'from-indigo-950/60 to-slate-900/80',
    metric: '1,248+ kWh Raw',
    detail: 'Aggregated time-stamped records mapped with occupancy and operational shift calendars.',
  },
  {
    id: 'ai',
    label: 'AI Analysis',
    sub: 'Machine Analytics Engine',
    icon: Cpu,
    color: '#a855f7',
    borderColor: 'border-purple-500/40',
    bgGradient: 'from-purple-950/60 to-slate-900/80',
    metric: 'Statistical Models',
    detail: 'Algorithmic baseline modeling, time-of-use tariff profiling, and load disaggregation.',
  },
  {
    id: 'wastage',
    label: 'Wastage Detection',
    sub: 'Anomaly Identification',
    icon: AlertTriangle,
    color: '#f59e0b',
    borderColor: 'border-amber-500/40',
    bgGradient: 'from-amber-950/60 to-slate-900/80',
    metric: '186 kWh Flagged',
    detail: 'Detects after-hours phantom loads, unmonitored HVAC cycling, and standby idle waste.',
  },
  {
    id: 'insights',
    label: 'Business Insights',
    sub: 'Decision Intelligence',
    icon: Lightbulb,
    color: '#10b981',
    borderColor: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/60 to-slate-900/80',
    metric: 'Score: 82 / 100',
    detail: 'Converts technical kW spikes into actionable financial metrics and operational priorities.',
  },
  {
    id: 'savings',
    label: 'Cost Savings',
    sub: 'Bottom-Line Recovery',
    icon: TrendingDown,
    color: '#22c55e',
    borderColor: 'border-green-500/40',
    bgGradient: 'from-green-950/60 to-slate-900/80',
    metric: '₹1,420+ Monthly',
    detail: 'Realized operational expense reduction, lower peak surcharges, and ESG carbon reduction.',
  },
];

export const HeroVisual: React.FC<HeroVisualProps> = ({ onLaunchClick, onExploreClick }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-advance pipeline flow
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas particle stream simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 280;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    interface Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;
      hue: number;
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: (height / 2) + (Math.random() - 0.5) * 45,
      speed: 1.2 + Math.random() * 2.2,
      size: 1.5 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.7,
      hue: 180 + Math.random() * 60,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Central glowing energy pipeline bus
      const gradient = ctx.createLinearGradient(0, height / 2, width, height / 2);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.25)');
      gradient.addColorStop(0.8, 'rgba(245, 158, 11, 0.25)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0.35)');

      ctx.beginPath();
      ctx.moveTo(30, height / 2);
      ctx.lineTo(width - 30, height / 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = gradient;
      ctx.stroke();

      // Flowing particles
      particles.forEach((p) => {
        p.x += p.speed;
        if (p.x > width - 20) {
          p.x = 20;
          p.y = (height / 2) + (Math.random() - 0.5) * 35;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
        ctx.shadowColor = `hsl(${p.hue}, 90%, 60%)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const currentStep = PIPELINE_STEPS[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border border-slate-800/80 p-5 md:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Background glow flares */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls & status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
              Live Architecture Pipeline
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              Data → AI → Value
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mt-1">
            End-to-End Energy Intelligence Flow
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause Flow</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resume Flow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas background animation */}
      <div className="relative w-full h-28 md:h-32 mb-6 hidden sm:block">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Pipeline Nodes Strip */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 md:gap-3 mb-6">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;

          return (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(idx);
                setIsPlaying(false);
              }}
              className={`relative flex flex-col items-center text-center p-3 rounded-xl transition-all duration-300 border text-left cursor-pointer group ${
                isActive
                  ? `${step.borderColor} bg-slate-800/90 shadow-lg scale-[1.03] ring-1 ring-cyan-500/50`
                  : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Connector pulse dot */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: isActive ? `${step.color}25` : 'rgba(30, 41, 59, 0.7)',
                  color: isActive ? step.color : '#94a3b8',
                  boxShadow: isActive ? `0 0 16px ${step.color}40` : 'none',
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span className="text-xs font-bold text-white mb-0.5 line-clamp-1">
                {step.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mb-2 line-clamp-1">
                {step.sub}
              </span>

              <div
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium mt-auto w-full text-center ${
                  isActive
                    ? 'bg-slate-950 text-white border border-slate-700'
                    : 'bg-slate-950/50 text-slate-400'
                }`}
              >
                {step.metric}
              </div>

              {isActive && (
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full"
                  style={{ backgroundColor: step.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active step spotlight inspection card */}
      <div
        className={`relative z-10 p-5 rounded-xl border bg-gradient-to-r ${currentStep.bgGradient} ${currentStep.borderColor} transition-all duration-300 shadow-xl`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{
                backgroundColor: `${currentStep.color}30`,
                color: currentStep.color,
                border: `1px solid ${currentStep.color}60`,
              }}
            >
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-700/80">
                  Step {activeStep + 1} of {PIPELINE_STEPS.length}
                </span>
                <span className="text-sm font-bold text-white">{currentStep.label}</span>
                <span className="text-xs text-slate-400">• {currentStep.sub}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">
                {currentStep.detail}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-mono">Stage Value Output</span>
              <span className="text-base font-extrabold text-white font-mono" style={{ color: currentStep.color }}>
                {currentStep.metric}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
