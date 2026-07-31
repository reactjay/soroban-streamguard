export interface AnchorInfo {
  homeDomain: string;
  assetCode: string;
  assetIssuer: string;
  offrampUrl: string;
}

export interface SEP24OfframpParams {
  assetCode: 'USDC' | 'EURC' | 'BRLA' | 'NGNC';
  amount: string;
  bankAccountIbanOrRouting: string;
  destinationCurrency: string;
  userPublicKey?: string; // Optional if using stealth relayer mode
}

export interface SEP24TransactionState {
  id: string;
  status: 'pending_user_transfer' | 'pending_anchor' | 'completed' | 'failed';
  interactiveUrl: string;
  anchorStellarAddress: string;
  memo: string;
  estimatedFiatPayout: string;
  feeAsset: string;
}

export class SEP24AnchorClient {
  private anchorDomain: string;

  constructor(anchorDomain: string = 'anchor.stellar.org') {
    this.anchorDomain = anchorDomain;
  }

  /**
   * Initialize SEP-24 Interactive Off-Ramp Flow
   */
  async initOfframp(params: SEP24OfframpParams): Promise<SEP24TransactionState> {
    const txId = 'sep24-tx-' + Math.random().toString(36).substring(2, 9);
    const mockAnchorAccount = 'GANKCHOR...STELLAR...POUT';
    const memo = Math.floor(100000 + Math.random() * 900000).toString();

    const fxRates: Record<string, number> = {
      'USDC_USD': 1.0,
      'USDC_EUR': 0.92,
      'EURC_EUR': 1.0,
      'BRLA_BRL': 5.50,
      'NGNC_NGN': 1500.0,
    };

    const rateKey = `${params.assetCode}_${params.destinationCurrency}`;
    const rate = fxRates[rateKey] || 1.0;
    const estimatedPayout = (parseFloat(params.amount) * rate * 0.995).toFixed(2);

    return {
      id: txId,
      status: 'pending_user_transfer',
      interactiveUrl: `https://${this.anchorDomain}/sep24/interactive?tx=${txId}&asset=${params.assetCode}&dest=${params.destinationCurrency}`,
      anchorStellarAddress: mockAnchorAccount,
      memo,
      estimatedFiatPayout: `${estimatedPayout} ${params.destinationCurrency}`,
      feeAsset: `0.5% ${params.assetCode}`,
    };
  }

  /**
   * Poll status of SEP-24 Anchor transaction
   */
  async checkTransactionStatus(txId: string): Promise<{ status: string; completedAt?: string }> {
    return {
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
  }
}
