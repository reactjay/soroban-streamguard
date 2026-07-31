# Live Demo Narrative & Walkthrough — Soroban StreamGuard 🎭

This document presents a step-by-step narrative walkthrough of the **Soroban StreamGuard** live demonstration, illustrating how an organization and its stealth contributors interact with the protocol.

---

## 📖 The Story: "Project Apex Stealth Engineering Team"

**Apex Labs**, a stealth Web3 R&D shop, wants to stream payroll to 5 international senior cryptographers. 

* **The Problem**: Public wallet streaming leaks the team's identity, salary allocations, and treasury balance.
* **The Solution**: Apex Labs uses **Soroban StreamGuard** to open a 30-day Stealth Payroll Pool funded with 50,000 USDC. Cryptographers receive streamed compensation silently, accelerate their streaming rates by proving milestone code commits, and cash out directly to fiat via Stellar SEP-24 Anchors.

---

## 🎬 Step-by-Step Walkthrough

### Act 1: "Create a Private Payroll Stream"
**Actor**: Employer / DAO Treasurer (`Apex Labs Admin`)

1. **Navigate to App Interface**: Open the StreamGuard Web Dashboard at `http://localhost:3000`.
2. **Configure Pool Parameters**:
   * Token: `USDC (Soroban Asset Contract)`
   * Total Deposit: `50,000 USDC`
   * Stream Duration: `30 Days`
   * Anonymity Mode: `Stealth Multi-Recipient Pool` Enabled.
3. **Commitment Vector Input**: Enter 5 generated ZK Commitment Hashes (`0xa1...`, `0xb2...`, `0xc3...`, `0xd4...`, `0xe5...`).
4. **Click "Deploy Stream Vault"**:
   * Wallet prompts Freighter signature.
   * Transaction invokes `create_stream()` on Soroban Testnet.

```
[UI Screen: Employer Setup]
+-----------------------------------------------------------------------------------+
| 🛡️ Create Stealth Payroll Stream                                                 |
| Token: [ USDC (CDLZ...) v ]   Deposit Amount: [ 50000.00 ]                        |
| Duration: [ 30 Days ]         Rate: 0.01929 USDC/sec                              |
|                                                                                   |
| Recipient Commitments (Anonymity Set = 5):                                         |
| [1] 0xa1b2c3d4e5f67a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b              |
| [2] 0xb2c3d4e5f67a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c              |
| ...                                                                               |
|                                                                                   |
| [ ACTION: Deploy Stealth Vault on Soroban (Testnet) ]                             |
+-----------------------------------------------------------------------------------+
```

**Expected Terminal Output (CLI / Logs)**:
```text
[Soroban RPC] Invoking StreamVaultContract::create_stream...
[Tx Confirmed] Tx Hash: 0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e
[Event Published] stream_created -> Stream ID: 1 | Stealth Pool: true | Deposit: 50000000000 stroops
```

---

### Act 2: "Submit a Work Proof for Rate Acceleration"
**Actor**: Stealth Contributor (`Cryptographer #1`)

1. **Milestone Unlocked**: Cryptographer #1 finishes the audit of the core arithmetic module (Milestone #1).
2. **Generate Work Proof**: Contributor uses CLI or web interface to select Milestone #1 and supply the audit commit hash:
   ```bash
   npx streamguard generate-work-proof -m 1 -w "commit:7f8a9b2c_zk_arithmetic_audit"
   ```
3. **Submit to Contract**: Click **"Submit Proof to Accelerate Stream"** on the UI dashboard.
4. **Contract Execution**: `submit_work_proof()` verifies the hash and applies a **1.5x (150%) rate boost** to the worker's unlocked yield calculation.

