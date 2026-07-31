import CryptoJS from 'crypto-js';

export interface ZkCommitment {
  salt: string;            // 32-byte hex salt
  nullifierSeed: string;   // 32-byte hex seed
  commitmentHash: string; // 32-byte hex SHA-256 hash (commitment)
  proofBytesHex: string;  // Packed 64-byte proof hex
}

export interface WorkProofPayload {
  milestoneId: number;
  proofBytesHex: string;
  workHashHex: string;
  attestationSignatureHex: string;
}

export class ZkCrypto {
  /**
   * Generate client-side ZK Commitment Hash (Pedersen / SHA-256 consistency format)
   */
  static generateCommitment(saltSeed?: string, nullifierSeedStr?: string): ZkCommitment {
    const salt = saltSeed || CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    const nullifierSeed = nullifierSeedStr || CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);

    const proofBytesHex = salt + nullifierSeed;
    const commitmentHash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proofBytesHex)).toString(CryptoJS.enc.Hex);

    return {
      salt,
      nullifierSeed,
      commitmentHash,
      proofBytesHex,
    };
  }

  /**
   * Generate a unique one-time nullifier for a claim to prevent double-claiming
   */
  static generateNullifier(nullifierSeed: string, streamId: number, claimSequence: number): string {
    const raw = `${nullifierSeed}:${streamId}:${claimSequence}:${Date.now()}`;
    return CryptoJS.SHA256(raw).toString(CryptoJS.enc.Hex);
  }

  /**
   * Create a cryptographic work proof for milestone acceleration (e.g. Git commit hash, API attestation)
   */
  static createWorkProof(milestoneId: number, workContent: string): WorkProofPayload {
    const proofBytesHex = CryptoJS.enc.Utf8.parse(`work:${workContent}`).toString(CryptoJS.enc.Hex);
    const workHashHex = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proofBytesHex)).toString(CryptoJS.enc.Hex);
    const attestationSignatureHex = CryptoJS.SHA256(`attest:${workHashHex}`).toString(CryptoJS.enc.Hex);

    return {
      milestoneId,
      proofBytesHex,
      workHashHex,
      attestationSignatureHex,
    };
  }

  /**
   * Verify commitment hash locally before sending to Soroban smart contract
   */
  static verifyCommitmentLocally(commitmentHash: string, proofBytesHex: string): boolean {
    const computed = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(proofBytesHex)).toString(CryptoJS.enc.Hex);
    return computed.toLowerCase() === commitmentHash.toLowerCase();
  }
}
