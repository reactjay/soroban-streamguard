# Complete API Reference — Soroban StreamGuard 🔌

This reference documents the public APIs across the **Soroban Smart Contract**, **TypeScript SDK (`@streamguard/sdk`)**, and **Developer CLI (`streamguard`)**.

---

## 1. Soroban Contract Interfaces (`StreamVaultContract`)

The smart contract exposes standard Soroban entry points compiled to WASM.

### 1.1 `initialize`
Initializes the contract instance with an admin address.
```rust
pub fn initialize(env: Env, admin: Address)
```
* **Parameters**:
  * `admin`: `Address` — Admin keypair allowed to perform administrative configuration.
* **Panics**: If contract is already initialized.

---

### 1.2 `create_stream`
Creates a new streaming channel or Stealth Multi-Recipient Pool.
```rust
pub fn create_stream(
    env: Env,
    employer: Address,
    token: Address,
    commitments: Vec<BytesN<32>>,
    base_rate_per_sec: i128,
    start_time: u64,
    stop_time: u64,
    is_stealth_pool: bool,
    initial_deposit: i128,
) -> u64
```
* **Returns**: `u64` — The generated unique `stream_id`.
* **Events Published**: `(Symbol("stream_created"), stream_id)`.

---

### 1.3 `add_milestone`
Adds a milestone lock to an active stream. Requires employer authorization.
```rust
pub fn add_milestone(
    env: Env,
    stream_id: u64,
    milestone_id: u32,
    unlocked_amount: i128,
    rate_multiplier_bp: u32,
    work_proof_hash: BytesN<32>,
)
```
* **Parameters**:
  * `rate_multiplier_bp`: `u32` — Basis points for rate boost (e.g., `15000` = 1.5x speed).

---

### 1.4 `submit_work_proof`
Submits a cryptographic work proof to unlock milestone capital and accelerate stream rate.
```rust
pub fn submit_work_proof(
    env: Env,
    stream_id: u64,
    work_proof: WorkProof,
) -> bool
```
* **Returns**: `bool` — `true` if proof verified successfully and rate accelerated.
* **Events Published**: `(Symbol("proof_verified"), stream_id)`.

---

### 1.5 `withdraw_shielded`
Executes a zero-knowledge shielded withdrawal.
```rust
pub fn withdraw_shielded(
    env: Env,
    payload: StealthClaimPayload,
)
```
* **Payload Structure**:
```rust
pub struct StealthClaimPayload {
    pub stream_id: u64,
    pub commitment: BytesN<32>,
    pub nullifier: BytesN<32>,
    pub claim_amount: i128,
    pub zk_proof: Bytes,
    pub destination_address: Address,
}
```

---

### 1.6 `calculate_unlocked_balance`
Pure query function calculating real-time unlocked liquidity.
```rust
pub fn calculate_unlocked_balance(env: Env, stream_id: u64) -> i128
```

---

### 1.7 `cancel_stream`
Employer cancels active stream and reclaims unearned balance.
```rust
pub fn cancel_stream(env: Env, stream_id: u64)
```

---

## 2. TypeScript SDK Reference (`@streamguard/sdk`)

Install via npm:
```bash
npm install @streamguard/sdk
```

### 2.1 Class: `ZkCrypto`
Helper class for client-side cryptographic hashing.

```typescript
import { ZkCrypto } from '@streamguard/sdk';

// Generate Pedersen commitment for employer registration
const commitment = ZkCrypto.generateCommitment('custom-salt', 'custom-seed');
console.log(commitment.commitmentHash); // "0x..."

// Generate single-use nullifier
const nullifier = ZkCrypto.generateNullifier(commitment.nullifierSeed, streamId, 1);
```

---

### 2.2 Class: `StreamGuardClient`
Main client interface for interacting with StreamGuard network nodes.

#### Constructor
```typescript
import { StreamGuardClient } from '@streamguard/sdk';

const client = new StreamGuardClient(
  'CA7X...', // Soroban Contract ID
  'https://soroban-testnet.stellar.org'
);
```

#### Methods

##### `createStealthPool(options: CreateStreamOptions)`
```typescript
const { streamId, txHash } = await client.createStealthPool({
  employerAddress: 'GBRP...',
  tokenAddress: 'CDLZ...', // SAC USDC Address
  commitments: ['0xa1b2c3...', '0xd4e5f6...'],
  baseRatePerSec: 100, // 100 stroops/sec
  durationSeconds: 86400, // 24 hours
  isStealthPool: true,
  initialDeposit: 8640000,
});
```

##### `submitWorkProof(streamId: number, milestoneId: number, workContent: string)`
```typescript
const result = await client.submitWorkProof(
  1, // Stream ID
  101, // Milestone ID
  'git-commit-hash:7f8a2b3c4d5e'
);
console.log(result.newRateBoost); // "1.5x (150% Streaming Speed)"
```

##### `claimAndOfframpFiat(streamId, commitment, claimAmountStroops, offrampParams)`
```typescript
const offrampResult = await client.claimAndOfframpFiat(
  1,
  commitment,
  5000000, // 0.5 USDC
  {
    assetCode: 'USDC',
    homeDomain: 'anchor.stellar.org',
    kacToken: 'eyJhbG...',
  }
);
console.log(offrampResult.sep24Session.url); // "https://anchor.stellar.org/sep24/..."
```

---

## 3. Developer CLI Reference (`streamguard`)

Run via global npm install or `npx`:

### 3.1 `generate-commitment`
Generate client-side ZK Pedersen commitment hash and stealth seeds.
```bash
npx streamguard generate-commitment [--salt <string>] [--nullifier-seed <string>]
```
**Example Output**:
```text
🔒 --- Soroban StreamGuard ZK Commitment ---
Salt:            0x7f8a9b1c2d3e...
Nullifier Seed:  0x4a5b6c7d8e9f...
Proof Hex:       0x7f8a9b1c2d3e...4a5b6c7d8e9f...
Commitment Hash: 0xa9b8c7d6e5f4...
--------------------------------------------
```

---

### 3.2 `generate-work-proof`
Generate cryptographic proof of work for milestone stream rate acceleration.
```bash
npx streamguard generate-work-proof -m <milestone-id> -w <work-content>
```
**Example Output**:
```text
⚡ --- ZK Work Proof Generated ---
Milestone ID:    1
Work Hash:       0x3c4d5e6f7a8b...
Proof Bytes:     0x776f726b3a6769742d636f6d6d6974...
Attestation Sig: 0x8a7b6c5d4e3f...
-----------------------------------
```

---

### 3.3 `simulate-unlock`
Simulate streaming unlock curve over duration with milestone acceleration.
```bash
npx streamguard simulate-unlock -r <rate> -d <duration-seconds> [-b <boost-multiplier>]
```
**Example Output**:
```text
📊 --- Stream Yield Unlock Simulation ---
Base Rate:     100 stroops/sec
Effective Rate:150 stroops/sec (1.5x boost)
Duration:      86400 seconds (24.00 hours)
Total Earned:  12,960,000 stroops
-------------------------------------------
```

---

### 3.4 `inspect-pool-anonymity`
Analyze anonymity set size and entropy score for a Stealth Payroll Pool.
```bash
npx streamguard inspect-pool-anonymity -c <commitments-count>
```
**Example Output**:
```text
🛡️ --- Stealth Pool Anonymity Inspection ---
Pool Anonymity Set Size: 8 recipients
Entropy (bits):          3.00 bits
Anonymity Protection:    80%
Recipient Linkage:       Zero-Knowledge (Hidden Addresses)
Salary Distribution:     Shielded Commitment Vector
----------------------------------------------
```
