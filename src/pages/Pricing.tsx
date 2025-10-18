/**
 * Pricing - Three-tier pricing page.
 */

import { Section } from '@/components/layout/Section';
import { AirButton } from '@/components/ui/air-button';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for development and testing on testnet',
    features: [
      'Unlimited verifications on testnet',
      'All widget components',
      'Community support',
      'Rule builder access',
      'Documentation',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'Usage-based',
    description: 'Production-ready with flexible scaling',
    features: [
      'Pay per verification (from $0.01)',
      'Production environment',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'SLA guarantees',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams with advanced requirements',
    features: [
      'Volume discounts',
      'White-label solution',
      'Dedicated support',
      'Custom integrations',
      'On-premise option',
      'Custom SLAs',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function Pricing() {
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
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Start free on testnet. Scale to production with usage-based pricing.
          </motion.p>
        </div>
      </Section>

      {/* Pricing Cards */}
      <Section>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'p-8 rounded-2xl border relative',
                tier.highlighted
                  ? 'bg-gradient-cosmic border-accent shadow-lg scale-105'
                  : 'bg-card border-border'
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="font-display text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.price !== 'Custom' && tier.price !== '$0' && (
                  <span className="text-muted-foreground">/verification</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <AirButton
                variant={tier.highlighted ? 'accent' : 'outline'}
                size="lg"
                className="w-full"
              >
                {tier.cta}
              </AirButton>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ Placeholder */}
      <Section className="bg-card/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Check out our FAQ or reach out to our team for custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AirButton variant="hero" size="lg">
              View FAQ
            </AirButton>
            <AirButton variant="outline-glow" size="lg">
              Contact Sales
            </AirButton>
          </div>
        </div>
      </Section>
    </div>
  );
}
