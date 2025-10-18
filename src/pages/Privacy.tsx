/**
 * Privacy - Privacy policy page.
 */

import { Section } from '@/components/layout/Section';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div>
      <Section className="pt-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Overview</h2>
            <p className="text-muted-foreground mb-6">
              AirGate OS is built on privacy-first principles. Our platform uses zero-knowledge proofs to verify credentials without ever accessing or storing your personally identifiable information (PII).
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Data We Collect</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Technical Data:</strong> We collect minimal technical data necessary to provide our service, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Wallet addresses (public blockchain identifiers)</li>
              <li>Verification timestamps and proof IDs (non-identifiable)</li>
              <li>Service usage metrics and analytics</li>
            </ul>

            <p className="text-muted-foreground mb-6">
              <strong>What We Don't Collect:</strong> We never collect, store, or have access to the underlying personal data in your credentials (name, date of birth, SSN, etc.). All credential data remains encrypted and under your control.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">How We Use Data</h2>
            <p className="text-muted-foreground mb-6">
              Technical data is used solely to provide, maintain, and improve AirGate OS services. We do not sell or share your data with third parties for marketing purposes.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Security</h2>
            <p className="text-muted-foreground mb-6">
              We implement industry-standard security measures to protect our systems. Our zero-knowledge architecture ensures that even in the event of a breach, no personal credential data would be exposed.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-6">
              You have full control over your credentials. You can revoke, update, or delete credentials at any time. Since we don't store your PII, there's no personal data to request or delete from our servers.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-muted-foreground mb-6">
              For privacy-related questions, contact us at: privacy@airgate.example
            </p>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
