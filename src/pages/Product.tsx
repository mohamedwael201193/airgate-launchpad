/**
 * Product - Detailed product features and capabilities.
 */

import { Section } from '@/components/layout/Section';
import { CodeBlock } from '@/components/ui/code-block';
import { AirButton } from '@/components/ui/air-button';
import { Shield, Layers, Code, Globe, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ruleExample = `{
  "all": [
    { "type": "credential", "id": "kyc_basic", "query": { "status": "compliant" } },
    { "type": "claim", "schema": "work_history", "query": { "years": { "$gte": 2 } } },
    { "type": "onchain", "key": "defi_activity.trades90d", "op": "gte", "value": 10 }
  ]
}`;

const widgets = [
  {
    name: 'VerifyModal',
    description: 'Interactive verification flow with credential claiming',
    props: ['rules: RulesJSON', 'onPass: (proof) => void', 'onMissing?: () => void', 'onFail?: () => void'],
  },
  {
    name: 'PassportProgress',
    description: 'Visual credential status with revocation and expiry states',
    props: ['credentials?: AirCredential[]'],
  },
  {
    name: 'PerkButton',
    description: 'Action button that enables after successful verification',
    props: ['label: string', 'proof?: VerificationProof', 'disabledReason?: string', 'onSubmit?: (proof) => void'],
  },
];

const ruleTypes = [
  { icon: Shield, title: 'Credentials', desc: 'KYC, work history, fan badges, residency' },
  { icon: Layers, title: 'Claims', desc: 'Query structured data within credentials' },
  { icon: Globe, title: 'Geo', desc: 'Include or exclude by country/region' },
  { icon: TrendingUp, title: 'On-chain', desc: 'Trading volume, token holdings, activity' },
  { icon: Zap, title: 'Rate Limits (RLN)', desc: 'Time-windowed action caps per user' },
];

export default function Product() {
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
            Rules DSL that scales
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Compose credentials, issuers, recency checks, geo-fencing, on-chain signals, and rate-limits in pure JSON. Ship complex eligibility logic without backend code.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CodeBlock code={ruleExample} language="json" showLineNumbers />
        </motion.div>
      </Section>

      {/* Rule Types */}
      <Section className="bg-card/30">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Rule Primitives
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ruleTypes.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-cosmic flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <rule.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{rule.title}</h3>
              <p className="text-sm text-muted-foreground">{rule.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Widgets */}
      <Section>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
          Ready-to-use Widgets
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Drop-in React components that handle the entire verification flow. Fully customizable and TypeScript-ready.
        </p>

        <div className="space-y-8">
          {widgets.map((widget, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    <code className="text-accent">{widget.name}</code>
                  </h3>
                  <p className="text-muted-foreground">{widget.description}</p>
                </div>
                <Code className="h-6 w-6 text-primary flex-shrink-0" />
              </div>

              <div className="mt-4 p-4 rounded-lg bg-muted/30">
                <p className="text-sm font-semibold mb-2">Props:</p>
                <ul className="space-y-1">
                  {widget.props.map((prop, j) => (
                    <li key={j} className="text-sm font-mono text-muted-foreground">
                      {prop}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Builder Concept */}
      <Section className="bg-card/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Visual Rule Builder (Coming Soon)
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Define your eligibility requirements in a visual editor. Get an embed code. Ship it. No backend, no hassle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demos">
                <AirButton variant="hero" size="lg">
                  Try Interactive Demos
                </AirButton>
              </Link>
              <Link to="/docs">
                <AirButton variant="outline-glow" size="lg">
                  Read Documentation
                </AirButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Privacy */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-cosmic flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Privacy by Design
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Zero-knowledge proofs ensure no raw personally identifiable information ever leaves the user's device. Verifiers only see "yes" or "no"—never the underlying data.
            </p>
            <ul className="space-y-3">
              {[
                'ZK verification powered by AIR Protocol',
                'GDPR-compliant by default',
                'No centralized credential database',
                'User controls credential sharing',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-cosmic-radial border border-primary/20 flex items-center justify-center">
              <div className="text-center">
                <Shield className="h-24 w-24 text-primary mx-auto mb-4 animate-pulse-glow" />
                <p className="text-2xl font-display font-bold">Zero PII</p>
                <p className="text-muted-foreground">Always</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
