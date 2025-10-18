/**
 * Terms - Terms of service page.
 */

import { Section } from '@/components/layout/Section';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div>
      <Section className="pt-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Terms of Service
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
            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground mb-6">
              By accessing or using AirGate OS, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use our services.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Description of Service</h2>
            <p className="text-muted-foreground mb-6">
              AirGate OS provides credential-based eligibility verification tools for application developers. Our service enables privacy-preserving verification through zero-knowledge proofs powered by the AIR Protocol.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Use our service for illegal purposes or to violate any laws</li>
              <li>Attempt to circumvent security measures or rate limits</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use the service to harass, abuse, or harm others</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground mb-6">
              AirGate OS and its original content, features, and functionality are owned by AirGate OS and are protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground mb-6">
              AirGate OS is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground mb-6">
              To the maximum extent permitted by law, AirGate OS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground mb-6">
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="font-display text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-muted-foreground mb-6">
              For questions about these Terms, contact us at: legal@airgate.example
            </p>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
