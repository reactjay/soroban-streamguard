# Live Demo Specification & Execution Guide — Soroban StreamGuard 🚀

This specification defines the deployment setup, mock infrastructure, preloaded state configuration, and scripted step-by-step user journey for executing an impressive 3-minute live demonstration of **Soroban StreamGuard**.

---

## 🎯 Demo Goal

Deliver a flawless, high-impact demonstration to grant reviewers, hackathon judges, or protocol partners showing:
1. Creating a private, multi-recipient stealth streaming payroll pool.
2. Submitting a cryptographic work proof to accelerate the streaming rate.
3. Performing an anonymous shielded withdrawal via a privacy relayer.
4. Off-ramping claimed funds to fiat via SEP-24 in a single workflow.

---

## 🏗️ Minimal Deployable Architecture

```
+-----------------------------------------------------------------------------------+
|                                  LOCAL / STAGING SETUP                            |
+-----------------------------------------------------------------------------------+
[ Next.js Web App ] ---> Connects to [ Soroban Testnet RPC ]
  (Port 3000)                               |
                                            v
[ StreamGuard Relayer ] <---> [ StreamVault Smart Contract ]
  (Port 4000 Daemon)            (Contract ID: CC7A...TESTNET)
```

* **Frontend**: Next.js App hosted on `localhost:3000` or deployed on Vercel.
* **Soroban Testnet Contract**: `stream-vault` deployed on Stellar Futurenet / Testnet using `stellar contract deploy`.
* **Mock Privacy Relayer**: Express / TypeScript daemon on `localhost:4000` pre-funded with testnet XLM for gas abstraction.

---

## 📋 Preloaded Demo State

To prevent live setup delays during presentations, the demo environment comes pre-loaded with:

### Preloaded Wallets
* **Employer Wallet**: `GAPEX...TEST` (Pre-funded with 10,000 SAC-USDC).
* **Relayer Wallet**: `GRELAYER...TEST` (Pre-funded with 500 XLM for gas fees).
* **Contributor Destination Wallet**: `GDESTINATION...TEST` (Fresh empty wallet for demonstrating anonymous payout).

### Preloaded Streams
* **Stream ID #101 ("Apex Core R&D Stream")**:
  * Token: `SAC-USDC`
  * Initial Deposit: `10,000 USDC`
  * Rate: `0.00385 USDC/sec`
  * Commitments Vector: `[0xa1b2..., 0xc3d4..., 0xe5f6...]`
  * Unlocked Balance (Simulated Ledger Elapsed Time): `245.50 USDC`

---

## 📜 Scripted 3-Minute Presentation Journey

```
+-----------------------------------------------------------------------------------+
| TIMELINE | DEMO STEP                      | KEY NARRATIVE POINT                   |
+-----------------------------------------------------------------------------------+
| 00:00    | 1. High-Level Hook             | Highlight privacy flaw in EVM streams |
| 00:30    | 2. Deploy Stealth Stream       | Show ZK commitments hiding workers    |
| 01:15    | 3. Submit Work Proof           | Demonstrate rate multiplier (1.5x)    |
| 02:00    | 4. Shielded Relayer Claim      | Show zero linkability to dest wallet  |
| 02:40    | 5. SEP-24 Fiat Off-Ramp        | Show direct bank payout initiation    |
+-----------------------------------------------------------------------------------+
```

---

### Step 1: Deploy Stealth Stream (00:00 - 00:45)
1. Open Demo Web UI at `localhost:3000`.
2. Click **"Quick Setup: Apex Engineering Pool"**.
3. Point out the **Commitment Vector**:
   > *"Notice that instead of raw Stellar public keys (`G...`), we input cryptographic Pedersen commitments. The public contract cannot determine who these 3 cryptographers are."*
4. Click **"Deploy Vault"** -> Show instantaneous transaction confirmation on Soroban Testnet RPC.

---

### Step 2: Milestone Work Proof & Rate Boost (00:45 - 01:30)
1. Switch tab to **"Contributor Portal"**.
2. Select **"Milestone #1: Core Cryptographic Audit"**.
3. Paste the audit commit hash `commit:7f8a9b2c_audit`.
4. Click **"Submit Proof to Accelerate Stream"**.
5. Show live UI update:
   > *"The smart contract verified the proof on-chain and automatically accelerated our streaming speed from 0.019 USDC/sec to 0.028 USDC/sec (1.5x boost)!"*

---

### Step 3: Shielded Relayer Withdrawal (01:30 - 02:20)
1. Click **"Execute Shielded Claim"**.
2. Set Claim Amount to `100 USDC`.
3. Enter destination wallet address `GDESTINATION...TEST`.
4. Click **"Submit Anonymous Claim"**.
5. Show the **Relayer Terminal Console**:
   ```text
   [Relayer] Pre-checking nullifier 0x9f8e... (Valid)
   [Relayer] Verifying ZK proof hash... (Passed)
   [Relayer] Submitting on-chain transaction via GRELAYER...
   [Confirmed!] 100 USDC sent to GDESTINATION...
   ```
6. Point out:
   > *"The transaction was signed and paid for by the Relayer (`GRELAYER...`). Looking at the block explorer, there is zero link between `GDESTINATION...` and the employer vault."*

---

### Step 4: SEP-24 Fiat Cashout (02:20 - 03:00)
1. Click **"Cashout to USD Bank Account (SEP-24)"**.
2. The UI launches the interactive Stellar Anchor modal.
3. Show confirmation: `Status: Bank ACH Transfer Initiated ($99.50 USD)`.
4. Conclude:
   > *"In under 3 minutes, we created a private stream, proved our work, accelerated our pay, claimed anonymously, and cashed out into real fiat currency."*

---

## 🛠️ Automated Demo Launch Script

To run the scripted demo locally with automated mock data:

```bash
# 1. Install workspace
npm install

# 2. Seed mock data & launch demo services
npm run demo:seed
npm run demo:start
```
