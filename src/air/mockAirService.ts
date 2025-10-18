// src/air/mockAirService.ts

interface Credential {
  id: string;
  programId: string;
  schema: string;
  data: Record<string, any>;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  issuer: string;
}

interface VerificationProof {
  id: string;
  programId: string;
  credential: Credential;
  proof: string;
  timestamp: number;
  valid: boolean;
}

class MockAirService {
  private credentials: Map<string, Credential> = new Map();
  private user: any = null;
  private initialized = false;

  constructor() {
    // Load from localStorage
    const stored = localStorage.getItem('mockCredentials');
    if (stored) {
      try {
        const creds = JSON.parse(stored);
        creds.forEach((c: Credential) => this.credentials.set(c.id, c));
      } catch (e) {
        console.warn('Failed to load stored credentials:', e);
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('mockCredentials', JSON.stringify(Array.from(this.credentials.values())));
  }

  async init(config?: any): Promise<void> {
    console.log('🚀 Initializing Mock AIR Service...');
    // Minimal delay for hackathon demo - instant response
    await new Promise(resolve => setTimeout(resolve, 100));
    this.initialized = true;
    console.log('✅ Mock AIR Service Ready');
  }

  async login(): Promise<any> {
    console.log('🔐 Logging in...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.user = {
      id: 'user_' + Date.now(),
      email: 'demo@airgate.os',
      wallet: '0x' + Math.random().toString(36).substring(7)
    };
    console.log('✅ Login successful:', this.user);
    return this.user;
  }

  async logout(): Promise<void> {
    this.user = null;
    this.credentials.clear();
    localStorage.removeItem('mockCredentials');
  }

  async issueCredential(params: { programId: string; data?: any }): Promise<Credential> {
    console.log(`📝 Issuing credential for program: ${params.programId}`);
    
    // Simulate UI flow with delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create credential based on program type
    let schema = '';
    let data: any = {};
    
    if (params.programId.includes('c21s90g0pcu4m00C2599ez')) { // KYC_BASIC
      schema = 'KYC_BASIC';
      data = {
        isVerified: true,
        jurisdiction: params.data?.jurisdiction || 'UK',
        level: 'BASIC',
        firstName: 'Demo',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        nationalId: 'UK123456789'
      };
    } else if (params.programId.includes('c21s90g0pe1vl00d99732s')) { // WORK_HISTORY
      schema = 'WORK_HISTORY';
      data = {
        employer: 'TechCorp Industries',
        role: 'Senior Developer',
        yearsExperience: 5,
        verified: true,
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        startDate: '2019-03-01',
        endDate: '2024-10-01'
      };
    } else if (params.programId.includes('c21s90g0pf0lb00e8395zm')) { // FAN_BADGE
      schema = 'FAN_BADGE';
      data = {
        eventName: 'MetaVerse Concert 2024',
        tier: 'VIP',
        attended: true,
        xpPoints: 1500,
        artist: 'Digital Dreamz',
        venue: 'Virtual Arena',
        date: '2024-08-15'
      };
    }
    
    const credential: Credential = {
      id: `cred_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      programId: params.programId,
      schema,
      data,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      status: 'active',
      issuer: 'AIR Protocol Testnet'
    };
    
    this.credentials.set(credential.id, credential);
    this.saveToStorage();
    
    console.log('✅ Credential issued:', credential);
    return credential;
  }

  async createVerificationProof(params: { programId: string }): Promise<VerificationProof> {
    console.log(`🔍 Creating verification proof for: ${params.programId}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find matching credential
    const credential = Array.from(this.credentials.values())
      .find(c => c.programId === params.programId);
    
    if (!credential) {
      throw new Error(`No credential found for program ${params.programId}`);
    }
    
    const proof: VerificationProof = {
      id: `proof_${Date.now()}`,
      programId: params.programId,
      credential,
      proof: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      timestamp: Date.now(),
      valid: true
    };
    
    console.log('✅ Proof created:', proof);
    return proof;
  }

  async getCredentials(): Promise<Credential[]> {
    return Array.from(this.credentials.values());
  }

  async verifyProof(proof: VerificationProof): Promise<boolean> {
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 500));
    return proof.valid;
  }

  // Additional methods for compatibility
  async runFlow(params: any): Promise<any> {
    console.log('🚀 Running verification flow:', params);
    
    // Simulate the full flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      proofs: await Promise.all(
        params.requiredCredentials?.map((cred: any) => 
          this.createVerificationProof({ programId: cred.programId })
        ) || []
      ),
      user: this.user,
      timestamp: Date.now()
    };
  }

  // Check if user has specific credential
  hasCredential(programId: string): boolean {
    return Array.from(this.credentials.values())
      .some(c => c.programId === programId && c.status === 'active');
  }

  // Get credential statistics
  getStats() {
    const total = this.credentials.size;
    const active = Array.from(this.credentials.values())
      .filter(c => c.status === 'active').length;
    
    return {
      totalCredentials: total,
      activeCredentials: active,
      verificationsCount: Math.floor(Math.random() * 1000) + 500,
      gasSaved: '$' + (Math.random() * 1000 + 200).toFixed(2),
      privacyScore: Math.floor(Math.random() * 20) + 80 + '%'
    };
  }
}

// Export singleton instance
export const mockAirService = new MockAirService();
export type { Credential, VerificationProof };

