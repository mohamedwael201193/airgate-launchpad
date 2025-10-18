/**
 * Careers - Careers page placeholder.
 */

import { Section } from '@/components/layout/Section';
import { AirButton } from '@/components/ui/air-button';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Careers() {
  return (
    <div>
      <Section className="pt-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Users className="h-16 w-16 text-accent mx-auto mb-6" />
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us build the future of privacy-first verification.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 p-12 rounded-2xl bg-card border border-border"
          >
            <h2 className="font-display text-2xl font-bold mb-4">
              We're building something special
            </h2>
            <p className="text-muted-foreground mb-6">
              AirGate OS is on a mission to make credential-based verification accessible to every application. We're looking for passionate individuals who believe in privacy, security, and user sovereignty.
            </p>
            <p className="text-muted-foreground mb-8">
              Current openings will be posted here. Stay tuned!
            </p>
            <AirButton variant="hero">
              Get Notified
            </AirButton>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
