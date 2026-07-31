'use client';

import React, { useState } from 'react';
import { PlusCircle, Shield, Users, Clock, DollarSign, CheckCircle2, ChevronRight, Sparkles, Layers } from 'lucide-react';

export const EmployerHub: React.FC = () => {
  const [streamType, setStreamType] = useState<'stealth_pool' | 'single_stream'>('stealth_pool');
  const [assetToken, setAssetToken] = useState('USDC');
  const [baseRate, setBaseRate] = useState('0.002');
  const [durationHours, setDurationHours] = useState('720');
  const [initialDeposit, setInitialDeposit] = useState('5000');
  const [commitmentsText, setCommitmentsText] = useState(
    '0x8f3b2a9c1e4d7f1a0b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a\n0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  );

  const [activeStreams, setActiveStreams] = useState([
    {
      id: 1042,
      type: 'Stealth Pool (Anonymous Team)',
      employer: 'GBANK...STLR',
      token: 'USDC',
      rate: '0.00142 USDC/sec',
      deposited: '10,000.00 USDC',
      claimed: '1,420.50 USDC',
      recipientsCount: 4,
      anonymityScore: '96%',
      status: 'ACTIVE',
    },
    {
      id: 1041,
      type: 'Single Recipient (ZK Shielded)',
      employer: 'GBANK...STLR',
      token: 'EURC',
      rate: '0.00085 EURC/sec',
      deposited: '3,000.00 EURC',
      claimed: '850.00 EURC',
      recipientsCount: 1,
      anonymityScore: '92%',
      status: 'ACTIVE',
    },
  ]);

  const handleCreateStream = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = 1043 + Math.floor(Math.random() * 100);
    const count = commitmentsText.split('\n').filter((l) => l.trim().length > 0).length;

    const newStream = {
      id: newId,
      type: streamType === 'stealth_pool' ? 'Stealth Pool (Anonymous Team)' : 'Single Recipient (ZK Shielded)',
      employer: 'GBANK...STLR',
      token: assetToken,
      rate: `${baseRate} ${assetToken}/sec`,
      deposited: `${parseFloat(initialDeposit).toLocaleString()} ${assetToken}`,
      claimed: `0.00 ${assetToken}`,
      recipientsCount: count || 1,
      anonymityScore: count > 1 ? '98%' : '90%',
      status: 'ACTIVE',
    };

    setActiveStreams([newStream, ...activeStreams]);
    alert(`[Soroban WASM Event] Created Stream #${newId} on-chain successfully!`);
  };

  return (
    <div className="space-y-8">
      {/* Deploy New Stream Header & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creation Form */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800">
              <PlusCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Deploy Soroban ZK Streaming Payroll</h2>
              <p className="text-xs text-slate-400">Configure continuous per-second compensation or Stealth Pools</p>
            </div>
          </div>

          <form onSubmit={handleCreateStream} className="space-y-5">
            {/* Stream Type Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Payroll Architecture</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStreamType('stealth_pool')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    streamType === 'stealth_pool'
                      ? 'bg-purple-950/60 border-purple-600 ring-1 ring-purple-500/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Stealth Team Pool</div>
                    <div className="text-[11px] text-slate-400">Multi-recipient commitment vector. Salary distribution hidden.</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStreamType('single_stream')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    streamType === 'single_stream'
                      ? 'bg-purple-950/60 border-purple-600 ring-1 ring-purple-500/50'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Single ZK Stream</div>
                    <div className="text-[11px] text-slate-400">One-to-one private streaming payout backed by Pedersen hash.</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Token & Rates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Stellar Stablecoin Asset</label>
                <select
                  value={assetToken}
                  onChange={(e) => setAssetToken(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                >
                  <option value="USDC">USDC (Circle)</option>
                  <option value="EURC">EURC (Euro Circle)</option>
                  <option value="BRLA">BRLA (Brazilian Real)</option>
                  <option value="NGNC">NGNC (Nigerian Naira)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Base Rate ({assetToken}/sec)</label>
                <input
                  type="text"
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Initial Pool Deposit</label>
                <input
                  type="text"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            {/* Recipient ZK Commitments */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Recipient ZK Pedersen Commitment Vector (One per line)
                </label>
                <span className="text-[10px] text-purple-400 font-mono">Client CLI Generated</span>
              </div>
              <textarea
                rows={3}
                value={commitmentsText}
                onChange={(e) => setCommitmentsText(e.target.value)}
                placeholder="Paste 32-byte hex commitment hashes generated by streamguard-cli..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-purple-300 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Fund & Initialize Soroban WASM Stream</span>
            </button>
          </form>
        </div>

        {/* Live Pool Architecture Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Soroban Contract Execution Model</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Target Contract WASM:</span>
                <span className="text-emerald-400 font-mono font-semibold">stream-vault.wasm</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Gas Budget Optimization:</span>
                <span className="text-cyan-400 font-mono">1.2M CPU / 85K Mem</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Nullifier Storage Model:</span>
                <span className="text-purple-300 font-mono">Persistent DataKey</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Privacy Guarantee:</span>
                <span className="text-emerald-400 font-semibold">Zero Identity Linkage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Streams Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Active Streaming Payroll Contracts & Stealth Pools</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold font-sans">Stream ID</th>
                <th className="pb-3 font-semibold font-sans">Type</th>
                <th className="pb-3 font-semibold font-sans">Asset Rate</th>
                <th className="pb-3 font-semibold font-sans">Total Deposited</th>
                <th className="pb-3 font-semibold font-sans">Total Claimed</th>
                <th className="pb-3 font-semibold font-sans">Recipients</th>
                <th className="pb-3 font-semibold font-sans">Anonymity</th>
                <th className="pb-3 font-semibold font-sans">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {activeStreams.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40">
                  <td className="py-3 font-bold text-purple-400">#{s.id}</td>
                  <td className="py-3 font-sans text-white">{s.type}</td>
                  <td className="py-3 text-cyan-300">{s.rate}</td>
                  <td className="py-3 text-emerald-400">{s.deposited}</td>
                  <td className="py-3 text-slate-300">{s.claimed}</td>
                  <td className="py-3 text-slate-300">{s.recipientsCount} Commitment(s)</td>
                  <td className="py-3 text-purple-300 font-bold">{s.anonymityScore}</td>
                  <td className="py-3 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