```
[UI Screen: Contributor Dashboard]
+-----------------------------------------------------------------------------------+
| ⚡ Stream Acceleration & Milestone Unlocks                                        |
| Active Stream ID: #1          Base Rate: 0.01929 USDC/sec                         |
| Unlocked Balance: 1,420.50 USDC                                                   |
|                                                                                   |
| Milestone #1: ZK Arithmetic Audit                                                |
| Status: [ VERIFIED & BOOSTED ] -> Multiplier: 1.5x                                 |
| Effective Streaming Speed: 0.02893 USDC/sec                                       |
+-----------------------------------------------------------------------------------+
```

**Expected Output**:
```text
⚡ --- ZK Work Proof Generated ---
Milestone ID:    1
Work Hash:       0x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b
Proof Bytes:     0x776f726b3a636f6d6d6974...
Attestation Sig: 0x1a2b3c4d5e6f7a8b9c0d1e2f...

[Soroban RPC] Invoking submit_work_proof... Verified! New rate multiplier: 15000 BP (1.5x)
```

---

### Act 3: "Withdraw Anonymously via Privacy Relayer"
**Actor**: Stealth Contributor (`Cryptographer #1`)

1. **Initiate Shielded Withdrawal**: Worker wants to withdraw `500 USDC` without linking their destination wallet (`GDEST...`) to commitment `0xa1b2...`.
2. **Client-Side Proof Generation**:
   * Browser generates Nullifier `N1 = SHA-256(Seed || StreamID || ClaimIndex)`.
   * Browser constructs `StealthClaimPayload` with zero-knowledge proof bytes.
3. **Relayer Routing**: Payload is transmitted to the **StreamGuard Privacy Relayer** Node over HTTPS.
4. **Relayer Submission**: Relayer verifies proof offline, checks double-claim prevention, and submits `withdraw_shielded()` to Soroban using the Relayer's account.
5. **Contract Payout**: Contract transfers 500 USDC from Vault directly to `GDEST...`.

```
[UI Screen: Shielded Claim Modal]
+-----------------------------------------------------------------------------------+
| 🔒 Execute Shielded Anonymous Claim                                              |
| Available Unlocked Liquidity: 1,420.50 USDC                                       |
| Claim Amount: [ 500.00 ] USDC                                                     |
| Destination Address: [ GDESTINATION999999999999999999999999999999999999 ]         |
| Routing: [ Privacy Relayer Network (Gas Abstraction Enabled) ]                   |
|                                                                                   |
| [ ACTION: Submit Shielded Relayer Claim ]                                         |
+-----------------------------------------------------------------------------------+
```

**Expected Relayer Log Output**:
```text
[StreamGuard Relayer] Received anonymous claim request for Stream #1...
[Relayer Pre-check] Checking nullifier 0x3f2e1d0c... (Not spent)
[Relayer Pre-check] Verifying ZK proof hash offline... Passed!
[Relayer On-chain] Executing StreamVaultContract::withdraw_shielded...
[Confirmed] Tx Hash: 0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff
[Result] Transferred 500.00 USDC to GDEST... via Relayer GRELAYER...
```

---

### Act 4: "Instant Fiat Off-Ramp via SEP-24 Anchor"
**Actor**: Stealth Contributor

1. **Trigger SEP-24 Cashout**: Immediately following the shielded claim, the user clicks **"Off-Ramp to USD Bank Account"**.
2. **Anchor Session Handshake**: SDK invokes `SEP24AnchorClient.initOfframp()`, opening an interactive anchor session popup.
3. **Automated Conversion**: Claimed USDC on Stellar is transferred to the Anchor custodian and deposited as USD directly into the user's bank account via ACH/Wire.

```
[UI Screen: SEP-24 Anchor Off-ramp]
+-----------------------------------------------------------------------------------+
| 🏦 SEP-24 Fiat Off-Ramp Initialized                                               |
| Anchor: Stellar Bank Anchor (anchor.stellar.org)                                 |
| Amount to Deposit: 500.00 USDC                                                    |
| Target Payout: $497.50 USD (ACH Direct Deposit)                                   |
| Status: [ PENDING_USER_TRANSFER_COMPLETE ] -> Bank Payout Initiated              |
+-----------------------------------------------------------------------------------+
```
