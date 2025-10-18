/**
 * Docs - Documentation landing with quickstart and env setup.
 */

import { Section } from '@/components/layout/Section';
import { CodeBlock } from '@/components/ui/code-block';
import { AirButton } from '@/components/ui/air-button';
import { Book, Code, Settings, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const installCode = `npm install @mocanetwork/airkit
# or
pnpm add @mocanetwork/airkit`;

const providerCode = `import { AirGateProvider } from "@/air/useAirGate";

function App() {
  return (
    <AirGateProvider>
      {/* Your app */}
    </AirGateProvider>
  );
}`;

const verifyCode = `import { VerifyModal } from "@/components/airgate/VerifyModal";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Verify Eligibility
      </button>

      <VerifyModal
        open={open}
        onOpenChange={setOpen}
        rules={myRules}
        onPass={(proof) => {
          console.log('Verification passed:', proof.proofId);
          // Grant access to feature
        }}
      />
    </>
  );
}`;

const envExample = `VITE_AIR_PARTNER_ID=your_partner_id
VITE_AIR_ENV=testnet
VITE_MOCA_CHAIN_ID=12345
VITE_MOCA_RPC_URL=https://rpc.moca.network
VITE_EXPLORER_BASE_URL=https://explorer.moca.network
VITE_PARTNER_TOKEN_URL=https://api.airprotocol.io/partner/token
VITE_ISSUER_PROGRAM_IDS='{"kyc_basic":"issuer_abc123","work_history":"issuer_def456"}'
VITE_VERIFIER_PROGRAM_IDS='{"default":"verifier_xyz789"}'
VITE_AIRGATE_BRAND=AirGate OS
VITE_AIRGATE_CONTACT_EMAIL=hello@example.com
VITE_AIRGATE_DEMOS_ENABLED=true`;

const sections = [
  {
    icon: Book,
    title: 'Quickstart',
    description: 'Get up and running in under 5 minutes',
  },
  {
    icon: Code,
    title: 'API Reference',
    description: 'Complete widget props and types',
  },
  {
    icon: Settings,
    title: 'Configuration',
    description: 'Environment variables and rule schemas',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Best practices for credential management',
  },
];

export default function Docs() {
  return (
    <div>
      {/* Hero */}
      <Section className="pt-32">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl md:text-6xl font-bold mb-6"
          >
            Documentation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Everything you need to integrate AirGate OS into your application.
          </motion.p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-cosmic flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <section.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Quickstart */}
      <Section className="bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">Quickstart</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">1. Install Dependencies</h3>
              <CodeBlock code={installCode} language="bash" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">2. Initialize Provider</h3>
              <p className="text-muted-foreground mb-3">
                Wrap your app with <code className="text-accent">AirGateProvider</code> to enable AIR functionality.
              </p>
              <CodeBlock code={providerCode} language="tsx" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">3. Use VerifyModal</h3>
              <p className="text-muted-foreground mb-3">
                Add verification flows to your components with the <code className="text-accent">VerifyModal</code> widget.
              </p>
              <CodeBlock code={verifyCode} language="tsx" />
            </div>
          </div>
        </div>
      </Section>

      {/* Environment Setup */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">Environment Setup</h2>
          
          <p className="text-lg text-muted-foreground mb-6">
            Create a <code className="text-accent">.env</code> file in your project root with the following variables:
          </p>

          <CodeBlock code={envExample} language="bash" />

          <div className="mt-8 p-6 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-4">Key Configuration Notes:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>ISSUER_PROGRAM_IDS</strong>: JSON string mapping credential types to issuer program IDs</li>
              <li>• <strong>VERIFIER_PROGRAM_IDS</strong>: JSON string mapping verification contexts to verifier program IDs</li>
              <li>• <strong>PARTNER_TOKEN_URL</strong>: Endpoint to fetch short-lived partner tokens (≤5min TTL)</li>
              <li>• <strong>AIR_ENV</strong>: Use "testnet" for development, "prod" for production</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Reference Placeholder */}
      <Section className="bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Full API Reference
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Detailed documentation for all widgets, types, and rule schemas.
          </p>
          <AirButton variant="hero" size="lg">
            View Full Docs
          </AirButton>
        </div>
      </Section>
    </div>
  );
}
