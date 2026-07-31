# Protocol Specification — Soroban StreamGuard 📜

**Soroban StreamGuard** defines a formal, zero-knowledge programmable streaming payment specification on the Stellar network.

---

## 1. Core Protocol Primitives

### 1.1 `Stream`
The core liquidity vault state entity. Represents a continuous token payment channel.

```rust
pub struct Stream {
    pub id: u64,
    pub employer: Address,
    pub token: Address,
    pub base_rate_per_sec: i128,
    pub current_rate_per_sec: i128,
    pub start_time: u64,
    pub stop_time: u64,
    pub last_update_time: u64,
    pub total_deposited: i128,
    pub total_claimed: i128,
    pub is_active: bool,
    pub is_stealth_pool: bool,
    pub commitments: Vec<BytesN<32>>,
    pub nullifiers: Vec<BytesN<32>>,
    pub milestones: Vec<Milestone>,
}
```

* **`id`**: Unique 64-bit integer identifier for the stream instance.
* **`base_rate_per_sec`**: Base streaming rate in stroops/second ($1 \text{ token} = 10^7 \text{ stroops}$).
* **`current_rate_per_sec`**: Active streaming rate, updated when milestone multipliers are unlocked.
* **`is_stealth_pool`**: Boolean flag indicating whether the stream is configured as a multi-recipient stealth pool.

### 1.2 `Commitment`
A 32-byte cryptographic hash representing a hidden recipient:
$$\text{Commitment} = \text{SHA-256}(\text{Salt} \parallel \text{NullifierSeed})$$
Stored inside `Stream.commitments`.

### 1.3 `Nullifier`
A unique 32-byte derivation hash presented during withdrawal:
$$\text{Nullifier} = \text{SHA-256}(\text{NullifierSeed} \parallel \text{StreamID} \parallel \text{ClaimIndex})$$
Stored permanently under `DataKey::NullifierUsed(BytesN<32>)` to ensure single-use claim protection.

### 1.4 `Milestone`
A conditional lock within a stream that unlocks bonus capital or accelerates the streaming speed:
```rust
pub struct Milestone {
    pub id: u32,
    pub work_proof_hash: BytesN<32>,
    pub unlocked_amount: i128,
    pub rate_multiplier_bp: u32, // Basis points (10000 = 1.0x, 15000 = 1.5x)
    pub is_verified: bool,
}
```

---

## 2. Formal State Transitions

State transitions are deterministic functions executed by `StreamVaultContract`.

```
                    +-------------------+
                    |   (Non-Existent)  |
                    +-------------------+
                              |
                     create_stream()
                              v
                    +-------------------+
                    |    Stream Active  | <-----+
                    +-------------------+       |
                      |               |         | submit_work_proof()
     withdraw_shielded()              | --------+ (boosts rate)
     (claims liquidity)               v
                    +-------------------+
                    |  Stream Cancelled |
                    +-------------------+
```

### 2.1 `create_stream`
* **Preconditions**:
  * $T_{\text{start}} < T_{\text{stop}}$
  * $R_{\text{base}} > 0$
  * $D_{\text{initial}} > 0$
  * Employer grants token transfer approval.
* **State Operations**:
  * Transfer $D_{\text{initial}}$ from employer to contract.
  * Assign $\text{StreamID} = \text{StreamCount} + 1$.
  * Persist `Stream` object in persistent storage.
  * Emit `stream_created` event.

### 2.2 `add_milestone`
* **Preconditions**:
  * Employer address authorization (`require_auth()`).
  * Valid stream existence.
* **State Operations**:
  * Append `Milestone` struct with `is_verified = false` to `stream.milestones`.

### 2.3 `submit_work_proof`
* **Preconditions**:
  * `stream.is_active == true`
  * `Verifier::verify_work_proof(work_proof)` succeeds.
  * `work_proof.work_hash == milestone.work_proof_hash`.
* **State Operations**:
  * Mark target `milestone.is_verified = true`.
  * Compute new current rate:
    $$R_{\text{current}} = \frac{R_{\text{base}} \times \text{rate\_multiplier\_bp}}{10000}$$
  * Update `last_update_time = ledger.timestamp()`.
  * Emit `proof_verified` event.

