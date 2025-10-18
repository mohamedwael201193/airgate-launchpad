import { encodePacked, keccak256, toHex } from 'viem';
import { getEnv } from "./env";
import { getIssuerId } from "./programs";

interface Credential {
  id: string;
  programId: string;
  schema: string;
  data: Record<string, any>;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  issuer: string;
  txHash?: string;
  merkleRoot?: string;
  nullifierHash?: string;
}

interface VerificationProof {
  id: string;
  verifierProgramId: string;
  issuerProgramId: string;
  credentialId: string;
  zkProof: {
    nullifier: string;
    commitment: string;
    merkleProof: string[];
    publicInputs: string[];
    proof: string;
  };
  timestamp: number;
  valid: boolean;
  privacyScore: number;
  gasSaved: string;
}

interface ZKProofData {
  nullifier: string;
  commitment: string;
  merkleProof: string[];
  publicInputs: string[];
  proof: string;
}

class EnhancedAirService {
  private credentials: Map<string, Credential> = new Map();
  private user: any = null;
  private initialized = false;
  
  // Program ID mapping: verifier -> issuer
  private verifierToIssuerMap: Map<string, string> = new Map();
  
  constructor() {
    this.setupProgramMapping();
    this.loadStoredCredentials();
  }

  private setupProgramMapping() {
    try {
      const { VITE_ISSUER_PROGRAM_IDS, VITE_VERIFIER_PROGRAM_IDS } = getEnv();
      
      // Environment variables are already parsed by Zod in env.ts
      const issuerPrograms = VITE_ISSUER_PROGRAM_IDS;
      const verifierPrograms = VITE_VERIFIER_PROGRAM_IDS;
      
      // Map verifier programs to corresponding issuer programs
      this.verifierToIssuerMap.set(verifierPrograms.DEFI_JOB_GATE_KYC, issuerPrograms.KYC_BASIC);
      this.verifierToIssuerMap.set(verifierPrograms.DEFI_JOB_GATE_WORK, issuerPrograms.WORK_HISTORY);
      this.verifierToIssuerMap.set(verifierPrograms.FAN_VIP_GATE, issuerPrograms.FAN_BADGE);
      this.verifierToIssuerMap.set(verifierPrograms.TRADER_TIER_GATE, issuerPrograms.KYC_BASIC);
      
      console.log('📋 Program ID Mapping:', Object.fromEntries(this.verifierToIssuerMap));
    } catch (error) {
      console.warn('⚠️ Could not setup program mapping, using fallback:', error);
      // Fallback mapping in case environment parsing fails
      this.setupFallbackMapping();
    }
  }

  private setupFallbackMapping() {
    // Fallback program IDs if environment parsing fails
    this.verifierToIssuerMap.set('c21s9030ptsdv004534lxx', 'c21s90g0pcu4m00C2599ez'); // DEFI_JOB_GATE_KYC -> KYC_BASIC
    this.verifierToIssuerMap.set('c21s9030qfcmm005534IFW', 'c21s90g0pe1vl00d99732s'); // DEFI_JOB_GATE_WORK -> WORK_HISTORY
    this.verifierToIssuerMap.set('c21s9030qlq2y0065341JX', 'c21s90g0pf0lb00e8395zm'); // FAN_VIP_GATE -> FAN_BADGE
    this.verifierToIssuerMap.set('c21s9030qnpvw0075341e7', 'c21s90g0pcu4m00C2599ez'); // TRADER_TIER_GATE -> KYC_BASIC
    
    console.log('📋 Using fallback Program ID Mapping:', Object.fromEntries(this.verifierToIssuerMap));
  }

  private loadStoredCredentials() {
    const stored = localStorage.getItem('enhancedCredentials');
    if (stored) {
      try {
        const creds = JSON.parse(stored);
        creds.forEach((c: Credential) => this.credentials.set(c.id, c));
        console.log(`📚 Loaded ${creds.length} stored credentials`);
      } catch (e) {
        console.warn('Failed to load stored credentials:', e);
      }
    }
  }

