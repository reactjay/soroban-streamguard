'use client';

import React from 'react';
import { PlayCircle, ShieldCheck, Flame, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export type ProtocolStage = 'created' | 'verified' | 'unlocked' | 'withdrawn';

interface SystemFlowStripProps {
  currentStage: ProtocolStage;
  onSelectStage?: (stage: ProtocolStage) => void;
}

export const SystemFlowStrip: React.FC<SystemFlowStripProps> = ({ currentStage, onSelectStage }) => {
  const stages: { id: ProtocolStage; label: string; sub: string; icon: React.ReactNode; stepNum: number }[] = [
    {
      id: 'created',
      label: 'Stream Created',
      sub: 'Soroban WASM Contract',
      icon: <PlayCircle className="w-4 h-4 text-purple-400" />,
      stepNum: 1,
    },
    {
      id: 'verified',
      label: 'Work Verified',
      sub: 'ZK Proof Attestation',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      stepNum: 2,
    },
    {
      id: 'unlocked',
      label: 'Funds Unlocked',
      sub: '1.5x Multiplier Boost',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      stepNum: 3,
    },
    {
      id: 'withdrawn',
      label: 'Withdrawn Privately',
      sub: 'SEP-24 Off-Ramp / Fiat',
      icon: <ArrowUpRight className="w-4 h-4 text-emerald-400" />,
      stepNum: 4,
    },
  ];

  const getStageIndex = (stage: ProtocolStage) => {
    switch (stage) {
      case 'created':
        return 0;
      case 'verified':
        return 1;
      case 'unlocked':
        return 2;
      case 'withdrawn':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getStageIndex(currentStage);

  return (
    <div className="w-full glass-card rounded-2xl p-4 md:p-5 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-xl">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-cyan-900/10 to-emerald-900/10 pointer-events-none" />

      <div className="relative flex flex-col space-y-3">
        {/* Header Label */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold uppercase tracking-wider text-slate-300">
              Protocol Lifecycle Flow
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
            Step {activeIndex + 1} of 4 • {stages[activeIndex].label} Active
          </span>
        </div>

        {/* Stages Strip Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
          {stages.map((stage, idx) => {
            const isPassed = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div
                key={stage.id}
                onClick={() => onSelectStage && onSelectStage(stage.id)}
                className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-purple-500 shadow-lg glow-purple scale-[1.02]'
                    : isPassed
                    ? 'bg-slate-900/80 border-emerald-800/60 text-slate-300'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:border-slate-700'
                }`}
              >
                {/* Connector Line for larger screens */}
                {idx < stages.length - 1 && (
                  <div
                    className={`hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-4 h-0.5 z-10 ${
                      idx < activeIndex ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  />
                )}

                {/* Step Indicator Icon */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold transition-transform ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md animate-pulse'
                      : isPassed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> : stage.stepNum}
                </div>

                {/* Text Labels */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-white' : isPassed ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping inline-block" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{stage.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
