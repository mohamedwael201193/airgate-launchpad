# 🛡️ AirGate OS Integration Guide

## 📋 Overview

AirGate OS implements a complete credential verification system using the AirKit SDK. This document covers the setup and testing procedures for both local development and production deployment.

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment**

- Copy `.env.example` to `.env`
- Environment variables are already configured for testnet

3. **Start Development Server**

```bash
npm run dev
```

4. **Open Application**

- Local: http://lvh.me:5173
- Production: https://airgate-os.vercel.app

## 🔧 Environment Configuration

### Required Environment Variables

#### Website (airgate-os)

```env
VITE_AIR_PARTNER_ID=0b2c97d1-2c97-43cc-adce-617e6ab3327f
VITE_AIR_ENV=testnet
VITE_MOCA_CHAIN_ID=5151
VITE_MOCA_RPC_URL=https://devnet-rpc.mocachain.org
VITE_EXPLORER_BASE_URL=https://devnet-scan.mocachain.tech
VITE_PARTNER_TOKEN_URL=https://airgate-keys.vercel.app/api/partner-token
VITE_ISSUER_PROGRAM_IDS={"KYC_BASIC":"c21s90g0pcu4m00C2599ez","WORK_HISTORY":"c21s90g0pe1vl00d99732s","FAN_BADGE":"c21s90g0pf0lb00e8395zm"}
VITE_VERIFIER_PROGRAM_IDS={"DEFI_JOB_GATE_KYC":"c21s9030ptsdv004534lxx","DEFI_JOB_GATE_WORK":"c21s9030qfcmm005534IFW","FAN_VIP_GATE":"c21s9030qlq2y0065341JX","TRADER_TIER_GATE":"c21s9030qnpvw0075341e7"}
VITE_AIRGATE_BRAND=AirGate OS
VITE_AIRGATE_CONTACT_EMAIL=mohamedwael2001193@gmail.com
VITE_AIRGATE_DEMOS_ENABLED=true
```

#### Keys Server (airgate-keys)

```env
AIR_PARTNER_PRIVATE_KEY_PEM=-----BEGIN PRIVATE KEY----- ...
AIR_PARTNER_JWKS_JSON={"keys":[{"kty":"RSA","use":"sig"...}]}
AIR_PARTNER_KID=air-key-1
AIR_PARTNER_ISS=https://airgate-keys.vercel.app
AIR_PARTNER_AUD=airkit
CORS_ALLOWED_ORIGINS=https://airgate-os.vercel.app,http://lvh.me:5173
AIR_PARTNER_ID=0b2c97d1-2c97-43cc-adce-617e6ab3327f
PARTNER_TOKEN_TTL_SECONDS=300
JWKS_MAX_AGE_SECONDS=600
LOG_LEVEL=info
```

## 🎯 Demo Scenarios

### 1. DeFi Job Gate

**Requirements**: KYC verification + Work history
**Flow**: Issues KYC_BASIC and WORK_HISTORY credentials → Creates dual verification proofs
**Use Case**: Employment verification for DeFi positions

### 2. Fan VIP Gate

**Requirements**: Fan badge credential
**Flow**: Issues FAN_BADGE credential → Creates single verification proof
**Use Case**: Exclusive fan perks and VIP access

### 3. Trader Tier Gate

**Requirements**: KYC with non-US jurisdiction
**Flow**: Issues KYC_BASIC credential → Creates jurisdiction compliance proof
**Use Case**: Trading platform tier access based on location

## 🔍 Testing

### Automated Test Suite

```bash
node scripts/test-integration.js
```

### Manual Testing Steps

1. **Partner Token Endpoint**

```bash
curl -X POST https://airgate-keys.vercel.app/api/partner-token
```

2. **JWKS Endpoint**

```bash
curl https://airgate-keys.vercel.app/.well-known/jwks.json
```

3. **End-to-End Flow**
   - Open http://lvh.me:5173
   - Navigate to Demos page
   - Click "Verify" on any demo scenario
   - Complete the verification flow
   - Access the unlocked perk

## 🛡️ Security Considerations

### ✅ Implemented Security Features

- **Environment Variables Protected**: `.env` files are gitignored
- **Token Expiration**: Partner tokens expire in 5 minutes (300 seconds)
- **CORS Configuration**: Restricts origins to known domains
- **Private Key Security**: RSA private keys stored only in Vercel environment
- **Type Safety**: Full TypeScript with Zod validation

### 🔒 Security Best Practices

1. **Never expose private keys** to client-side code
2. **Rotate credentials regularly** (especially if publicly visible)
3. **Keep token TTL short** (≤ 5 minutes recommended)
4. **Monitor API usage** for unusual patterns
5. **Use HTTPS only** in production

## 🏗️ Architecture Overview

```mermaid
graph TD
    A[User] --> B[AirGate OS Website]
    B --> C[Partner Token Request]
    C --> D[AirGate Keys Server]
    D --> E[Signed JWT Token]
    E --> B
    B --> F[AirKit SDK]
    F --> G[Credential Issuance]
    G --> H[Verification Proof]
    H --> I[Gated Action Access]
```

## 📁 File Structure

```
src/
├── air/
│   ├── env.ts              # Environment validation with Zod
│   ├── programs.ts         # Program ID helpers
│   ├── airkit.ts           # AirService singleton wrapper
│   └── useAirGate.tsx      # React Context provider
├── components/airgate/
│   ├── VerifyModal.tsx     # Verification flow UI
│   ├── PassportProgress.tsx # Credential status display
│   └── PerkButton.tsx      # Gated action buttons
└── pages/
    └── Demos.tsx           # Demo scenarios page
```

## 🔧 Development Commands

```bash
# Start development server (with correct host/port)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Test integration endpoints
node scripts/test-integration.js
```

## 🌐 Deployment URLs

- **Production Website**: https://airgate-os.vercel.app
- **Keys Server**: https://airgate-keys.vercel.app
- **Local Development**: http://lvh.me:5173

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Use `npm run dev -- --port 5174` for alternative port
2. **CORS errors**: Verify `CORS_ALLOWED_ORIGINS` includes your domain
3. **Token failures**: Check partner token endpoint returns 200 status
4. **Program ID mismatches**: Verify `VITE_ISSUER_PROGRAM_IDS` and `VITE_VERIFIER_PROGRAM_IDS` are valid JSON

### Debug Commands

```bash
# Check what's using port 5173
netstat -aon | findstr ":5173"

# Test partner token endpoint
curl -X POST https://airgate-keys.vercel.app/api/partner-token

# Verify JWKS endpoint
curl https://airgate-keys.vercel.app/.well-known/jwks.json
```

## 📞 Support

For issues related to:

- **AirKit SDK**: Contact AIR Protocol support
- **Website Integration**: Check this repository's issues
- **Environment Setup**: Verify Vercel environment variables match this guide

---

## 🎉 Ready to Launch!

Your AirGate OS integration is now complete and ready for production use. The system provides secure, privacy-preserving credential verification with a seamless user experience.
