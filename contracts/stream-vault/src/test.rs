#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Bytes, BytesN, Env, Vec,
};

#[test]
fn test_stream_vault_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let employer = Address::generate(&env);
    let recipient_dest = Address::generate(&env);

    // Create mock SAC token contract
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin);
    let token_client = token::Client::new(&env, &token_contract.address());
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract.address());

    token_admin_client.mint(&employer, &1_000_000_000);

    let contract_id = env.register(StreamVaultContract, ());
    let client = StreamVaultContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    // Generate ZK commitment
    let salt = Bytes::from_slice(&env, &[1u8; 32]);
    let nullifier_seed = Bytes::from_slice(&env, &[2u8; 32]);
    let mut proof_bytes = Bytes::new(&env);
    proof_bytes.append(&salt);
    proof_bytes.append(&nullifier_seed);

    let comm_hash: BytesN<32> = env.crypto().sha256(&proof_bytes);
    let mut commitments = Vec::new(&env);
    commitments.push_back(comm_hash.clone());

    let now = 1000u64;
    env.ledger().set_timestamp(now);

    let stream_id = client.create_stream(
        &employer,
        &token_contract.address(),
        &commitments,
        &100, // 100 stroops per second
        &now,
        &(now + 3600),
        &true,
        &360_000,
    );

    assert_eq!(stream_id, 1);

    // Fast forward ledger time by 100 seconds
    env.ledger().set_timestamp(now + 100);

    let unlocked = client.calculate_unlocked_balance(&stream_id);
    assert_eq!(unlocked, 10_000); // 100 sec * 100 rate = 10,000

    // Add milestone lock
    let work_bytes = Bytes::from_slice(&env, b"git:commit:8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a");
    let work_hash: BytesN<32> = env.crypto().sha256(&work_bytes);

    client.add_milestone(&stream_id, &1, &50_000, &15000, &work_hash); // 1.5x speed boost + 50k bonus

    // Submit work proof
    let work_proof = WorkProof {
        milestone_id: 1,
        proof_bytes: work_bytes,
        work_hash: work_hash.clone(),
        attestation_signature: Bytes::from_slice(&env, b"sig_ok"),
    };

    let proof_res = client.submit_work_proof(&stream_id, &work_proof);
    assert!(proof_res);

    // Fast forward another 100 seconds (now rate is 150 per sec instead of 100)
    env.ledger().set_timestamp(now + 200);

    let unlocked_after_proof = client.calculate_unlocked_balance(&stream_id);
    // 200 sec elapsed * 150 current_rate + 50k milestone bonus = 30k + 50k = 80k
    assert_eq!(unlocked_after_proof, 80_000);

    // Perform shielded withdrawal
    let nullifier_bytes = BytesN::from_array(&env, &[9u8; 32]);
    let claim_payload = StealthClaimPayload {
        stream_id,
        commitment: comm_hash,
        nullifier: nullifier_bytes.clone(),
        claim_amount: 50_000,
        zk_proof: proof_bytes,
        destination_address: recipient_dest.clone(),
    };

    client.withdraw_shielded(&claim_payload);

    assert_eq!(token_client.balance(&recipient_dest), 50_000);

    let stream_state = client.get_stream(&stream_id);
    assert_eq!(stream_state.total_claimed, 50_000);
}
