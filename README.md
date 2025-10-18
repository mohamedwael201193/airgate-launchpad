# AirGate OS

Premium credential-based eligibility verification platform powered by AIR Protocol. Ship eligibility gates, quest systems, and rate-limits in minutes with zero-knowledge privacy.

## 🚀 Live Demo

[Coming Soon]

## ⚡ Quickstart

### Requirements
- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd airgate-os

# Install dependencies
pnpm install

# Configure environment (see below)
cp .env.example .env

# Run dev server
pnpm dev --host lvh.me

# Open browser at http://lvh.me:5173
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```bash
# AIR Partner Configuration
VITE_AIR_PARTNER_ID=your_partner_id_here
VITE_AIR_ENV=testnet
VITE_MOCA_CHAIN_ID=12345
VITE_MOCA_RPC_URL=https://rpc.moca.network
VITE_EXPLORER_BASE_URL=https://explorer.moca.network
VITE_PARTNER_TOKEN_URL=https://api.airprotocol.io/partner/token

# Program IDs (JSON strings)
VITE_ISSUER_PROGRAM_IDS='{"kyc_basic":"issuer_abc123","work_history":"issuer_def456","fan_verified":"issuer_ghi789"}'
VITE_VERIFIER_PROGRAM_IDS='{"default":"verifier_xyz789","defi":"verifier_abc456"}'

# Branding
VITE_AIRGATE_BRAND=AirGate OS
VITE_AIRGATE_CONTACT_EMAIL=hello@example.com
VITE_AIRGATE_DEMOS_ENABLED=true
```

### Issuer/Verifier Program IDs Format

Program IDs must be valid JSON strings:

```json
{
  "kyc_basic": "issuer_program_id_1",
  "work_history": "issuer_program_id_2",
  "fan_verified": "issuer_program_id_3"
}
```

## 🧩 Integration Guide

### 1. Initialize Provider

Wrap your app with `AirGateProvider`:

```tsx
import { AirGateProvider } from "@/air/useAirGate";

<AirGateProvider>
  {children}
</AirGateProvider>
```

### 2. Add VerifyModal

Use the verification widget in your components:

```tsx
import { VerifyModal } from "@/components/airgate/VerifyModal";
import { defiJobRule } from "@/air/rules";

<VerifyModal
  open={open}
  onOpenChange={setOpen}
  rules={defiJobRule}
  onPass={(proof) => {
    console.log('Verified:', proof.proofId);
    // Grant access to feature
  }}
/>
```

### 3. Display Credential Status

Show user's passport with `PassportProgress`:

```tsx
import { PassportProgress } from "@/components/airgate/PassportProgress";

<PassportProgress credentials={credentials} />
```

### 4. Gate Features with PerkButton

```tsx
import { PerkButton } from "@/components/airgate/PerkButton";

<PerkButton
  label="Access Premium Feature"
  proof={verificationProof}
  disabledReason="Complete verification first"
  onSubmit={(proof) => {
    // User clicked button with valid proof
  }}
/>
```

## 📚 Architecture

```
src/
├── air/                    # AIR Kit integration
│   ├── env.ts             # Typed environment access
│   ├── airkit.ts          # Service wrapper (TODO: integrate SDK)
│   ├── programs.ts        # Program ID helpers
│   ├── rules.ts           # Demo rule presets
│   └── useAirGate.tsx     # React context + Zustand store
├── components/
│   ├── airgate/           # Verification widgets
│   ├── hero/              # Landing page components
│   ├── layout/            # Navbar, Footer, Section
│   └── ui/                # Shadcn + custom components
└── pages/                 # Route pages
```

## 🔐 Security

### Never Commit Secrets
- Partner PEM keys
- Fee wallet private keys
- Production API tokens

Use environment variables for all sensitive data.

### Partner Token Security
- Tokens should have ≤5 minute TTL
- Rotate JWKS `kid` regularly
- Verify token signatures on all requests

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set framework preset: **Vite**
3. Add all environment variables in project settings
4. Configure Allowed Domains in AIR Console to include your Vercel domain
5. Deploy!

### Build Commands

```bash
# Production build
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm type-check

# Lint
pnpm lint
```

## 🐛 Troubleshooting

### "Domain not allowed" Error
- Ensure your domain is added to Allowed Domains in AIR Partner Console
- For local dev, use `lvh.me` instead of `localhost`
- Restart dev server after adding domain

### "Invalid JWKS" Error
- Verify JWKS endpoint is accessible
- Check that `kid` in token header matches JWKS
- Ensure partner credentials are correct

### "Missing partner token" Error
- Check `VITE_PARTNER_TOKEN_URL` is set correctly
- Verify endpoint returns valid JWT
- Check network connectivity to token service

### "Verifier program mismatch" Error
- Ensure `VITE_VERIFIER_PROGRAM_IDS` contains correct program ID for your use case
- Verify JSON format is valid
- Check that program IDs match those in AIR Console

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📞 Support

- Documentation: [View Docs](/docs)
- Email: hello@airgate.example
- Discord: [Coming Soon]

---

Built with ❤️ on AIR Protocol
