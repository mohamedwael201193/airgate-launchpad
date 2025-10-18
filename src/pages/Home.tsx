/**
 * Home - Landing page with hero, features, code examples, and CTAs.
 */

import { Hero } from '@/components/hero/Hero';
import { Section } from '@/components/layout/Section';
import { CodeBlock } from '@/components/ui/code-block';
import { AirButton } from '@/components/ui/air-button';
import { Shield, Zap, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Zap,
    title: 'Eligibility Engine',
    description: 'Compose complex rules from credentials, on-chain signals, geo, and rate-limits in pure JSON. No backend code required.',
  },
  {
    icon: Shield,
    title: 'Hosted Builder',
    description: 'Visual rule editor with instant previews. Define your requirements, get an embed code, and ship in minutes.',
  },
  {
    icon: Lock,
    title: 'Privacy-first ZK',
    description: "Zero-knowledge proofs mean no raw PII ever leaves the user's device. GDPR-compliant by design.",
  },
];

const integrationCode = `import { AirGateProvider } from "@/air/useAirGate";

<AirGateProvider>
  {children}
</AirGateProvider>`;

const verifyModalCode = `<VerifyModal
  open={open}
  rules={defiJobRule}
  onPass={(proof) => {
    // User verified! Grant access
    console.log('Proof:', proof.proofId);
  }}
/>`;

const progressCode = `<PassportProgress 
  credentials={credentials} 
/>`;

const partners = ['Partner A', 'Partner B', 'Partner C', 'Partner D', 'Partner E'];

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Why AirGate */}
      <Section className="bg-card/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-accent">AirGate</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ship eligibility gates in minutes, not weeks. Focus on your product, not identity infrastructure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-cosmic flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Ship in a day */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ship in a day
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Three components. Infinite possibilities. Drop in our React widgets and you're done.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'VerifyModal', desc: 'One-click eligibility check with credential claiming' },
                  { title: 'PassportProgress', desc: 'Visual credential status with expiry warnings' },
                  { title: 'PerkButton', desc: 'Action button that unlocks after verification' },
                ].map((widget, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{widget.title}</p>
                      <p className="text-sm text-muted-foreground">{widget.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/docs">
                <AirButton variant="hero" size="lg" className="mt-8">
                  View Documentation <ArrowRight className="h-5 w-5" />
                </AirButton>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">1. Initialize Provider</h3>
              <CodeBlock code={integrationCode} language="tsx" />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">2. Add Verify Modal</h3>
              <CodeBlock code={verifyModalCode} language="tsx" />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">3. Show Progress</h3>
              <CodeBlock code={progressCode} language="tsx" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Partners Marquee */}
      <Section className="bg-card/30 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Trusted by forward-thinking teams
          </h2>
        </div>

        <div className="relative">
          <div className="flex gap-8 animate-marquee">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-8 py-4 rounded-lg bg-background border border-border"
              >
                <span className="text-lg font-semibold text-muted-foreground">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to build?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start shipping eligibility gates today. Free on devnet, scale to production.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AirButton variant="hero" size="xl">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </AirButton>
            <Link to="/demos">
              <AirButton variant="outline-glow" size="xl">
                Explore Demos
              </AirButton>
            </Link>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
