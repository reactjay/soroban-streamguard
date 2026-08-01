'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Zap, ArrowUpRight, Lock, Clock, CheckCircle2, Flame, EyeOff, Users, Sparkles } from 'lucide-react';
import { SystemFlowStrip, ProtocolStage } from './SystemFlowStrip';

interface RecipientDashboardProps {
  onOpenSep24: () => void;
  onOpenWorkProof: () => void;
  currentStage: ProtocolStage;
  setProtocolStage: (stage: ProtocolStage) => void;
  rateMultiplier: number;
}

export const RecipientDashboard: React.FC<RecipientDashboardProps> = ({
  onOpenSep24,
  onOpenWorkProof,
  currentStage,
  setProtocolStage,
  rateMultiplier,
}) => {
  const [isZkPrivate, setIsZkPrivate] = useState(true);
  const [baseRate] = useState(0.00142); // USDC per second (~$5,112/mo)
  const [earnedBalance, setEarnedBalance] = useState(142.50291);
  const [claimedBalance, setClaimedBalance] = useState(40.0);
  const [showRewardFlash, setShowRewardFlash] = useState(false);

  // Ticking real-time per-second counter (every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setEarnedBalance((prev) => prev + (baseRate * rateMultiplier) / 10);
    }, 100);
    return () => clearInterval(interval);
  }, [baseRate, rateMultiplier]);

  // Flash reward animation when rateMultiplier increases above 1.0x
  useEffect(() => {
    if (rateMultiplier > 1.0) {
      setShowRewardFlash(true);
      const timer = setTimeout(() => setShowRewardFlash(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [rateMultiplier]);

  const currentAvailable = earnedBalance - claimedBalance;

  return (
    <div className="space-y-6">
      {/* 1. SYSTEM FLOW STRIP (TOP PRIORITY) */}
      <SystemFlowStrip currentStage={currentStage} onSelectStage={(stage) => setProtocolStage(stage)} />

      {/* Reward Flash Banner when Work Proof Boost occurs */}
      {showRewardFlash && (
        <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-900/90 via-purple-900/90 to-cyan-900/90 border border-emerald-500 shadow-xl glow-emerald flex items-center justify-between animate-reward-flash">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-600">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Proof Verified • Stream Speed Boost Activated!</span>
                <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md font-extrabold">
                  {rateMultiplier.toFixed(1)}x ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-200">
                Soroban WASM engine streaming rate boosted to {(baseRate * rateMultiplier).toFixed(6)} USDC/sec
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. ZK PRIVACY MODE EXPERIENCE BANNER */}
      <div
        className={`glass-card rounded-2xl p-6 border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 ${
          isZkPrivate
            ? 'border-purple-800/80 bg-purple-950/20 glow-zk-active shimmer-zk'
            : 'border-slate-800 bg-slate-900/40'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-3.5 rounded-2xl transition-all ${
              isZkPrivate
                ? 'bg-purple-950 border border-purple-600 glow-purple text-purple-300'
                : 'bg-slate-800 border border-slate-700 text-slate-400'
            }`}
          >
            {isZkPrivate ? <ShieldCheck className="w-8 h-8 text-purple-400 animate-pulse" /> : <Shield className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">
                {isZkPrivate ? 'Shielded Stream Active' : 'Public Ledger View'}
              </h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  isZkPrivate
                    ? 'bg-purple-950 text-purple-300 border-purple-700'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {isZkPrivate ? 'Pedersen Commitment Vector' : 'Public Identity Unshielded'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isZkPrivate ? (
                <span className="text-purple-300/90 font-medium">
                  Unlinkable Identity Active • On-chain balances and wallet addresses obfuscated with zero-knowledge nullifier shields.
                </span>
              ) : (
                <span>Public mode enabled. Wallet address and stream rate are visible on the ledger.</span>
              )}
            </p>
          </div>
        </div>

        {/* ZK Toggle Switch */}
        <div className="flex items-center gap-3 glass-pill px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-200">ZK Privacy Mode</span>
          <button
            onClick={() => setIsZkPrivate(!isZkPrivate)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              isZkPrivate ? 'bg-purple-600 shadow-md' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isZkPrivate ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. MAIN TICKING STREAM COUNTER CARD */}
      <div className="glass-card rounded-3xl p-8 border border-purple-900/40 relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Real-time streaming display */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Live Streaming Payout (Per-Second WASM Engine)
              </span>
            </div>

            <div>
              {/* MICROCOPY IMPROVEMENT: "Live Unlocked Stream" */}
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-2">
                <span>Live Unlocked Stream</span>
                {isZkPrivate && (
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800 font-mono">
                    Shielded Stream Value
                  </span>
                )}
              </div>

              <div className="text-4xl md:text-6xl font-black tracking-tight text-white font-mono flex items-baseline gap-3">
                <span className={isZkPrivate ? 'relative' : ''}>
                  {currentAvailable.toFixed(6)} <span className="text-2xl text-purple-400">USDC</span>
                </span>
              </div>
            </div>

            {/* Stream Rates & Multipliers */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="glass-pill px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                Real-Time Stream Velocity:{' '}
                {isZkPrivate ? (
                  <span className="text-purple-300 font-semibold font-mono">
                    {(baseRate * rateMultiplier).toFixed(6)} USDC/sec (Shielded)
                  </span>
                ) : (
                  <span className="text-white font-semibold font-mono">
                    {(baseRate * rateMultiplier).toFixed(6)} USDC/sec
                  </span>
                )}
              </div>

              <div
                className={`glass-pill px-3 py-1.5 rounded-lg border text-slate-300 flex items-center gap-1.5 transition-all ${
                  rateMultiplier > 1.0 ? 'border-amber-500/80 bg-amber-950/40 glow-purple' : 'border-slate-800'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${rateMultiplier > 1 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                Multiplier:{' '}
                <span className="text-amber-400 font-bold">
                  {rateMultiplier.toFixed(1)}x Speed Boost
                </span>
              </div>

              <div className="glass-pill px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                Cumulative Streamed Value:{' '}
                <span className="text-white font-semibold font-mono">{earnedBalance.toFixed(4)} USDC</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (WITH REFRACTORED MICROCOPY) */}
          <div className="flex flex-col gap-3.5">
            {/* MICROCOPY IMPROVEMENT: "Exit to Fiat (Private)" */}
            <button
              onClick={onOpenSep24}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>Exit to Fiat (Private)</span>
            </button>

            {/* MICROCOPY IMPROVEMENT: "Verify Work → Unlock Value" */}
            <button
              onClick={onOpenWorkProof}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>Verify Work → Unlock Value</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. STEALTH PAYROLL POOL PREVIEW CARD */}
      <div className="glass-card rounded-2xl p-6 border border-purple-900/50 space-y-4 bg-gradient-to-r from-slate-950 via-purple-950/10 to-slate-950">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Anonymous Contributors Pool</h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
              Team Anonymity Set
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Total Pool Balance: $45,000.00 USDC</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">Obfuscated Participants</div>
            <div className="text-purple-300 font-mono font-bold flex items-center gap-2">
              {isZkPrivate ? (
                <span className="text-base tracking-widest text-emerald-400">● ● ● ● ●</span>
              ) : (
                <span>GBANK...STLR (Visible)</span>
              )}
            </div>
            <div className="text-[10px] text-slate-500">5 Shielded Team Members</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">Active Contributors Count</div>
            <div className="text-white font-bold font-mono text-base flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>4 Contributors Streaming</span>
            </div>
            <div className="text-[10px] text-slate-500">Unlinkable Pedersen Vectors</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">Identity Security State</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span>Zero-Linkage Guaranteed</span>
            </div>
            <div className="text-[10px] text-slate-500">Nullifier Double-Claim Proof</div>
          </div>
        </div>
      </div>

      {/* Stream Details & Milestone Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Stream Commitment Card */}
        <div
          className={`glass-card rounded-2xl p-6 border transition-all ${
            isZkPrivate ? 'border-purple-800/60 bg-purple-950/10' : 'border-slate-800'
          } space-y-4`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Soroban ZK Commitment Details</span>
            </h3>
            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-mono">
              Stream #1042
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Recipient Commitment Hash:</span>
              {isZkPrivate ? (
                <span className="text-purple-300 font-bold blur-obfuscate">0x8f3b2a9c1e4d...7f1a</span>
              ) : (
                <span className="text-purple-300">0x8f3b2a9c1e4d7f1a0b2c3d4e</span>
              )}
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Identity Mode:</span>
              <span className="text-purple-300 font-sans font-semibold">
                {isZkPrivate ? 'Unlinkable Identity (Pedersen)' : 'Public Key Visible'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Nullifier Status:</span>
              <span className="text-emerald-400 font-sans font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Unspent (Ready to Exit)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Privacy Relayer Mode:</span>
              <span className="text-cyan-400 font-sans font-semibold">Gasless Stealth Claims</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Soroban Smart Contract:</span>
              <span className="text-slate-300 truncate max-w-[200px]">CSTREAMVAULT...STLR</span>
            </div>
          </div>
        </div>

        {/* Milestone Work Proof Unlocks */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Milestone Acceleration & Unlocks</span>
            </h3>
            <span className="text-xs text-amber-400 font-medium">
              {rateMultiplier > 1.0 ? '2 / 2 Unlocked' : '1 / 2 Unlocked'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-800/50 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Milestone 1: Core Protocol Contract</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Git Commit Verified • Base Stream Velocity</div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                Verified
              </span>
            </div>

            <div
              className={`p-3 rounded-xl transition-all flex items-center justify-between ${
                rateMultiplier > 1.0
                  ? 'bg-purple-950/80 border border-purple-600 glow-purple'
                  : 'bg-slate-900/50 border border-slate-800'
              }`}
            >
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  {rateMultiplier > 1.0 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                  <span>Milestone 2: Security Audit & ZK Work Proof</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {rateMultiplier > 1.0
                    ? 'Cryptographic Proof Verified • 1.5x Boost Active'
                    : 'Oracle Proof Pending • 1.5x Speed Boost Unlock'}
                </div>
              </div>
              {rateMultiplier > 1.0 ? (
                <span className="text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-700 px-3 py-1 rounded-lg">
                  1.5x Active
                </span>
              ) : (
                <button
                  onClick={onOpenWorkProof}
                  className="text-xs font-semibold text-purple-300 bg-purple-950/80 hover:bg-purple-900 px-3 py-1 rounded-lg border border-purple-700 transition-colors"
                >
                  Verify Work
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
