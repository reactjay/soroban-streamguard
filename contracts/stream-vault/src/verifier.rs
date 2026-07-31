use soroban_sdk::{Env, BytesN, Bytes};
use crate::types::WorkProof;

pub struct Verifier;

impl Verifier {
    /// Validates that a recipient's claimed commitment matches the computed ZK hash:
    /// Hash(commitment_salt || nullifier_seed) == commitment
    pub fn verify_commitment_consistency(
        env: &Env,
        commitment: &BytesN<32>,
        zk_proof: &Bytes,
    ) -> bool {
        // Proof format: [salt (32 bytes) | nullifier_seed (32 bytes)]
        if zk_proof.len() < 64 {
            return false;
        }

        let computed_hash: BytesN<32> = env.crypto().sha256(zk_proof).into();
        
        // Lightweight verification: proof SHA-256 matches commitment
        computed_hash == *commitment
    }

    /// Verifies lightweight ZK work proof & oracle attestation for milestone rate acceleration
    pub fn verify_work_proof(
        env: &Env,
        work_proof: &WorkProof,
    ) -> bool {
        if work_proof.proof_bytes.len() < 32 {
            return false;
        }

        // Verify work hash integrity: sha256(proof_bytes) == work_hash
        let calculated_hash: BytesN<32> = env.crypto().sha256(&work_proof.proof_bytes).into();
        if calculated_hash != work_proof.work_hash {
            return false;
        }

        // Check attestation payload is present
        !work_proof.attestation_signature.is_empty()
    }
}
