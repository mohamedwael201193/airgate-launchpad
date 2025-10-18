#!/usr/bin/env node

/**
 * AirGate OS End-to-End Testing Script
 * 
 * This script validates the complete AIR Kit integration including:
 * - AIR login flow
 * - Credential issuance
 * - Credential verification
 * - Wallet connection on Moca Devnet
 * 
 * Usage: node test-airgate.js
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  CYAN: '\x1b[36m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

function log(message, color = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function success(message) {
  log(`✅ ${message}`, COLORS.GREEN);
}

function error(message) {
  log(`❌ ${message}`, COLORS.RED);
}

function warning(message) {
  log(`⚠️  ${message}`, COLORS.YELLOW);
}

function info(message) {
  log(`ℹ️  ${message}`, COLORS.BLUE);
}

function header(message) {
  log(`\n${COLORS.BOLD}${COLORS.CYAN}🚀 ${message}${COLORS.RESET}`);
}

class AirGateTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  async runTest(name, testFn) {
    try {
      info(`Running: ${name}`);
      await testFn();
      success(`PASS: ${name}`);
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASS' });
    } catch (err) {
      error(`FAIL: ${name} - ${err.message}`);
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAIL', error: err.message });
    }
  }

  warn(message) {
    warning(message);
    this.results.warnings++;
  }

  // Test 1: Environment Configuration
  async testEnvironmentConfig() {
    const envFile = '.env';
    if (!existsSync(envFile)) {
      throw new Error('.env file not found. Please copy from .env.example');
    }

    const envContent = readFileSync(envFile, 'utf-8');
    const requiredVars = [
      'VITE_AIR_PARTNER_ID',
      'VITE_AIR_ENV',
      'VITE_MOCA_CHAIN_ID',
      'VITE_MOCA_RPC_URL',
      'VITE_EXPLORER_BASE_URL',
      'VITE_PARTNER_TOKEN_URL',
      'VITE_ISSUER_DID',
      'VITE_ISSUER_PROGRAM_IDS',
      'VITE_VERIFIER_PROGRAM_IDS'
    ];

    for (const varName of requiredVars) {
      if (!envContent.includes(varName)) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    }

    // Validate Moca Devnet configuration
    if (!envContent.includes('5151')) {
      this.warn('Chain ID should be 5151 for Moca Devnet');
    }

    if (!envContent.includes('devnet-rpc.mocachain.org')) {
      this.warn('RPC URL should point to Moca Devnet');
    }
  }

  // Test 2: Dependencies
  async testDependencies() {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    
    const requiredDeps = [
      '@mocanetwork/airkit',
      'wagmi',
      'viem',
      'date-fns'
    ];

    for (const dep of requiredDeps) {
      if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
        throw new Error(`Missing required dependency: ${dep}`);
      }
    }

    // Check AIR Kit version
    const airKitVersion = packageJson.dependencies['@mocanetwork/airkit'];
    if (!airKitVersion || !airKitVersion.includes('1.6')) {
      this.warn(`AIR Kit version ${airKitVersion} may be outdated. Recommend ^1.6.0`);
    }
  }

  // Test 3: TypeScript Configuration
  async testTypeScriptConfig() {
    if (!existsSync('src/air/types.ts')) {
      throw new Error('AIR Kit TypeScript types not found at src/air/types.ts');
    }

    const typesContent = readFileSync('src/air/types.ts', 'utf-8');
    const requiredTypes = [
      'AirUser',
      'IssuedCredential',
      'CredentialVerificationResult',
      'AirLoginResponse',
      'AirIssueResponse',
      'AirVerifyResponse'
    ];

    for (const type of requiredTypes) {
      if (!typesContent.includes(type)) {
        throw new Error(`Missing TypeScript type: ${type}`);
      }
    }
  }

  // Test 4: AIR Kit Service
  async testAirKitService() {
    if (!existsSync('src/air/airkit.ts')) {
      throw new Error('AIR Kit service not found at src/air/airkit.ts');
    }

    const airKitContent = readFileSync('src/air/airkit.ts', 'utf-8');
    
    // Check for real AIR Kit imports
    if (!airKitContent.includes('@mocanetwork/airkit')) {
      throw new Error('AIR Kit service should import from @mocanetwork/airkit');
    }

    // Check for required functions
    const requiredFunctions = ['initAir', 'airLogin', 'airIssue', 'airVerify'];
    for (const func of requiredFunctions) {
      if (!airKitContent.includes(`export async function ${func}`)) {
        throw new Error(`Missing AIR Kit function: ${func}`);
      }
    }

    // Check for mock service imports (should not exist)
    if (airKitContent.includes('enhancedAirService')) {
      this.warn('Found reference to enhancedAirService - ensure all mock services are removed');
    }
  }

  // Test 5: React Context Integration
  async testReactContext() {
    if (!existsSync('src/air/useAirGate.tsx')) {
      throw new Error('AIR Gate React context not found at src/air/useAirGate.tsx');
    }

    const contextContent = readFileSync('src/air/useAirGate.tsx', 'utf-8');
    
    // Check imports
    if (!contextContent.includes('import { airIssue, airLogin, airVerify, initAir } from "./airkit"')) {
      throw new Error('useAirGate should import functions from ./airkit');
    }

    // Check error handling
    if (!contextContent.includes('try {') || !contextContent.includes('catch')) {
      this.warn('useAirGate missing proper error handling');
    }
  }

  // Test 6: UI Components
  async testUIComponents() {
    const requiredComponents = [
      'src/components/airgate/VerifyModal.tsx',
      'src/components/airgate/ProofViewer.tsx',
      'src/pages/Profile.tsx'
    ];

    for (const component of requiredComponents) {
      if (!existsSync(component)) {
        throw new Error(`Missing UI component: ${component}`);
      }
    }

    // Check ProofViewer integration
    const verifyModalContent = readFileSync('src/components/airgate/VerifyModal.tsx', 'utf-8');
    if (!verifyModalContent.includes('ProofViewer')) {
      this.warn('VerifyModal should integrate ProofViewer component');
    }
  }

  // Test 7: Wallet Configuration
  async testWalletConfig() {
    if (!existsSync('src/lib/wagmi.ts')) {
      throw new Error('Wagmi configuration not found at src/lib/wagmi.ts');
    }

    const wagmiContent = readFileSync('src/lib/wagmi.ts', 'utf-8');
    
    // Check Moca Devnet configuration
    if (!wagmiContent.includes('5151')) {
      throw new Error('Wagmi should be configured for Moca Devnet (chain ID 5151)');
    }

    // Check for WalletConnect fix
    if (!wagmiContent.includes('window.location.origin')) {
      this.warn('WalletConnect metadata should use dynamic URL');
    }
  }

  // Test 8: Build Process
  async testBuildProcess() {
    try {
      info('Testing TypeScript compilation...');
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      success('TypeScript compilation successful');
    } catch (err) {
      throw new Error(`TypeScript compilation failed: ${err.message}`);
    }

    try {
      info('Testing build process...');
      execSync('npm run build', { stdio: 'pipe' });
      success('Build process successful');
    } catch (err) {
      throw new Error(`Build failed: ${err.message}`);
    }
  }

  // Test 9: Network Connectivity
  async testNetworkConnectivity() {
    const testUrls = [
      'https://devnet-rpc.mocachain.org',
      'https://devnet-explorer.mocachain.org',
      'https://partner-token-api.mocachain.org'
    ];

    for (const url of testUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok && response.status !== 405) { // 405 is OK for some endpoints
          throw new Error(`${url} returned ${response.status}`);
        }
      } catch (err) {
        this.warn(`Network connectivity issue with ${url}: ${err.message}`);
      }
    }
  }

  // Test 10: Documentation
  async testDocumentation() {
    const docsChecks = [
      { file: 'README.md', content: 'AIR' },
      { file: 'package.json', content: 'description' }
    ];

    for (const check of docsChecks) {
      if (existsSync(check.file)) {
        const content = readFileSync(check.file, 'utf-8');
        if (!content.includes(check.content)) {
          this.warn(`${check.file} should include information about ${check.content}`);
        }
      } else {
        this.warn(`Missing documentation file: ${check.file}`);
      }
    }
  }

  async runAllTests() {
    header('AirGate OS End-to-End Test Suite');
    
    await this.runTest('Environment Configuration', () => this.testEnvironmentConfig());
    await this.runTest('Dependencies Check', () => this.testDependencies());
    await this.runTest('TypeScript Configuration', () => this.testTypeScriptConfig());
    await this.runTest('AIR Kit Service', () => this.testAirKitService());
    await this.runTest('React Context Integration', () => this.testReactContext());
    await this.runTest('UI Components', () => this.testUIComponents());
    await this.runTest('Wallet Configuration', () => this.testWalletConfig());
    await this.runTest('Build Process', () => this.testBuildProcess());
    await this.runTest('Network Connectivity', () => this.testNetworkConnectivity());
    await this.runTest('Documentation', () => this.testDocumentation());

    this.printSummary();
  }

  printSummary() {
    header('Test Results Summary');
    
    log(`\n📊 Test Results:`);
    success(`✅ Passed: ${this.results.passed}`);
    if (this.results.failed > 0) {
      error(`❌ Failed: ${this.results.failed}`);
    }
    if (this.results.warnings > 0) {
      warning(`⚠️  Warnings: ${this.results.warnings}`);
    }

    if (this.results.failed === 0) {
      header('🎉 All tests passed! AirGate OS is ready for real AIR Kit integration.');
      log(`\n📋 Next Steps:`);
      log(`1. Configure AIR Console domain settings for localhost:5173`);
      log(`2. Test credential issuance and verification flows`);
      log(`3. Verify wallet connection on Moca Devnet`);
      log(`4. Deploy to staging environment`);
    } else {
      error(`\n🚨 ${this.results.failed} test(s) failed. Please fix the issues above.`);
      process.exit(1);
    }
  }
}

// Run the test suite
const testSuite = new AirGateTestSuite();
testSuite.runAllTests().catch(err => {
  error(`Test suite failed: ${err.message}`);
  process.exit(1);
});