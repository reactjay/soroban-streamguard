# Soroban StreamGuard 🛡️✨

> **A Privacy-Preserving Programmable Compensation Primitive on Stellar & Soroban**

[![Soroban](https://img.shields.io/badge/Soroban-v22.0.0-blueviolet.svg)](https://soroban.stellar.org)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-146EF5.svg)](https://stellar.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

---

## ⚡ Why Stellar + Soroban?

Building a privacy-preserving streaming engine requires predictable transaction execution, ultra-low fee overhead, and fast ledger finality. Stellar and Soroban provide the ideal foundation:

* **Sub-Second Finality & Low Gas**: Continuous micro-claims and private relayer submissions require predictable, sub-cent fee structures without network congestion spikes.
* **Soroban WASM Architecture**: Rust-compiled WASM smart contracts allow efficient cryptographic operations (SHA-256 state trees, commitment checks, and state storage optimization).
* **Native Anchor Ecosystem (SEP-24)**: Directly links private, streaming crypto earnings with compliant real-world fiat off-ramps (USD, EUR, BRL, NGN) in a single integrated flow.
* **Persistent vs. Instance State Isolation**: Soroban's storage tier model allows efficient separation of global stream instance state and persistent nullifier double-claim verification records.

---

## 🚀 Key Innovations

### 1. 🛡️ ZK Shielded Streaming Payroll
Recipients do not expose their Stellar wallet addresses (`G...`) to the public stream contract. Instead, employers register **cryptographic commitment hashes** (`Hash(Salt || NullifierSeed)`). Recipient withdrawals occur anonymously through a zero-knowledge proof payload routed via a Privacy Relayer node, preventing wallet linkability.

### 2. ⚡ Milestone Proof-of-Work Rate Unlocks
Streams are non-static. Employees and DAO contributors submit cryptographic **Work Proofs** (e.g., hash attestations of code releases, deliverables, or oracle signatures). Verifying a work proof unlocks immediate lump-sum milestone payouts and dynamically accelerates the continuous streaming rate by custom multipliers (e.g., `1.5x` streaming rate).

### 3. 👥 Stealth Multi-Recipient Pools
A single contract instance can hold a **Stealth Multi-Recipient Pool** supporting an arbitrary anonymity set size. Multiple contributors stream from a unified liquidity pool without public visibility into individual salary distributions or allocation breakdown.

---

## 🏗️ Architecture Overview

```
                        +-----------------------------------------+
                        |            Employer / DAO               |
                        +-----------------------------------------+
                                             |
                                  1. Create Stealth Pool
                                  (Deposit Tokens + Commitments)
                                             v
                        +-----------------------------------------+
                        |   Soroban StreamVault Smart Contract     |
                        |      (contracts/stream-vault)           |
                        +-----------------------------------------+
                                 ^                       ^
            2. Submit Work Proof |                       | 3. Relayer Shielded
            (Accelerates Rate)   |                       |    Claim (ZK Proof)
                                 |                       |
                  +----------------------+       +-----------------------+
                  |  Contributor / Worker|       |   Privacy Relayer Node |
                  +----------------------+       +-----------------------+
                                                             |
                                                   4. Shielded Tokens /
                                                      SEP-24 Fiat Off-ramp
                                                             v
                                                 +-----------------------+
                                                 | Recipient Destination |
                                                 +-----------------------+
```

---

## 🛠️ Core Features

* **Continuous Per-Second Streaming**: Linear liquidity unlocking based on ledger timestamps.
* **Nullifier Double-Claim Prevention**: Persistent ledger tracking prevents reuse of ZK claim nullifiers.
* **Employer Cancel & Reclaim**: Employers can cancel active streams and reclaim unearned balance while honoring earned accrued liquidity.
* **TypeScript SDK (`@streamguard/sdk`)**: Full client-side library for commitment generation, proof building, and contract interactions.
* **Developer CLI (`streamguard`)**: Terminal CLI tool for commitment hashing, work proof generation, and anonymity set inspection.
* **Interactive Frontend**: Next.js / Tailwind interface for managing streams, uploading work proofs, and managing relayer claims.

---

## 🎯 Example Use Cases

* **Anonymous DAO Core Teams**: Compensate core developers without exposing individual developer wallet balances to target profiling or competitive poaching.
* **Milestone-Driven Contractor Payroll**: Pay international contractors continuously while tying rate accelerations and bonus unlocks to verified milestone deliverables.
* **Stealth Startup Grants**: Disburse milestone grants to stealth projects while preserving grant recipient privacy until launch.

---

## ⚙️ Quick Start

### Prerequisites
* Rust toolchain with `wasm32-unknown-unknown` target
* [Stellar CLI (`stellar-cli`)](https://developers.stellar.org/docs/smart-contracts/getting-started/setup)
* Node.js v18+ & npm

### 1. Repository Clone & Installation
```bash
git clone https://github.com/stream-vault/soroban-streamguard.git
cd soroban-streamguard
npm install
```

### 2. Build & Test Smart Contracts
```bash
cd contracts/stream-vault
cargo test
cargo build --target wasm32-unknown-unknown --release
cd ../..
```

### 3. Build SDK & CLI
```bash
# Build SDK
cd sdk && npm run build && cd ..

# Build & Run CLI
cd cli && npm run build
npx streamguard generate-commitment
```

### 4. Launch Local Relayer & Frontend
```bash
# Start Relayer Node
cd relayer && npm run dev &

# Start Web Interface
cd frontend && npm run dev
```

---

## 📺 Demo & Media

* 🎬 **Live Demo Application**: [https://soroban-streamguard.vercel.app](https://soroban-streamguard.vercel.app) *(Mock / Testnet)*
* 📖 **Demo Narrative & Script**: See [docs/DEMO.md](file:///Users/japheth/Documents/stream-vault/docs/DEMO.md)
* ⚙️ **Live Demo Specification**: See [docs/LIVE_DEMO_SPEC.md](file:///Users/japheth/Documents/stream-vault/docs/LIVE_DEMO_SPEC.md)

---

## 🗺️ Roadmap Overview

* **Phase 1: Core Protocol** (Completed) — Soroban WASM contract, basic ZK verifier module, SDK, CLI, Relayer daemon.
* **Phase 2: Full Groth16 Verification** — On-chain BN254 curve verification & WASM circuit optimization.
* **Phase 3: Ecosystem Expansion** — SEP-24 / SEP-31 automated anchor routing and multi-asset liquidity routing.
* **Phase 4: Enterprise Compliance** — Optional ZK view keys for tax & corporate compliance reporting.

*For full details, see [docs/ROADMAP.md](file:///Users/japheth/Documents/stream-vault/docs/ROADMAP.md).*

---

## 🤝 Call for Contributors

We welcome contributions from protocol designers, cryptographers, Rust / Soroban developers, and frontend engineers!

* 🐛 **Issues**: Report bugs or suggest feature requests in GitHub Issues.
* 💬 **Discussions**: Join our developer community on Stellar Discord (`#soroban-streamguard`).
* 📜 **Guidelines**: Check out [docs/CONTRIBUTING.md](file:///Users/japheth/Documents/stream-vault/docs/CONTRIBUTING.md) to get started.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
