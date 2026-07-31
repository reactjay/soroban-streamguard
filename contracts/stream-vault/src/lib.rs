#![no_std]
use soroban_sdk::{contract, contractimpl, token, Address, BytesN, Env, Vec, Symbol};

pub mod types;
pub mod verifier;

#[cfg(test)]
mod test;

use types::{DataKey, Milestone, StealthClaimPayload, Stream, WorkProof};
use verifier::Verifier;

#[contract]
pub struct StreamVaultContract;

#[contractimpl]
impl StreamVaultContract {
    /// Initialize the contract with an admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::StreamCount, &0u64);
    }

    /// Create a new streaming contract or Stealth Multi-Recipient Pool
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
    ) -> u64 {
        employer.require_auth();

        if start_time >= stop_time || base_rate_per_sec <= 0 || initial_deposit <= 0 {
            panic!("Invalid parameters");
        }

        // Transfer initial deposit tokens from employer to this contract
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&employer, &env.current_contract_address(), &initial_deposit);

        let count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::StreamCount)
            .unwrap_or(0);
        let stream_id = count + 1;

        let now = env.ledger().timestamp();
        let effective_start = if start_time < now { now } else { start_time };

        let stream = Stream {
            id: stream_id,
            employer,
            token,
            base_rate_per_sec,
            current_rate_per_sec: base_rate_per_sec,
            start_time: effective_start,
            stop_time,
            last_update_time: effective_start,
            total_deposited: initial_deposit,
            total_claimed: 0,
            is_active: true,
            is_stealth_pool,
            commitments,
            nullifiers: Vec::new(&env),
            milestones: Vec::new(&env),
        };

        env.storage().persistent().set(&DataKey::Stream(stream_id), &stream);
        env.storage().instance().set(&DataKey::StreamCount, &stream_id);

        env.events().publish(
            (Symbol::new(&env, "stream_created"), stream_id),
            (stream_id, is_stealth_pool, initial_deposit),
        );

        stream_id
    }

    /// Add a milestone lock to a stream
    pub fn add_milestone(
        env: Env,
        stream_id: u64,
        milestone_id: u32,
        unlocked_amount: i128,
        rate_multiplier_bp: u32,
        work_proof_hash: BytesN<32>,
    ) {
        let mut stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .expect("Stream not found");

        stream.employer.require_auth();

        let milestone = Milestone {
            id: milestone_id,
            work_proof_hash,
            unlocked_amount,
            rate_multiplier_bp,
            is_verified: false,
        };

        stream.milestones.push_back(milestone);
        env.storage().persistent().set(&DataKey::Stream(stream_id), &stream);
    }

    /// Submit ZK Work Proof to unlock milestone funds and accelerate streaming rate
    pub fn submit_work_proof(
        env: Env,
        stream_id: u64,
        work_proof: WorkProof,
    ) -> bool {
        let mut stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .expect("Stream not found");

        if !stream.is_active {
            panic!("Stream is inactive");
        }

        // Verify work proof via verifier
        let is_valid = Verifier::verify_work_proof(&env, &work_proof);
        if !is_valid {
            panic!("Invalid work proof");
        }

        let mut milestone_found = false;
        let mut new_milestones = Vec::new(&env);
        let mut rate_boost_bp = 10000u32;

        for milestone in stream.milestones.iter() {
            let mut m = milestone.clone();
            if m.id == work_proof.milestone_id && !m.is_verified {
                if m.work_proof_hash == work_proof.work_hash {
                    m.is_verified = true;
                    milestone_found = true;
                    rate_boost_bp = m.rate_multiplier_bp;
                }
            }
            new_milestones.push_back(m);
        }

        if !milestone_found {
            panic!("Milestone match failed");
        }

        stream.milestones = new_milestones;

        // Apply rate acceleration multiplier
        if rate_boost_bp > 10000 {
            let new_rate = (stream.base_rate_per_sec * rate_boost_bp as i128) / 10000i128;
            stream.current_rate_per_sec = new_rate;
        }

        stream.last_update_time = env.ledger().timestamp();
        env.storage().persistent().set(&DataKey::Stream(stream_id), &stream);

        env.events().publish(
            (Symbol::new(&env, "proof_verified"), stream_id),
            (work_proof.milestone_id, rate_boost_bp),
        );

        true
    }

    /// Execute shielded withdrawal using ZK proof and nullifier to prevent double-claiming
    pub fn withdraw_shielded(
        env: Env,
        payload: StealthClaimPayload,
    ) {
        let mut stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(payload.stream_id))
            .expect("Stream not found");

        if !stream.is_active {
            panic!("Stream inactive");
        }

        // 1. Verify Nullifier has NOT been used (Double-claim prevention)
        let nullifier_key = DataKey::NullifierUsed(payload.nullifier.clone());
        if env.storage().persistent().has(&nullifier_key) {
            panic!("Nullifier already spent (double claim attempt)");
        }

        // 2. Verify Commitment is in stream commitments list
        let mut commitment_valid = false;
        for comm in stream.commitments.iter() {
            if comm == payload.commitment {
                commitment_valid = true;
                break;
            }
        }
        if !commitment_valid {
            panic!("Invalid commitment");
        }

        // 3. Verify ZK Proof consistency
        let proof_ok = Verifier::verify_commitment_consistency(
            &env,
            &payload.commitment,
            &payload.zk_proof,
        );
        if !proof_ok {
            panic!("ZK proof validation failed");
        }

        // 4. Calculate available streaming liquidity
        let unlocked = Self::calculate_unlocked_balance(env.clone(), payload.stream_id);
        let available = unlocked - stream.total_claimed;

        if payload.claim_amount <= 0 || payload.claim_amount > available {
            panic!("Insufficient unlocked streaming balance");
        }

        // 5. Update nullifier and stream state
        env.storage().persistent().set(&nullifier_key, &true);
        stream.nullifiers.push_back(payload.nullifier.clone());
        stream.total_claimed += payload.claim_amount;
        stream.last_update_time = env.ledger().timestamp();
        env.storage().persistent().set(&DataKey::Stream(payload.stream_id), &stream);

        // 6. Transfer tokens to recipient's destination address (preserving stealth)
        let token_client = token::Client::new(&env, &stream.token);
        token_client.transfer(
            &env.current_contract_address(),
            &payload.destination_address,
            &payload.claim_amount,
        );

        env.events().publish(
            (Symbol::new(&env, "shielded_withdrawn"), payload.stream_id),
            (payload.claim_amount, payload.destination_address),
        );
    }

    /// Calculate unlocked streaming balance based on elapsed time and work proof bonuses
    pub fn calculate_unlocked_balance(env: Env, stream_id: u64) -> i128 {
        let stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .expect("Stream not found");

        let now = env.ledger().timestamp();

        if now <= stream.start_time {
            return 0;
        }

        let end = if now > stream.stop_time { stream.stop_time } else { now };
        let elapsed = (end - stream.start_time) as i128;

        let time_earned = elapsed * stream.current_rate_per_sec;

        // Add milestone unlocked bonuses
        let mut milestone_bonus = 0i128;
        for milestone in stream.milestones.iter() {
            if milestone.is_verified {
                milestone_bonus += milestone.unlocked_amount;
            }
        }

        let total_unlocked = time_earned + milestone_bonus;
        if total_unlocked > stream.total_deposited {
            stream.total_deposited
        } else {
            total_unlocked
        }
    }

    /// Query stream details
    pub fn get_stream(env: Env, stream_id: u64) -> Stream {
        env.storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .expect("Stream not found")
    }

    /// Employer can cancel stream and reclaim remaining unearned balance
    pub fn cancel_stream(env: Env, stream_id: u64) {
        let mut stream: Stream = env
            .storage()
            .persistent()
            .get(&DataKey::Stream(stream_id))
            .expect("Stream not found");

        stream.employer.require_auth();

        let unlocked = Self::calculate_unlocked_balance(env.clone(), stream_id);
        let unearned = stream.total_deposited - unlocked;

        stream.is_active = false;
        env.storage().persistent().set(&DataKey::Stream(stream_id), &stream);

        if unearned > 0 {
            let token_client = token::Client::new(&env, &stream.token);
            token_client.transfer(
                &env.current_contract_address(),
                &stream.employer,
                &unearned,
            );
        }
    }
}
