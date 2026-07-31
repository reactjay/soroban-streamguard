# Technical Whitepaper — Soroban StreamGuard 📄

**Title**: *Soroban StreamGuard: A Zero-Knowledge Programmable Compensation Primitive and Shielded Streaming Liquidity Architecture on Stellar*  
**Authors**: StreamGuard Protocol Core Team  
**Date**: July 2026  
**Status**: Draft / Protocol Specification  

---

## Abstract

On-chain streaming payments enable continuous, real-time liquidity transfer between counterparties. However, existing public ledger streaming implementations expose complete payment metadata—including recipient wallet addresses, streaming rates, total accrued balances, and treasury balances—to public scrutiny. This whitepaper introduces **Soroban StreamGuard**, a zero-knowledge programmable compensation primitive architected natively for Stellar's Soroban smart contract platform. StreamGuard combines Pedersen-style commitment schemes, nullifier storage trees, milestone proof-of-work rate acceleration multipliers, and an off-chain gas-abstracted privacy relayer mesh to achieve strong recipient unlinkability, dynamic rate unlock mechanics, and seamless fiat off-ramping via Stellar SEP-24 anchors.

---

## 1. Introduction & Background

Continuous streaming payments replace discrete block interval payout schedules with per-second continuous liquidity curves. In traditional decentralized finance (DeFi), streaming primitives are employed for payroll, token vesting, and subscription billing.

Despite their economic efficiency, existing streaming architectures suffer from severe privacy vulnerabilities. On transparent blockchains, an observer monitoring a streaming contract can deduce:
1. **Identity Linkability**: The exact public key of every streaming recipient.
2. **Real-Time Wealth Accumulation**: The precise balance accrued by a worker down to the second.
3. **Organizational Runway & Burn Rate**: The net treasury outflows of the funding entity.

Soroban StreamGuard solves these vulnerabilities by constructing an on-chain **Shielded Vault** that enforces token streaming invariants while preserving recipient anonymity.

---

## 2. Cryptographic Scheme & ZK Design

### 2.1 Commitment Vector Construction
Instead of storing plaintext recipient addresses ($A_1, A_2, \dots, A_n$), the employer constructs a vector of 32-byte cryptographic commitments $\vec{C} = [C_1, C_2, \dots, C_n]$ during vault creation.

For recipient $i$:
$$C_i = \text{SHA-256}(S_i \parallel N_i^{\text{seed}})$$
Where:
* $S_i \in \{0,1\}^{256}$ is a cryptographically secure random 256-bit salt.
* $N_i^{\text{seed}} \in \{0,1\}^{256}$ is a cryptographically secure random 256-bit nullifier seed.

The commitment $C_i$ is published on-chain, while $(S_i, N_i^{\text{seed}})$ are transmitted securely off-chain from employer to recipient.

### 2.2 Nullifier Derivation & Double-Claim Prevention
To prevent double claiming of accrued streaming liquidity without revealing which commitment slot is being redeemed, the recipient derives a deterministic single-use nullifier $\mathcal{N}$:

$$\mathcal{N} = \text{SHA-256}(N_i^{\text{seed}} \parallel \text{StreamID} \parallel k)$$

Where $k \in \mathbb{N}$ represents the claim sequence epoch.

When a withdrawal payload is submitted to `StreamVaultContract::withdraw_shielded`, the contract checks persistent ledger storage:
$$\text{DataKey::NullifierUsed}(\mathcal{N}) \stackrel{?}{=} \text{null}$$

If $\mathcal{N}$ exists, execution panics immediately. If $\mathcal{N}$ does not exist, the contract registers $\mathcal{N}$ in persistent storage before transferring tokens to the recipient's requested destination address.

### 2.3 Off-Chain Zero-Knowledge Proof Verification
To prove ownership of a commitment slot $C_i \in \vec{C}$ without revealing $i$ or $S_i$, the recipient constructs a ZK proof payload:

$$\pi = \text{Proof}\{ (S_i, N_i^{\text{seed}}) : \text{SHA-256}(S_i \parallel N_i^{\text{seed}}) = C_i \land \text{SHA-256}(N_i^{\text{seed}} \parallel \text{StreamID} \parallel k) = \mathcal{N} \}$$

The Soroban `verifier.rs` module evaluates proof consistency prior to executing the state transfer.

---

