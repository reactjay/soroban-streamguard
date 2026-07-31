# Protocol Development Roadmap — Soroban StreamGuard 🗺️

This document outlines the multi-phase development, security auditing, and ecosystem integration roadmap for **Soroban StreamGuard**.

---

## 🎯 Strategic Milestones Overview

```
+-------------------+      +-------------------+      +-------------------+      +-------------------+
|     PHASE 1       | ---> |     PHASE 2       | ---> |     PHASE 3       | ---> |     PHASE 4       |
|  Core Protocol    |      | ZK & Relayer Opt. |      | Ecosystem Expansion|      | Enterprise Layer  |
|  (Completed)      |      |   (Q3-Q4 2026)    |      |    (Q1-Q2 2027)   |      |    (Q3-Q4 2027)   |
+-------------------+      +-------------------+      +-------------------+      +-------------------+
```

---

## 🟢 Phase 1: Core Protocol & Testnet MVP (Completed)

* **Soroban Smart Contract Engine**:
  * [x] Implement Rust-based `StreamVaultContract` supporting continuous per-second liquidity unlocks.
  * [x] Integrate nullifier storage (`DataKey::NullifierUsed`) for deterministic single-use claim protection.
  * [x] Develop `verifier.rs` module for SHA-256 commitment consistency pre-checks.
  * [x] Implement employer stream cancellation and unearned balance reclamation.
* **Developer SDK & CLI**:
  * [x] Author TypeScript SDK (`@streamguard/sdk`) with `ZkCrypto` commitment helpers.
  * [x] Author CLI tool (`streamguard`) for generating commitments, work proofs, and simulating unlocks.
* **Privacy Relayer Proof-of-Concept**:
  * [x] Build Node.js relayer daemon with off-chain nullifier cache and gas abstraction.
* **Frontend Web App**:
  * [x] Build Next.js / Tailwind UI for stream creation, milestone tracking, and shielded claiming.

---

## 🟡 Phase 2: ZK & Relayer Network Optimization (Q3 - Q4 2026)

* **Groth16 / BN254 Verifier Integration**:
  * [ ] Upgrade `verifier.rs` to support full Groth16 zk-SNARK verification on Soroban WASM using host cryptographic primitives.
  * [ ] Benchmark CPU instruction costs and memory utilization for on-chain WASM verifier.
* **Decentralized Privacy Relayer Mesh**:
  * [ ] Transition from single-node relayer to decentralized P2P relayer network with stake slash conditions.
  * [ ] Implement blind relayer fee bidding to eliminate single-relayer censorship risk.
* **Security & Auditing**:
  * [ ] Conduct formal verification of Soroban Rust contract state machines.
  * [ ] Third-party cryptographic audit of commitment circuits and nullifier tree invariants.

---

## 🔵 Phase 3: Ecosystem Expansion & Anchor Integration (Q1 - Q2 2027)

* **Deep SEP-24 / SEP-31 Integration**:
  * [ ] Automated single-signature claim-to-fiat routing through top Stellar anchors (Settle Network, MoneyGram Access, Anclap).
  * [ ] Support multi-asset continuous streaming via automated liquidity swaps (e.g., stream XLM -> auto-convert & claim USDC).
* **Cross-Chain Bridge & Oracle Adapters**:
  * [ ] Integrate Chainlink / Band Protocol oracle attestations for automated milestone verification (e.g., GitHub commit triggers, Jira ticket completion).
  * [ ] Cross-chain streaming compatibility adapters for EVM networks (Ethereum, Arbitrum, Base).
* **Mobile SDK & Wallet Plugins**:
  * [ ] React Native SDK for iOS / Android mobile crypto wallets.
  * [ ] Native extension plugin for Freighter, Albedo, and Lobstr wallets.

---

## 🟣 Phase 4: Enterprise & Compliance Layer (Q3 - Q4 2027)

* **Zero-Knowledge Viewing Keys (Selective Transparency)**:
  * [ ] Implement optional ZK viewing keys allowing employees to prove total streaming income to tax authorities or auditors without revealing private keys or historical wallet addresses.
* **Corporate Payroll SaaS Suite**:
  * [ ] Automated tax withholding stream channels for regional compliance requirements.
  * [ ] Multi-sig DAO approval workflows for batch stealth pool creation.
  * [ ] Enterprise SLA relayer infrastructure with 99.99% uptime guarantees.
