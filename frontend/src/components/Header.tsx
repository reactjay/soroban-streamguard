'use client';

import React from 'react';
import { Shield, Zap, Users, Activity, ExternalLink, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'recipient' | 'employer' | 'stealth' | 'inspector';
  setActiveTab: (tab: 'recipient' | 'employer' | 'stealth' | 'inspector') => void;
  onOpenSep24: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenSep24 }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-emerald-400 p-0.5 glow-purple">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">StreamGuard</span>
              <span className="text-[10px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Soroban ZK WASM
              </span>
            </div>
            <p className="text-xs text-slate-400">Programmable ZK Streaming Payroll & Stealth Escrow</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center glass-pill p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('recipient')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'recipient'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Streaming Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('employer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'employer'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Employer Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('stealth')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'stealth'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stealth Pools</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'inspector'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>ZK Inspector</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSep24}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Exit to Fiat (SEP-24)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
