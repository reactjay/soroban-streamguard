'use client';

import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';

interface Sep24ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sep24Modal: React.FC<Sep24ModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'input' | 'interactive_anchor' | 'completed'>('input');
  const [assetCode, setAssetCode] = useState<'USDC' | 'EURC' | 'BRLA' | 'NGNC'>('USDC');
  const [amount, setAmount] = useState('100.00');
  const [destinationCurrency, setDestinationCurrency] = useState('USD');
  const [bankAccount, setBankAccount] = useState('US893700019283740129');
  const [txDetails, setTxDetails] = useState<any>(null);

  if (!isOpen) return null;

  const handleStartOfframp = (e: React.FormEvent) => {
    e.preventDefault();
    const rateMap: Record<string, number> = { USD: 1.0, EUR: 0.92, BRL: 5.50, NGN: 1500.0 };
    const rate = rateMap[destinationCurrency] || 1.0;
    const estFiat = (parseFloat(amount) * rate * 0.995).toFixed(2);

    setTxDetails({
      txId: 'sep24-tx-' + Math.random().toString(36).substring(2, 9),
      assetCode,
      amount,
      destinationCurrency,
      estFiat: `${estFiat} ${destinationCurrency}`,
      anchorAddress: 'GANKCHOR...STELLAR...POUT',
      memo: Math.floor(100000 + Math.random() * 900000).toString(),
    });

    setStep('interactive_anchor');
  };

  const handleConfirmAnchorTransfer = () => {
    setStep('completed');
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
          <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-800 glow-emerald">
            <Landmark className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Stellar SEP-24 Anchor Off-Ramp</h2>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                Direct Fiat
              </span>
            </div>
            <p className="text-xs text-slate-400">Withdraw streaming USDC/EURC into local bank account</p>
          </div>
        </div>

        {step === 'input' && (
          <form onSubmit={handleStartOfframp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Source Stablecoin</label>
                <select
                  value={assetCode}
                  onChange={(e: any) => setAssetCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="USDC">USDC (Circle)</option>
                  <option value="EURC">EURC (Circle)</option>
                  <option value="BRLA">BRLA (BRL)</option>
                  <option value="NGNC">NGNC (NGN)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Payout Currency</label>
                <select
                  value={destinationCurrency}
                  onChange={(e) => setDestinationCurrency(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="USD">USD (Bank ACH/Wire)</option>
                  <option value="EUR">EUR (SEPA Transfer)</option>
                  <option value="BRL">BRL (Pix Instant)</option>
                  <option value="NGN">NGN (Local Bank)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Amount to Off-Ramp</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Bank IBAN / Routing Number / Pix</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch SEP-24 Interactive Anchor Webview</span>
            </button>
          </form>
        )}

        {step === 'interactive_anchor' && txDetails && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-800/60 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Anchor Transaction ID:</span>
                <span className="text-emerald-400 font-mono font-bold">{txDetails.txId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Estimated Fiat Payout:</span>
                <span className="text-white font-mono font-bold text-sm">{txDetails.estFiat}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Anchor Stellar Address:</span>
                <span className="text-purple-300 font-mono">{txDetails.anchorAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Anchor Deposit Memo:</span>
                <span className="text-amber-400 font-mono font-bold">{txDetails.memo}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800 text-[11px] text-purple-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Shielded Relayer Mode: Your on-chain identity remains hidden during anchor transfer.</span>
            </div>

            <button
              onClick={handleConfirmAnchorTransfer}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulate Anchor Off-Ramp Settlement</span>
            </button>
          </div>
        )}

        {step === 'completed' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Fiat Off-Ramp Completed!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your streamed balance was converted and sent directly to your local bank account.
              </p>
            </div>

            <button
              onClick={() => {
                setStep('input');
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
