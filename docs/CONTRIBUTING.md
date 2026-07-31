# Contributing to Soroban StreamGuard 🛠️

Thank you for your interest in contributing to **Soroban StreamGuard**! We welcome open-source contributions from developers, cryptographers, technical writers, and security researchers.

---

## ⚙️ Local Development Setup

### Prerequisites
Make sure your development machine has the following installed:
1. **Rust Toolchain**:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup target add wasm32-unknown-unknown
   ```
2. **Stellar CLI**:
   ```bash
   cargo install --locked stellar-cli --features opt
   ```
3. **Node.js & npm**:
   Node.js v18.0.0 or higher is required.

---

### Step-by-Step Environment Build

1. **Clone Workspace**:
   ```bash
   git clone https://github.com/stream-vault/soroban-streamguard.git
   cd soroban-streamguard
   ```

2. **Build Rust Smart Contracts**:
   ```bash
   cd contracts/stream-vault
   cargo test
   cargo build --target wasm32-unknown-unknown --release
   cd ../..
   ```

3. **Build SDK & CLI Modules**:
   ```bash
   # Build SDK
   cd sdk
   npm install
   npm run build
   cd ..

   # Build CLI
   cd cli
   npm install
   npm run build
   cd ..
   ```

4. **Launch Relayer & Frontend**:
   ```bash
   # Terminal 1: Launch Relayer Daemon
   cd relayer && npm install && npm run dev

   # Terminal 2: Launch Frontend Web App
   cd frontend && npm install && npm run dev
   ```

---

## 🎨 Code Standards & Guidelines

### Rust / Soroban Contracts
* Format code using standard `cargo fmt`.
* Ensure zero compiler warnings: `cargo clippy --all-targets`.
* Every public contract function MUST contain docstrings explaining parameters, panic conditions, and returned types.
* Enforce strict explicit storage access pattern checks (`DataKey`).

### TypeScript / Node (SDK, CLI, Relayer, Frontend)
* Use Strict TypeScript typing (avoid standard `any` usages).
* Format code using Prettier & ESLint conventions (`npm run lint`).
* Async error handling must explicitly catch and surface friendly RPC failure messages.

---

## 🔀 Pull Request (PR) Process

1. **Fork the Repository**: Create a topic branch off `main` (e.g., `feature/groth16-verifier` or `fix/nullifier-race`).
2. **Commit Message Format**: Use conventional commits style:
   * `feat(contract): add milestone unlock multiplier check`
   * `fix(relayer): resolve nullifier cache race condition`
   * `docs(api): update SDK function definitions`
3. **Run Verification**: Ensure all contract unit tests and package builds pass before submitting:
   ```bash
   cargo test --manifest-path contracts/stream-vault/Cargo.toml
   npm run build --prefix sdk
   npm run build --prefix cli
   ```
4. **Submit PR**: Open a Pull Request targeting the `main` branch. Provide a clear summary of changes, linked issues, and test verification output.

---

## 🎯 Priority Areas Needing Help

We are actively seeking contributions in the following specialized domain areas:

* 🔐 **Groth16 WASM Verifier**: Porting BN254 pairing operations to optimized WASM routines for Soroban.
* 🌐 **Decentralized Relayer Mesh**: Designing P2P relayer discovery and blind fee bidding mechanisms.
* 📱 **Mobile Wallet Adapters**: Adding native Freighter / Lobstr wallet deep-linking adapters for mobile Web3 apps.
* 📖 **Documentation & Translations**: Translating project documentation and API guides into Spanish, Portuguese, and Mandarin.

---

## 🛡️ Security & Disclosure

If you discover a security vulnerability or critical bug within the `stream-vault` smart contracts or cryptographic modules, **please do NOT submit a public issue**. 

Email our security team directly at `security@streamguard.io` or reach out privately on Discord. We operate a bug bounty program for eligible security disclosures.
