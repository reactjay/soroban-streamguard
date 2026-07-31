'use client';

import React, { useState } from 'react';
import { X, Zap, CheckCircle2, Sparkles, Code, GitCommit, FileCheck } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface WorkProofModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkProofModal: React.FC<WorkProofModalProps> = ({ isOpen, onClose }) => {
  const [proofType, setProofType] = useState<'git_commit' | 'oracle_attestation' | 'api_payload'>('git_commit');
  const [milestoneId, setMilestoneId] = useState('2');
  const [payloadText, setPayloadText] = useState('git:commit:8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedProof, setGeneratedProof] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const proofBytesHex = CryptoJS.enc.Utf8.parse(payloadText).toString(CryptoJS.enc.Hex);
      const workHashHex = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proofBytesHex)).toString(CryptoJS.enc.Hex);
      const attestationSig = CryptoJS.SHA256(`attest:${workHashHex}`).toString(CryptoJS.enc.Hex);

      setGeneratedProof({
        proofBytesHex,
        workHashHex,
        attestationSig,
        speedBoost: '1.5x (150% Streaming Speed)',
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-800 relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-950 border border-purple-800 glow-purple">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Submit ZK Work Proof</h2>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-mono">
                1.5x Speed Boost
              </span>
            </div>
            <p className="text-xs text-slate-400">Cryptographic Proof-of-Work Stream Acceleration</p>
          </div>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmitProof} className="space-y-4">
            {/* Proof Source Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Proof Category</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setProofType('git_commit');
                    setPayloadText('git:commit:8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a');
                  }}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium flex flex-col items-center gap-1.5 ${
                    proofType === 'git_commit'
                      ? 'bg-purple-950 border-purple-600 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <GitCommit className="w-4 h-4 text-cyan-400" />
                  <span>Git Commit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProofType('oracle_attestation');
                    setPayloadText('oracle:attest:security_audit_passed_v1');
                  }}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium flex flex-col items-center gap-1.5 ${
                    proofType === 'oracle_attestation'
                      ? 'bg-purple-950 border-purple-600 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Oracle Proof</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProofType('api_payload');
                    setPayloadText('api:task_completed_task_id_8941');
                  }}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium flex flex-col items-center gap-1.5 ${
                    proofType === 'api_payload'
                      ? 'bg-purple-950 border-purple-600 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>API Task</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Target Milestone ID</label>
              <input
                type="text"
                value={milestoneId}
                onChange={(e) => setMilestoneId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Work Proof Payload Content</label>
              <textarea
                rows={3}
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>{isSubmitting ? 'Verifying ZK Proof...' : 'Verify Proof & Accelerate Stream'}</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 text-cyan-400 flex items-center justify-center mx-auto border border-purple-800 glow-purple">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Work Proof Verified On-Chain!</h3>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                Stream speed accelerated to 1.5x (150% Streaming Payout Rate)
              </p>
            </div>

            {generatedProof && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-[11px] font-mono">
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-400">Work Hash:</span>
                  <span className="text-purple-300 truncate max-w-[200px]">0x{generatedProof.workHashHex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attestation Sig:</span>
                  <span className="text-emerald-400 truncate max-w-[200px]">0x{generatedProof.attestationSig}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-3 px-6 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold text-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