  private saveToStorage() {
    const credsArray = Array.from(this.credentials.values());
    localStorage.setItem('enhancedCredentials', JSON.stringify(credsArray));
    localStorage.setItem('enhancedStats', JSON.stringify(this.getStats()));
  }

  async init(config?: any): Promise<void> {
    console.log('🚀 Initializing Enhanced AIR Service...');
    console.log('🔧 Config:', config);
    
    // Minimal delay for demo
    await new Promise(resolve => setTimeout(resolve, 100));
    this.initialized = true;
    console.log('✅ Enhanced AIR Service Ready');
  }

  async login(): Promise<any> {
    console.log('🔐 Enhanced login with wallet connection...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.user = {
      id: `user_${Date.now()}`,
      email: 'demo@airgate.os',
      wallet: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      chainId: 5151,
      network: 'moca-devnet'
    };
    
    console.log('✅ Enhanced login successful:', this.user);
    return this.user;
  }

  async logout(): Promise<void> {
    this.user = null;
    // Keep credentials for demo purposes
    console.log('🚪 Logged out but kept credentials for demo');
  }

  async issueCredential(params: { programId: string; data?: any }): Promise<Credential> {
    console.log(`📝 Issuing enhanced credential for program: ${params.programId}`);
    
    // Simulate realistic issuance time
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Generate cryptographic elements
    const nullifierSeed = this.generateRandomHex(32);
    const commitment = this.generateCommitment(params.data || {}, nullifierSeed);
    const merkleRoot = this.generateMerkleRoot();
    
    // Create enhanced credential with crypto elements
    let schema = '';
    let data: any = {};
    
    // Try to detect credential type by program ID or fallback to content-based detection
    try {
      const kycId = getIssuerId("KYC_BASIC");
      const workId = getIssuerId("WORK_HISTORY");
      const fanId = getIssuerId("FAN_BADGE");
      
      if (params.programId === kycId || params.programId.includes('c21s90g0pcu4m00C2599ez')) {
        schema = 'KYC_BASIC';
        data = {
          isVerified: true,
          jurisdiction: params.data?.jurisdiction || 'UK',
          level: 'BASIC',
          firstName: 'Demo',
          lastName: 'User',
          dateOfBirth: '1990-01-01',
          nationalId: 'UK123456789',
          verificationScore: 98,
          ...params.data
        };
      } else if (params.programId === workId || params.programId.includes('c21s90g0pe1vl00d99732s')) {
        schema = 'WORK_HISTORY';
        data = {
          employer: 'TechCorp Industries',
          role: 'Senior Developer',
          yearsExperience: 5,
          verified: true,
          skills: ['JavaScript', 'TypeScript', 'React', 'Solidity'],
          startDate: '2019-03-01',
          endDate: '2024-10-01',
          salaryRange: '100k-150k',
          performanceRating: 'Excellent',
          ...params.data
        };
      } else if (params.programId === fanId || params.programId.includes('c21s90g0pf0lb00e8395zm')) {
        schema = 'FAN_BADGE';
        data = {
          eventName: 'MetaVerse Concert 2024',
          tier: 'VIP',
          attended: true,
          xpPoints: 1500,
          artist: 'Digital Dreamz',
          venue: 'Virtual Arena',
          date: '2024-08-15',
          ticketPrice: '$150',
          merchandise: ['T-Shirt', 'Poster'],
          ...params.data
        };
      } else {
        // Default fallback
        schema = 'UNKNOWN';
        data = { ...params.data };
      }
    } catch (error) {
      console.warn('⚠️ Error detecting credential type, using fallback:', error);
      schema = 'FALLBACK';
      data = { ...params.data };
    }
    
    const credential: Credential = {
      id: `cred_${Date.now()}_${this.generateRandomHex(8)}`,
      programId: params.programId,
      schema,
      data,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      issuer: 'AIR Protocol Enhanced Service',
      txHash: `0x${this.generateRandomHex(64)}`,
      merkleRoot,
      nullifierHash: this.generateNullifier(nullifierSeed, params.programId),
    };
    
    this.credentials.set(credential.id, credential);
    this.saveToStorage();
    
    console.log('✅ Enhanced credential issued:', credential);
    return credential;
  }

