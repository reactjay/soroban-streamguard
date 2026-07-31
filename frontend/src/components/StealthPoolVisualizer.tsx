'use client';

import React from 'react';
import { Users, Shield, Lock, EyeOff, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export const StealthPoolVisualizer: React.FC = () => {
  const commitments = [
    { hash: '0x8f3b2a9c1e4d7f1a0b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', status: 'UNCLAIMED', speed: '1.5x' },
    { hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', status: 'UNCLAIMED', speed: '1.0x' },
    { hash: '0x9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a8f3b2a9c1e4d7f1a0b2c3d4e5f6a7b8c', status: 'CLAIMED (Nullifier #1 Spent)', speed: '1.0x' },
    { hash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f', status: 'UNCLAIMED', speed: '1.2x' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Overview & Topology Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 glow-emerald">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Stealth Payroll Pool Topology</h2>
              <p className="text-xs text-slate-400">Multi-Recipient Anonymous Team Liquidity Architecture</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass-pill px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              Anonymity Set: <span className="text-emerald-400 font-bold">4 Recipients</span>
            </div>
            <div className="glass-pill px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
              Entropy Score: <span className="text-cyan-400 font-bold">2.00 bits</span>
            </div>
          </div>
        </div>

        {/* Visual Graph Diagram */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-950/90 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Employer Funding Source */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center mx-auto border border-purple-800">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Employer Vault</div>
              <div className="text-[11px] text-slate-400 font-mono">10,000.00 USDC Pool</div>
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
                <EyeOff className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">Anonymous Recipients</div>
              <div className="text-[11px] text-slate-400">Shielded Withdrawals via Relayer</div>
              <div className="text-[10px] text-emerald-400 font-mono">No Public Wallet Linkage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Commitment Vector Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-400" />
          <span>Stealth Commitment Vector State</span>
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {commitments.map((c, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-xs font-bold">#{idx + 1}</span>
                <span className="text-purple-300 font-mono truncate max-w-xs md:max-w-md">{c.hash}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-amber-400 text-[11px] font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-800">
                  Speed: {c.speed}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                    c.status.includes('CLAIMED')
                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
