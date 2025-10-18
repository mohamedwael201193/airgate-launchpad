/**
 * Hero - Landing page hero with cosmic gradient and CTA.
 */

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AirButton } from '@/components/ui/air-button';
import { CredOrbit } from './CredOrbit';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Cosmic gradient background */}
      <div className="absolute inset-0 bg-gradient-cosmic-radial opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Animated glow orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Privacy-first verification</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="glow-text-primary">AirGate OS</span>
              <br />
              <span className="text-muted-foreground text-3xl md:text-4xl font-normal">
                Drop-in eligibility, quests, and rate-limits
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Ship eligibility gates and quest systems in minutes. Powered by AIR credentials with zero-knowledge proofs—no raw PII, ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <AirButton variant="hero" size="xl">
                Get Started <ArrowRight className="h-5 w-5" />
              </AirButton>
              <AirButton variant="outline-glow" size="xl">
                View Demos
              </AirButton>
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start"
            >
              {[
                { value: '<5min', label: 'Integration' },
                { value: 'ZK', label: 'Privacy' },
                { value: '∞', label: 'Credentials' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-display font-bold text-accent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Credential Orbit Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <CredOrbit />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
