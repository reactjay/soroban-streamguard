'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Zap, ArrowUpRight, Lock, Clock, CheckCircle2, Flame, RefreshCw } from 'lucide-react';

interface RecipientDashboardProps {
  onOpenSep24: () => void;
  onOpenWorkProof: () => void;
}

export const RecipientDashboard: React.FC<RecipientDashboardProps> = ({ onOpenSep24, onOpenWorkProof }) => {
  const [isZkPrivate, setIsZkPrivate] = useState(true);
  const [baseRate] = useState(0.00142); // USDC per second (~$5,112/mo)
  const [rateMultiplier, setRateMultiplier] = useState(1.0); // 1.0x to 1.5x after work proof
  const [earnedBalance, setEarnedBalance] = useState(142.50291);
  const [claimedBalance, setClaimedBalance] = useState(40.0);
  const [isAccelerated, setIsAccelerated] = useState(false);

  // Ticking real-time per-second counter (every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setEarnedBalance((prev) => prev + (baseRate * rateMultiplier) / 10);
    }, 100);
    return () => clearInterval(interval);
  }, [baseRate, rateMultiplier]);

  const currentAvailable = earnedBalance - claimedBalance;

  return (
    <div className="space-y-6">
      {/* Top Banner & ZK Privacy Toggle */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isZkPrivate ? 'bg-purple-950/80 border border-purple-700/50 glow-purple' : 'bg-slate-800 border border-slate-700'}`}>
            {isZkPrivate ? <ShieldCheck className="w-8 h-8 text-purple-400" /> : <Shield className="w-8 h-8 text-slate-400" />}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Shielded Streaming Compensation</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                isZkPrivate ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {isZkPrivate ? 'ZK Shield Active (Zero Linkage)' : 'Public View'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isZkPrivate
                ? 'Your salary stream is encrypted using Pedersen Commitments. On-chain observers cannot see your wallet address or rate.'
                : 'Public mode enabled. On-chain addresses are visible.'}
            </p>
          </div>
        </div>

        {/* ZK Toggle Switch */}
        <div className="flex items-center gap-3 glass-pill px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-300 font-medium">ZK Privacy Mode</span>
          <button
            onClick={() => setIsZkPrivate(!isZkPrivate)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              isZkPrivate ? 'bg-purple-600' : 'bg-slate-700'
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

      {/* Main Ticking Stream Counter Card */}
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
              <div className="text-xs text-slate-400 font-medium mb-1">Available Unlocked Balance</div>
              <div className="text-4xl md:text-6xl font-black tracking-tight text-white font-mono flex items-baseline gap-3">
                {isZkPrivate ? (
                  <span>
                    {currentAvailable.toFixed(6)} <span className="text-2xl text-purple-400">USDC</span>
                  </span>
                ) : (
                  <span>
                    {currentAvailable.toFixed(6)} <span className="text-2xl text-purple-400">USDC</span>
                  </span>
                )}
              </div>
            </div>

            {/* Stream Rates & Multipliers */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="glass-pill px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                Streaming Rate: <span className="text-white font-semibold font-mono">{(baseRate * rateMultiplier).toFixed(6)} USDC/sec</span>
              </div>
              <div className="glass-pill px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Flame className={`w-3.5 h-3.5 ${rateMultiplier > 1 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                Multiplier: <span className="text-amber-400 font-bold">{rateMultiplier.toFixed(1)}x Speed Boost</span>
              </div>
              <div className="glass-pill px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                Total Earned: <span className="text-white font-semibold font-mono">{earnedBalance.toFixed(4)} USDC</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-3.5">
            <button
              onClick={onOpenSep24}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <ArrowUpRight className="w-5 h-5" />
              <span>Withdraw to Bank (SEP-24 Anchor)</span>
            </button>

            <button
              onClick={onOpenWorkProof}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>Submit Work Proof (1.5x Speed Boost)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stream Details & Milestone Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Stream Commitment Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
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
              <span className="text-purple-300 truncate max-w-[200px]">0x8f3b2a9c1e4d...7f1a</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Nullifier Status:</span>
              <span className="text-emerald-400 font-sans font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Unspent (Ready to Claim)
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
            <span className="text-xs text-amber-400 font-medium">1 / 2 Unlocked</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-800/50 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Milestone 1: Core Protocol Contract</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Git Commit Verified • +50.00 USDC Bonus</div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                1.5x Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Milestone 2: Security Audit Attestation</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Oracle Proof Pending • +100.00 USDC Bonus</div>
              </div>
              <button
                onClick={onOpenWorkProof}
                className="text-xs font-semibold text-purple-300 bg-purple-950/80 hover:bg-purple-900 px-2.5 py-1 rounded-lg border border-purple-700 transition-colors"
              >
                Submit Proof
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
