import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Soroban StreamGuard | Programmable ZK Streaming Payroll & Stealth Escrow',
  description:
    'Zero-Knowledge, Programmable Streaming Payroll & Milestone Escrow with Direct Stellar Anchor (SEP-24) Fiat Off-Ramping on Soroban.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0B0E14] text-slate-100">{children}</body>
    </html>
  );
}
