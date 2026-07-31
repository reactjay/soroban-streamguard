use soroban_sdk::{contracttype, Address, Bytes, BytesN, Vec};

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Milestone {
    pub id: u32,
    pub work_proof_hash: BytesN<32>,
    pub unlocked_amount: i128,
    pub rate_multiplier_bp: u32, // Basis points (10000 = 1.0x, 15000 = 1.5x)
    pub is_verified: bool,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct WorkProof {
    pub milestone_id: u32,
    pub proof_bytes: Bytes,
    pub work_hash: BytesN<32>,
    pub attestation_signature: Bytes,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct StealthClaimPayload {
    pub stream_id: u64,
    pub commitment: BytesN<32>,
    pub nullifier: BytesN<32>,
    pub claim_amount: i128,
    pub zk_proof: Bytes,
    pub destination_address: Address,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
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

#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum DataKey {
    Admin,
    StreamCount,
    Stream(u64),
    NullifierUsed(BytesN<32>),
}
