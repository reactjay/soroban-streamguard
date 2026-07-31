'use client';

import React, { useState } from 'react';
import { Activity, ShieldCheck, Cpu, Terminal, CheckCircle2, RefreshCw, Zap } from 'lucide-react';

export const ZkInspector: React.FC = () => {
  const [relayerLogs] = useState([
    {
      id: 'job-98a1',
      time: '18:44:12',
      streamId: 1042,
      commitment: '0x8f3b2a9c...7f1a',
      nullifier: '0x9d0e1f2a...8b8c',
      amount: '50.00 USDC',
      status: 'CONFIRMED ON SOROBAN',
      txHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    },
    {
      id: 'job-98a0',
      time: '18:32:05',
      streamId: 1041,
      commitment: '0x1a2b3c4d...0f1a',
      nullifier: '0x7e8f9a0b...7e8f',
      amount: '120.00 EURC',
      status: 'CONFIRMED ON SOROBAN',
      txHash: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-800 glow-amber">
            <Activity className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Soroban ZK WASM & Relayer Inspector</h2>
            <p className="text-xs text-slate-400">Real-Time Verification Engine & Nullifier Spent State</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-emerald-400">Relayer Node Active</span>
        </div>
      </div>

      {/* ZK Formula & Gas Metering Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ZK Proof Formula Card */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Pedersen Commitment & Range Verification</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-950 space-y-3 text-xs font-mono">
            <div className="text-slate-300">
              <span className="text-purple-400 font-bold">Commitment Formula:</span>
              <div className="mt-1 p-2 bg-slate-900 rounded-lg text-emerald-300">
                C = SHA256( Salt || NullifierSeed )
              </div>
            </div>

            <div className="text-slate-300">
              <span className="text-purple-400 font-bold">Work Proof Verification:</span>
              <div className="mt-1 p-2 bg-slate-900 rounded-lg text-cyan-300">
                Verify SHA256( ProofBytes ) == WorkHash
              </div>
            </div>

            <div className="text-slate-300">
              <span className="text-purple-400 font-bold">Soroban Fuel Constraint:</span>
              <div className="mt-1 p-2 bg-slate-900 rounded-lg text-amber-300">
                Optimized WASM Execution &lt; 2.5M CPU Cycles
              </div>
            </div>
          </div>
        </div>

        {/* Gas & Resource Metering */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Soroban WASM Resource Metrics</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>CPU Gas Utilization:</span>
                <span className="font-mono text-cyan-400 font-bold">1,240,580 / 40,000,000</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[15%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Memory Bytes Allocated:</span>
                <span className="font-mono text-emerald-400 font-bold">84.2 KB / 2,000.0 KB</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[8%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Nullifier Storage Footprint:</span>
                <span className="font-mono text-purple-400 font-bold">2 Keys (64 Bytes)</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[5%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Relayer Execution Stream */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Privacy Relayer Execution Stream</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Gasless Relayer Node: GRELAYER...STLR</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {relayerLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className="text-purple-400 font-bold">Stream #{log.streamId}</span>
                  <span className="text-emerald-400 font-bold">{log.amount}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-sans font-bold">
                  {log.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-400 border-t border-slate-900 pt-2">
                <div>Commitment: <span className="text-purple-300">{log.commitment}</span></div>
                <div>Nullifier: <span className="text-amber-300">{log.nullifier}</span></div>
                <div className="truncate">TxHash: <span className="text-slate-300">{log.txHash}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
