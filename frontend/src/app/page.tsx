'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { RecipientDashboard } from '@/components/RecipientDashboard';
import { EmployerHub } from '@/components/EmployerHub';
import { StealthPoolVisualizer } from '@/components/StealthPoolVisualizer';
import { ZkInspector } from '@/components/ZkInspector';
import { Sep24Modal } from '@/components/Sep24Modal';
import { WorkProofModal } from '@/components/WorkProofModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'recipient' | 'employer' | 'stealth' | 'inspector'>('recipient');
  const [isSep24Open, setIsSep24Open] = useState(false);
  const [isWorkProofOpen, setIsWorkProofOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSep24={() => setIsSep24Open(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 space-y-8">
        {activeTab === 'recipient' && (
          <RecipientDashboard
            onOpenSep24={() => setIsSep24Open(true)}
            onOpenWorkProof={() => setIsWorkProofOpen(true)}
          />
        )}

        {activeTab === 'employer' && <EmployerHub />}

        {activeTab === 'stealth' && <StealthPoolVisualizer />}

        {activeTab === 'inspector' && <ZkInspector />}
      </main>

      {/* Footer */}
      <footer className="w-full glass-card border-t border-slate-800/80 px-6 py-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Soroban WASM ZK Payroll Primitive • Built on Stellar</span>
          </div>

          <div className="flex items-center gap-6">
            <span>SEP-24 Anchor Off-Ramp</span>
            <span>Pedersen Commitments</span>
            <span>Nullifier Shield</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <Sep24Modal isOpen={isSep24Open} onClose={() => setIsSep24Open(false)} />
      <WorkProofModal isOpen={isWorkProofOpen} onClose={() => setIsWorkProofOpen(false)} />
    </div>
  );
}
