'use client';

import React from 'react';
import { Users, Shield, Lock, EyeOff, Cpu, Layers, Flame, CheckCircle2 } from 'lucide-react';

interface StealthPoolVisualizerProps {
  isZkPrivate?: boolean;
}

export const StealthPoolVisualizer: React.FC<StealthPoolVisualizerProps> = ({ isZkPrivate = true }) => {
  const poolStats = {
    totalBalance: '$45,000.00 USDC',
    activeContributors: 6,
    shieldedRate: '0.00852 USDC/sec',
    entropyBits: '2.58 bits',
  };

  const anonymousContributors = [
    { id: 1, obfuscatedTag: '● ● ● ● ● (0x8f3b...7f1a)', role: 'Core Protocol Dev', speed: '1.5x Boost', active: true, balance: '$12,450 USDC' },
    { id: 2, obfuscatedTag: '● ● ● ● ● (0x1a2b...1a2b)', role: 'ZK Circuits Engineer', speed: '1.0x Base', active: true, balance: '$9,800 USDC' },
    { id: 3, obfuscatedTag: '● ● ● ● ● (0x9d0e...7b8c)', role: 'Frontend Architect', speed: '1.2x Boost', active: true, balance: '$11,250 USDC' },
    { id: 4, obfuscatedTag: '● ● ● ● ● (0x7e8f...6d7e)', role: 'Security Auditor', speed: '1.5x Boost', active: true, balance: '$7,500 USDC' },
    { id: 5, obfuscatedTag: '● ● ● ● ● (0x3c4d...9e0f)', role: 'DevOps & Relayer Engine', speed: '1.0x Base', active: true, balance: '$4,000 USDC' },
  ];

  return (
    <div className="space-y-8">
      {/* Anonymous Contributors Pool Highlights */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-purple-900/50 space-y-6 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-purple-950/90 border border-purple-700 glow-purple">
              <EyeOff className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Anonymous Contributors Pool</h2>
                <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Zero-Knowledge Stealth Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-Contributor Private Payroll • Unlinkable Identities & Pedersen Shielding
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="glass-pill px-4 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Total Pool Balance: </span>
              <span className="text-white font-bold font-mono">{poolStats.totalBalance}</span>
            </div>
            <div className="glass-pill px-4 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">Active Contributors: </span>
              <span className="text-emerald-400 font-bold font-mono">{poolStats.activeContributors} Shielded</span>
            </div>
          </div>
        </div>

        {/* Visual Anonymous Contributors Roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-2">
            <span>Obfuscated Identity Handle</span>
            <span>Role / Task Focus</span>
            <span>Speed Multiplier</span>
            <span>Shielded Pool Share</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {anonymousContributors.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-300 font-bold text-xs">
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-purple-200 flex items-center gap-2">
                      <span>{isZkPrivate ? c.obfuscatedTag : `Contributor #${c.id} (GBANK...STLR)`}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Unlinkable Pedersen Commitment
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-medium">
                  {c.role}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/70 border border-amber-800/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {c.speed}
                  </span>
                </div>

                <div className="font-mono text-xs text-slate-200 font-semibold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  {c.balance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pool Topology Architecture Diagram */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Soroban ZK Stealth Pool Architecture</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Anonymity Set: 6 Participants</span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Employer Vault */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center mx-auto border border-purple-800">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Employer Vault</div>
              <div className="text-[11px] text-slate-400 font-mono">45,000.00 USDC Pool</div>
              <div className="text-[10px] text-purple-400 font-mono">Public Address: GBANK...STLR</div>
            </div>

            {/* Encrypted ZK Pool Shield */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-900 to-emerald-950/40 border border-purple-700/50 text-center space-y-3 relative glow-purple">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800 animate-pulse-slow">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">Soroban ZK Stealth Engine</div>
                <div className="text-[11px] text-slate-300 mt-1">Pedersen Commitment Vector</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Nullifier Double-Claim Shield Active</div>
              </div>
            </div>

            {/* Shielded Destination Claim Paths */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">6 Shielded Contributors</div>
              <div className="text-[11px] text-slate-400">Shielded Withdrawals via Relayer</div>
              <div className="text-[10px] text-emerald-400 font-mono">No Public Wallet Linkage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