## 3. Mathematical Unlocking & Acceleration Dynamics

### 3.1 Unlocked Balance Function
Let $D_{\text{total}}$ be the initial token deposit in the vault. Let $t_{\text{start}}$ and $t_{\text{stop}}$ denote the start and stop timestamps of the stream.

The continuous base streaming rate per second is defined as:
$$R_{\text{base}} = \frac{D_{\text{total}}}{t_{\text{stop}} - t_{\text{start}}}$$

### 3.2 Milestone Rate Multiplier ($\mu$)
When a contributor completes a milestone, they submit a work proof payload $W = (\text{milestone\_id}, \text{proof\_bytes}, \text{work\_hash}, \text{attestation\_sig})$.

Upon verification by `Verifier::verify_work_proof`, the contract applies a basis-point rate multiplier $\mu$:
$$R_{\text{effective}} = \frac{R_{\text{base}} \times \mu}{10000}$$

Where $\mu = 10000$ corresponds to $1.0\times$ speed, and $\mu = 15000$ corresponds to $1.5\times$ speed ($150\%$).

The cumulative unlocked yield $U(t)$ at ledger timestamp $t$ is:
$$U(t) = \min \left( D_{\text{total}}, \quad ( \min(t, t_{\text{stop}}) - t_{\text{start}} ) \cdot R_{\text{effective}} + \sum_{m \in M_{\text{verified}}} B_m \right)$$

Where $B_m$ represents immediate lump-sum bonus capital unlocked by milestone $m$.

---

## 4. Comparative Analysis: StreamGuard vs. Existing Primitives

| Feature / Metric | Sablier v2 (EVM) | Superfluid (EVM) | Drips Protocol (EVM) | **Soroban StreamGuard (Stellar)** |
| :--- | :--- | :--- | :--- | :--- |
| **Recipient Identity** | Cleartext Public Address | Cleartext Public Address | Cleartext Public Address | **Shielded (ZK Commitments)** |
| **Claim Linkability** | Fully Linkable | Fully Linkable | Fully Linkable | **Unlinkable (Nullifiers)** |
| **Dynamic Rate Multipliers**| Static / Linear | Static / Constant Flow | Dependency-based | **Dynamic (Proof-of-Work)** |
| **Gas Fee Predictability** | Variable (EVM Gas Spikes)| High Gas Overhead | High Batching Cost | **Deterministic Low Gas (Soroban)** |
| **Native Fiat Off-Ramp** | Requires CEX / Bridge | Requires Third-Party Swap| None | **Native SEP-24 Anchor Integration** |
| **Runtime Architecture** | EVM Bytecode | EVM Bytecode | EVM Bytecode | **Soroban WASM Architecture** |

---

## 5. Economic & Privacy Implications

### 5.1 Mitigation of Micro-Timing Attacks
If a stream recipient claims funds at predictable, fixed time intervals (e.g., every Friday at 17:00 UTC), side-channel timing analysis could correlate claim volume with commitment slots.

To preserve maximal pool privacy:
* **Relayer Batching**: Relayers aggregate multiple claim payloads across distinct streams into randomized submission windows.
* **Standardized Claim Buckets**: The SDK recommends withdrawing in fixed-size token buckets (e.g., 50 USDC, 100 USDC, 500 USDC) to obscure exact fractional earnings.

### 5.2 Enterprise Regulatory Compliance & Selective Transparency
While StreamGuard guarantees default privacy against public observers, corporate payroll often requires selective disclosure for tax compliance.

StreamGuard supports optional **Zero-Knowledge Viewing Keys**:
$$V_i = \text{SHA-256}(\text{Salt}_i \parallel \text{ViewKey})$$
A worker can provide $V_i$ to an auditor or tax authority to prove total income streamed over a fiscal quarter without exposing private spending keys or compromising ongoing pool privacy for co-workers.

---

## 6. Conclusion & Future Work

Soroban StreamGuard establishes a novel, privacy-preserving, programmable compensation primitive for Web3 organizations. By leveraging Stellar's fast WASM smart contract execution, low gas fees, and native anchor network, StreamGuard brings real-world utility, recipient privacy, and dynamic milestone rate unlocks to streaming payments.

Future research will focus on extending on-chain Groth16 pairing primitives in Soroban host functions, implementing decentralized relayer stake-slashing meshes, and expanding cross-chain interoperability modules.
