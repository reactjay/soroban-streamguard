# System Architecture — Soroban StreamGuard 🏛️

This document provides a comprehensive technical architectural breakdown of **Soroban StreamGuard**, detailing component interactions, cryptographic primitives, hybrid off-chain/on-chain ZK execution models, state management, and privacy tradeoffs.

---

## 1. System Breakdown

The Soroban StreamGuard architecture consists of five decoupled, highly cohesive system modules:

```
[ Frontend App (Next.js) ] <---> [ Client SDK (@streamguard/sdk) ] <---> [ Developer CLI ]
                                          |
                                          v
                              [ Privacy Relayer Node ]
                                          |
                                          v
                      [ Soroban Smart Contract (stream-vault) ]
                                          |
                                          v
                       [ Verification Engine (verifier.rs) ]
```

### 1.1 Soroban Smart Contract (`contracts/stream-vault`)
The core on-chain state engine written in Rust for Stellar's Soroban WASM runtime.
* **`StreamVaultContract` (`lib.rs`)**: Manages stream creation, persistent storage, linear unlock calculation, work proof verification calls, nullifier registration, token transfers via Soroban Token Interface, and stream cancellation.
* **`Verifier` (`verifier.rs`)**: Provides cryptographically secure verification routines for SHA-256 commitment consistency proofs and work-proof oracle attestation hashes.
* **Data Schema (`types.rs`)**: Defines deterministic Soroban `#[contracttype]` data structures (`Stream`, `Milestone`, `WorkProof`, `StealthClaimPayload`, `DataKey`).

### 1.2 Privacy Relayer Node (`relayer/`)
An off-chain Node.js / TypeScript daemon that acts as an anonymous transaction bundler:
* Accepts shielded claim payloads containing destination addresses, ZK proof bytes, claim amounts, and nullifier hashes.
* Performs off-chain pre-verification of ZK proof integrity and checks memory caches against known double-claim attempts.
* Signs and submits the transaction on-chain using the Relayer's keypair (`GRELAYER...`), paying gas fees on behalf of the recipient.
* Completely severs the link between the recipient's personal Stellar account and the claim request transaction origin.

### 1.3 TypeScript SDK (`sdk/`)
An enterprise-ready TypeScript library (`@streamguard/sdk`) providing:
* `ZkCrypto`: Client-side cryptographic helper functions for generating Pedersen-style commitment hashes (`Hash(salt || nullifierSeed)`), nullifier derivation, and proof generation.
* `StreamGuardClient`: High-level wrapper for initializing streams, submitting work proofs, simulating unlocked stream yields, and orchestrating relayer calls.
* `SEP24AnchorClient`: Integration adapter for triggering interactive Stellar Anchor SEP-24 off-ramp sessions directly into fiat bank accounts.

### 1.4 Developer CLI (`cli/`)
A node-based command-line interface (`streamguard`) designed for developer tooling, automated CI/CD work-proof submission, and security inspection:
* `generate-commitment`: Generates random salt, nullifier seed, and commitment hash.
* `generate-work-proof`: Creates cryptographic proof of work for milestone acceleration.
* `simulate-unlock`: Models streaming liquidity unlock curves under variable rate multipliers.
* `inspect-pool-anonymity`: Computes pool entropy bits and privacy protection scores.

### 1.5 Frontend Application (`frontend/`)
A modern Next.js + TailwindCSS web application offering:
* **Employer Dashboard**: Stream creation, multi-recipient commitment vector setup, initial token funding, and milestone management.
* **Contributor Portal**: Unlocked balance dashboard, work-proof submission modal, and rate acceleration monitoring.
* **Shielded Claim Modal**: One-click private claim routing through the Privacy Relayer with direct SEP-24 off-ramp triggers.

---

## 2. Comprehensive Data Flow