  async createVerificationProof(params: { programId: string }): Promise<VerificationProof> {
    console.log(`🔍 Creating enhanced ZK proof for verifier: ${params.programId}`);
    
    // Find corresponding issuer program
    let issuerProgramId = this.verifierToIssuerMap.get(params.programId);
    
    // If no mapping found, try to find credential by partial match or use the programId directly
    if (!issuerProgramId) {
      console.warn(`⚠️ No mapping found for verifier program ${params.programId}, trying direct match`);
      // Try to find any credential that might work
      const availableCredential = Array.from(this.credentials.values())[0];
      if (availableCredential) {
        issuerProgramId = availableCredential.programId;
        console.log(`🔄 Using available credential program: ${issuerProgramId}`);
      } else {
        throw new Error(`No mapping found for verifier program ${params.programId} and no available credentials`);
      }
    }
    
    // Find credential with matching issuer program
    const credential = Array.from(this.credentials.values())
      .find(c => c.programId === issuerProgramId);
    
    if (!credential) {
      throw new Error(`No credential found for issuer program ${issuerProgramId}. Please issue the required credential first.`);
    }
    
    // Simulate ZK proof generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate ZK proof
    const zkProof = await this.generateZKProof(credential, params.programId);
    const privacyScore = this.calculatePrivacyScore(credential, zkProof);
    const gasSaved = this.calculateGasSaved(credential);
    
    const proof: VerificationProof = {
      id: `proof_${Date.now()}_${this.generateRandomHex(8)}`,
      verifierProgramId: params.programId,
      issuerProgramId,
      credentialId: credential.id,
      zkProof,
      timestamp: Date.now(),
      valid: true,
      privacyScore,
      gasSaved,
    };
    
    console.log('✅ Enhanced ZK proof created:', proof);
    return proof;
  }

  private async generateZKProof(credential: Credential, verifierProgramId: string): Promise<ZKProofData> {
    // Generate realistic ZK proof components
    const nullifier = this.generateNullifier(credential.nullifierHash || '', verifierProgramId);
    const commitment = this.generateCommitment(credential.data, credential.id);
    const merkleProof = this.generateMerkleProof();
    const publicInputs = this.extractPublicInputs(credential, verifierProgramId);
    const proof = this.generateSNARKProof();
    
    return {
      nullifier,
      commitment,
      merkleProof,
      publicInputs,
      proof,
    };
  }

  private generateNullifier(secret: string, externalNullifier: string): string {
    return keccak256(encodePacked(['string', 'string'], [secret, externalNullifier]));
  }

  private generateCommitment(data: any, nonce: string): string {
    const dataHash = keccak256(encodePacked(['string'], [JSON.stringify(data)]));
    return keccak256(encodePacked(['bytes32', 'string'], [dataHash, nonce]));
  }

  private generateMerkleRoot(): string {
    return `0x${this.generateRandomHex(64)}`;
  }

  private generateMerkleProof(): string[] {
    // Generate realistic merkle proof path
    const depth = 20; // Typical merkle tree depth
    const proof: string[] = [];
    for (let i = 0; i < depth; i++) {
      proof.push(`0x${this.generateRandomHex(64)}`);
    }
    return proof;
  }

  private extractPublicInputs(credential: Credential, verifierProgramId: string): string[] {
    // Extract only necessary public inputs based on verifier requirements
    const inputs: string[] = [];
    
    // Common inputs
    inputs.push(toHex(Date.now())); // Timestamp
    inputs.push(verifierProgramId); // Verifier program ID
    
    // Credential-specific public inputs (minimal for privacy)
    if (credential.schema === 'KYC_BASIC') {
      inputs.push(toHex(credential.data.jurisdiction === 'UK' ? 1 : 0)); // Jurisdiction check
      inputs.push(toHex(credential.data.isVerified ? 1 : 0)); // Verification status
    } else if (credential.schema === 'WORK_HISTORY') {
      inputs.push(toHex(credential.data.yearsExperience >= 2 ? 1 : 0)); // Experience threshold
      inputs.push(toHex(credential.data.verified ? 1 : 0)); // Verification status
    } else if (credential.schema === 'FAN_BADGE') {
      inputs.push(toHex(credential.data.tier === 'VIP' ? 1 : 0)); // VIP status
      inputs.push(toHex(credential.data.attended ? 1 : 0)); // Attendance proof
    }
    
    return inputs;
  }

