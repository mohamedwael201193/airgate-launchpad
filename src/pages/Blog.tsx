/**
 * Blog - Blog landing page placeholder.
 */

import { Section } from '@/components/layout/Section';
import { AirButton } from '@/components/ui/air-button';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Blog() {
  return (
    <div>
      <Section className="pt-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, updates, and best practices from the AirGate OS team.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 p-12 rounded-2xl bg-card border border-border"
          >
            <p className="text-muted-foreground mb-6">
              Our blog is coming soon. Subscribe to stay updated on the latest in credential-based verification and privacy-first identity.
            </p>
            <AirButton variant="hero">
              Subscribe for Updates
            </AirButton>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