```
+---------------------------------------------------------------------------------------------------+
|                                     STREAM CREATION FLOW                                          |
+---------------------------------------------------------------------------------------------------+
[Employer] ---> Generates Commitment Hashes [C1, C2, C3] via SDK
           ---> Calls `create_stream()` on Soroban Contract with Initial Deposit
           ---> Contract locks tokens in Vault Instance & registers commitments [C1, C2, C3]

+---------------------------------------------------------------------------------------------------+
|                                  MILESTONE WORK PROOF FLOW                                       |
+---------------------------------------------------------------------------------------------------+
[Worker]   ---> Generates Work Proof (Git Commit Hash + Oracle Attestation) via CLI/SDK
           ---> Calls `submit_work_proof(stream_id, work_proof)`
           ---> Contract `Verifier` verifies proof hash & marks milestone verified
           ---> Streaming rate scales by rate_multiplier_bp (e.g. 15000 = 1.5x)

+---------------------------------------------------------------------------------------------------+
|                                    SHIELDED WITHDRAWAL FLOW                                       |
+---------------------------------------------------------------------------------------------------+
[Worker]   ---> Computes ZK Proof Bytes + Nullifier (N1) locally (in browser)
           ---> Sends payload to [Privacy Relayer Node] (over HTTPS / WSS)
           ---> [Relayer] executes `withdraw_shielded()` on Soroban Contract
           ---> Contract checks:
                   1. Nullifier N1 not in DataKey::NullifierUsed
                   2. Commitment C1 in stream.commitments
                   3. Verifier checks proof bytes consistency
                   4. Available unlocked liquidity >= claim_amount
           ---> Contract marks N1 spent, transfers tokens to Destination Address, publishes event
```

---

## 3. ZK Hybrid Model: On-Chain vs. Off-Chain

To achieve optimal performance on Soroban without exceeding WASM CPU instruction limits or ledger storage budgets, Soroban StreamGuard uses a **ZK Hybrid Execution Model**:

| Operation Phase | Execution Context | Cryptographic Primitive | Objective |
| :--- | :--- | :--- | :--- |
| **Commitment Generation** | Off-Chain (Client Browser / SDK) | `SHA-256(Salt \|\| NullifierSeed)` | Hides recipient identity from public stream parameters |
| **Proof Construction** | Off-Chain (Client Browser / CLI) | `Preimage Proof Construction` | Prepares non-interactive zero-knowledge payload |
| **Relayer Pre-flight** | Off-Chain (Relayer Node) | Memory Nullifier Cache & Proof Pre-check | Filters invalid proofs and prevents relayer gas waste |
| **On-Chain Verification** | On-Chain (Soroban WASM Contract) | `Verifier::verify_commitment_consistency` | Enforces math invariant without heavy Groth16 pairings |
| **Nullifier Verification** | On-Chain (Soroban Persistent Storage)| `DataKey::NullifierUsed(BytesN<32>)` | Guarantees deterministic double-claim protection |

---

## 4. Privacy Model & Anonymity Mechanics

### 4.1 Unlinkability & Commitment Vectors
In standard payroll contracts, `Recipient Address` is stored on-chain in plaintext. In StreamGuard:
$$\text{Commitment} = \text{SHA-256}(\text{Salt} \parallel \text{NullifierSeed})$$
When a claim occurs, the worker presents a nullifier:
$$\text{Nullifier} = \text{SHA-256}(\text{NullifierSeed} \parallel \text{StreamID} \parallel \text{ClaimEpoch})$$
Because the nullifier cannot be mathematically linked back to the commitment without knowing `NullifierSeed` and `Salt`, external observers see token withdrawals from the vault to fresh addresses without knowing which commitment slot was redeemed.

### 4.2 Anonymity Set Size ($N$)
The privacy strength of a Stealth Payroll Pool scales with the commitment vector size $N$:
$$\text{Entropy (bits)} = \log_2(N)$$
* $N = 1$: Linkable identity (no privacy).
* $N = 10$: $3.32$ bits of anonymity entropy (Moderate privacy).
* $N = 100$: $6.64$ bits of anonymity entropy (High privacy).

---

## 5. Tradeoffs & Constraints

### 5.1 Storage Costs & Garbage Collection
* **Tradeoff**: Persistent storage of spent nullifiers (`DataKey::NullifierUsed`) incurs ledger rent on Soroban.
* **Mitigation**: Soroban instance entries and state archival parameters are tuned to ensure minimal footprint; nullifiers are stored as compact 32-byte hash keys.

### 5.2 Relayer Liveness & Trust Assumptions
* **Tradeoff**: Shielded claims rely on a relayer node to submit transactions and obscure origin IP/wallet linkage.
* **Mitigation**: The relayer **cannot steal funds** or alter claim amounts/destinations because the contract validates proof consistency on-chain. If a relayer goes offline, workers can submit claims directly via self-relaying (sacrificing transaction submission anonymity while preserving address identity).

### 5.3 Fixed vs. Variable Claim Amounts
* **Tradeoff**: Arbitrary withdrawal amounts (e.g., claiming exactly `134.5621 XLM`) can introduce side-channel timing and amount analysis.
* **Recommendation**: Frontend & SDK encourage standard denomination claims (e.g., standard bucket sizes) to maximize pool entropy.
