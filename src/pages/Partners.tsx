/**
 * Partners - Use cases and partner information.
 */

import { Section } from '@/components/layout/Section';
import { AirButton } from '@/components/ui/air-button';
import { TrendingUp, Users, MessageSquare, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const useCases = [
  {
    icon: TrendingUp,
    title: 'DeFi Platforms',
    description: 'Gate advanced features by trading volume, KYC status, or token holdings. Rate-limit high-frequency actions to prevent abuse.',
    examples: ['Leveraged trading tiers', 'Governance participation', 'Liquidity mining programs'],
  },
  {
    icon: Users,
    title: 'Prediction Markets',
    description: 'Ensure market integrity with credential-based eligibility. Verify residency, trading history, and compliance status.',
    examples: ['Geo-restricted markets', 'Accredited investor verification', 'Market maker tiers'],
  },
  {
    icon: MessageSquare,
    title: 'Fandom & Communities',
    description: 'Reward loyal fans with exclusive perks. Verify fan credentials, attendance history, and engagement levels.',
    examples: ['VIP event access', 'Limited edition drops', 'Community governance'],
  },
  {
    icon: Briefcase,
    title: 'Forums & Q&A',
    description: 'Combat spam with credential gates. Require verified work history, expertise credentials, or reputation signals.',
    examples: ['Expert-only channels', 'Verified professional badges', 'Anti-spam rate limits'],
  },
];

export default function Partners() {
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
            Built for every use case
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            From DeFi to fandom, AirGate OS adapts to your needs with flexible credential-based verification.
          </motion.p>
        </div>
      </Section>

      {/* Use Cases */}
      <Section>
        <div className="space-y-12">
          {useCases.map((useCase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="grid lg:grid-cols-2 gap-8 items-center p-8 rounded-2xl bg-card border border-border"
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-cosmic flex items-center justify-center mb-6">
                  <useCase.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-4">{useCase.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{useCase.description}</p>
              </div>

              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="p-6 rounded-xl bg-background border border-border">
                  <h3 className="font-semibold mb-4">Example Applications:</h3>
                  <ul className="space-y-2">
                    {useCase.examples.map((example, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span className="text-muted-foreground">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-card/30 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to partner?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the ecosystem of applications building on privacy-first verification.
          </p>
          <AirButton variant="hero" size="xl">
            Contact Us
          </AirButton>
        </motion.div>
      </Section>
    </div>
  );
}