  private generateSNARKProof(): string {
    // Generate realistic SNARK proof structure
    return JSON.stringify({
      pi_a: [`0x${this.generateRandomHex(64)}`, `0x${this.generateRandomHex(64)}`],
      pi_b: [
        [`0x${this.generateRandomHex(64)}`, `0x${this.generateRandomHex(64)}`],
        [`0x${this.generateRandomHex(64)}`, `0x${this.generateRandomHex(64)}`]
      ],
      pi_c: [`0x${this.generateRandomHex(64)}`, `0x${this.generateRandomHex(64)}`],
      protocol: 'groth16',
      curve: 'bn128'
    });
  }

  private calculatePrivacyScore(credential: Credential, zkProof: ZKProofData): number {
    // Calculate privacy score based on data minimization
    const totalFields = Object.keys(credential.data).length;
    const publicFields = zkProof.publicInputs.length - 2; // Subtract timestamp and program ID
    const privacyRatio = 1 - (publicFields / totalFields);
    
    // Score out of 100, with bonus for ZK proofs
    const baseScore = Math.max(70, privacyRatio * 100);
    const zkBonus = 15; // Bonus for using ZK proofs
    
    return Math.min(100, Math.round(baseScore + zkBonus));
  }

  private calculateGasSaved(credential: Credential): string {
    // Calculate gas savings vs traditional verification
    const traditionalGas = 150000; // Typical gas for on-chain verification
    const zkGas = 25000; // Gas for ZK proof verification
    const gasSaved = traditionalGas - zkGas;
    const gasPrice = 20; // Gwei
    const ethPrice = 2500; // USD
    
    const savedUSD = (gasSaved * gasPrice * ethPrice) / 1e18;
    return `$${savedUSD.toFixed(4)}`;
  }

  private generateRandomHex(length: number): string {
    return Array(length).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  // Public methods for compatibility
  async getCredentials(): Promise<Credential[]> {
    return Array.from(this.credentials.values());
  }

  async verifyProof(proof: VerificationProof): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return proof.valid && proof.privacyScore >= 70;
  }

  hasCredential(programId: string): boolean {
    return Array.from(this.credentials.values())
      .some(c => c.programId === programId && c.status === 'active');
  }

  getStats() {
    const credentials = Array.from(this.credentials.values());
    const active = credentials.filter(c => c.status === 'active').length;
    
    // More realistic statistics
    const baseVerifications = 2847;
    const userMultiplier = Math.max(1, active * 127);
    const totalVerifications = baseVerifications + userMultiplier;
    
    const baseSavings = 8420.50;
    const userSavings = active * 23.75;
    const totalSavings = baseSavings + userSavings;
    
    return {
      totalCredentials: credentials.length,
      activeCredentials: active,
      verificationsCount: totalVerifications.toLocaleString(),
      gasSaved: `$${totalSavings.toFixed(2)}`,
      privacyScore: `${Math.min(95, 78 + active * 3)}%`,
      zkProofsGenerated: Math.floor(totalVerifications * 0.8),
      gasEfficiency: `${Math.min(98, 85 + active * 2)}%`,
      networkHealth: 'Optimal',
    };
  }

  // Additional method for runFlow compatibility
  async runFlow(params: any): Promise<any> {
    console.log('🚀 Running enhanced verification flow:', params);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      proofs: await Promise.all(
        params.requiredCredentials?.map((cred: any) => 
          this.createVerificationProof({ programId: cred.programId })
        ) || []
      ),
      user: this.user,
      timestamp: Date.now(),
      enhanced: true,
    };
  }
}

// Export singleton instance
export const enhancedAirService = new EnhancedAirService();
export type { Credential, VerificationProof, ZKProofData };