### 2.4 `withdraw_shielded`
* **Preconditions**:
  * `stream.is_active == true`
  * `NullifierUsed(payload.nullifier)` does NOT exist in persistent storage.
  * `payload.commitment` exists in `stream.commitments`.
  * `Verifier::verify_commitment_consistency(commitment, zk_proof)` succeeds.
  * $\text{claim\_amount} \le U(t) - \text{total\_claimed}$.
* **State Operations**:
  * Set `DataKey::NullifierUsed(payload.nullifier) = true`.
  * Increment `stream.total_claimed += payload.claim_amount`.
  * Transfer `claim_amount` tokens from contract address to `payload.destination_address`.
  * Emit `shielded_withdrawn` event.

### 2.5 `cancel_stream`
* **Preconditions**:
  * `employer.require_auth()`.
* **State Operations**:
  * Compute earned unlocked balance $U(t)$.
  * Compute unearned balance:
    $$B_{\text{unearned}} = D_{\text{total}} - U(t)$$
  * Set `stream.is_active = false`.
  * Transfer $B_{\text{unearned}}$ back to employer if $B_{\text{unearned}} > 0$.

---

## 3. Economic Model & Unlocking Equations

### 3.1 Time-Based Unlocked Yield Equation
The total unlocked liquidity $U(t)$ at ledger timestamp $t$ is calculated as:
$$U(t) = \min \left( D_{\text{deposited}}, \quad \left[ ( \min(t, T_{\text{stop}}) - T_{\text{start}} ) \times R_{\text{current}} \right] + \sum_{m \in M_{\text{verified}}} A_m \right)$$

Where:
* $T_{\text{start}}, T_{\text{stop}}$: Stream start and stop timestamps.
* $R_{\text{current}}$: Effective rate per second (after milestone multipliers).
* $M_{\text{verified}}$: Set of all verified milestones.
* $A_m$: Lump-sum bonus amount unlocked by milestone $m$.
* $D_{\text{deposited}}$: Total tokens deposited into the vault.

### 3.2 Relayer Gas Abstraction Fee Structure
Relayers submit shielded claim transactions on behalf of users. To offset Soroban gas fees:
$$\text{Payout}_{\text{Net}} = \text{ClaimAmount} - \text{Fee}_{\text{Relayer}}$$
The relayer fee $\text{Fee}_{\text{Relayer}}$ (e.g., 10 stroops) is deducted during off-chain order construction or paid out via relayer tipping mechanisms.

---

## 4. Security Assumptions & Threat Model

### 4.1 Security Assumptions
1. **Cryptographic Primitives**: SHA-256 is collision-resistant and second-preimage resistant.
2. **Soroban Isolation**: Soroban WASM runtime correctly enforces `require_auth()` and address authorization invariants.
3. **Ledger Integrity**: Stellar Consensus Protocol (SCP) provides Byzantine agreement and prevents transaction reordering.

### 4.2 Threat Model Analysis

| Threat Scenario | Vector | Mitigation Invariant |
| :--- | :--- | :--- |
| **Double Claiming** | Recipient attempts to submit the same ZK proof twice | `DataKey::NullifierUsed` check in `withdraw_shielded()` panics immediately if nullifier key exists. |
| **Fake Work Proof** | Malicious worker submits arbitrary payload | `Verifier::verify_work_proof()` enforces SHA-256 proof hash equality and checks non-empty oracle attestation signatures. |
| **Unauthorized Stream Cancellation** | Non-employer attempts to stop stream | `stream.employer.require_auth()` is enforced by Soroban runtime. |
| **Front-running Relayer Claim** | MEV bot intercepts relayer transaction | Soroban transactions use explicit ledger sequencing; nullifiers are bound to specific `(commitment, stream_id)` pairs. |
| **Liquidity Drain** | Recipient claims more than accrued balance | `claim_amount > available_unlocked` check panics before token transfer executes. |
