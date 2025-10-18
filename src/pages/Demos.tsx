/**
 * Demos - Interactive demo page with real verification flows.
 */

import { demoRules } from '@/air/rules';
import { useAirGate } from '@/air/useAirGate';
import { PassportProgress } from '@/components/airgate/PassportProgress';
import { PerkButton } from '@/components/airgate/PerkButton';
import { VerifyModal } from '@/components/airgate/VerifyModal';
import { Section } from '@/components/layout/Section';
import { AirButton } from '@/components/ui/air-button';
import { CodeBlock } from '@/components/ui/code-block';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import { Briefcase, ChevronDown, ChevronUp, Heart, TrendingUp } from 'lucide-react';
import { useState } from 'react';
// Define VerificationProof type locally since it's not exported from airkit
type VerificationProof = any;

const demos = [
  {
    id: 'defiJob',
    icon: Briefcase,
    title: 'DeFi Job Passport',
    description: 'Requires KYC (compliant), 2+ years work history, and 10+ trades in last 90 days',
    rule: demoRules.defiJob,
    perkLabel: 'Apply to DeFi Job',
  },
  {
    id: 'fanVip',
    icon: Heart,
    title: 'Fan VIP Challenge',
    description: 'Fan badge with VIP tier + rate-limit: max 5 actions per 24 hours',
    rule: demoRules.fanVip,
    perkLabel: 'Claim VIP Rewards',
  },
  {
    id: 'traderTier',
    icon: TrendingUp,
    title: 'Trader Tiers',
    description: 'Geo-restricted (non-US), requires 20+ trades in last 90 days',
    rule: demoRules.traderTier,
    perkLabel: 'Access Trader Dashboard',
  },
];

export default function Demos() {
  const { } = useAirGate();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [proofs, setProofs] = useState<Record<string, VerificationProof>>({});
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});

  const handleVerificationPass = (demoId: string, proof: VerificationProof) => {
    setProofs(prev => ({ ...prev, [demoId]: proof }));
    setActiveDemo(null);
  };

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
            Interactive <span className="text-accent">Demos</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Experience real verification flows powered by AIR credentials. Click "Launch Verify" to test each scenario.
          </motion.p>
        </div>
      </Section>

      {/* Your Passport */}
      <Section className="bg-card/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">Your Passport</h2>
          <PassportProgress />
        </div>
      </Section>

      {/* Demo Cards */}
      <Section>
        <div className="space-y-8">
          {demos.map((demo, i) => {
            const DemoIcon = demo.icon;
            const proof = proofs[demo.id];
            const isExpanded = expandedRules[demo.id];

            return (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-8 rounded-2xl bg-card border border-border"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon & Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-cosmic flex items-center justify-center flex-shrink-0">
                        <DemoIcon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold mb-2">{demo.title}</h3>
                        <p className="text-muted-foreground">{demo.description}</p>
                      </div>
                    </div>

                    {/* Rule JSON Toggle */}
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={(open) => 
                        setExpandedRules(prev => ({ ...prev, [demo.id]: open }))
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <AirButton variant="ghost" size="sm" className="mb-2">
                          {isExpanded ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                          {isExpanded ? 'Hide' : 'Show'} JSON Rule
                        </AirButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CodeBlock
                          code={JSON.stringify(demo.rule, null, 2)}
                          language="json"
                          className="mt-2"
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 md:min-w-[200px]">
                    <AirButton
                      variant="hero"
                      onClick={() => setActiveDemo(demo.id)}
                      className="w-full"
                    >
                      Launch Verify
                    </AirButton>

                    <PerkButton
                      label={demo.perkLabel}
                      proof={proof}
                      disabledReason="Complete verification first"
                      onSubmit={() => {
                        alert(`${demo.perkLabel} unlocked! Proof ID: ${proof?.proofId}`);
                      }}
                      className="w-full"
                    />

                    {proof && (
                      <div className="text-xs text-center text-muted-foreground">
                        ✓ Verified at {new Date(proof.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Verify Modals */}
      {activeDemo && (
        <VerifyModal
          demoKey={activeDemo as "defiJob"|"fanVip"|"traderTier"}
          onPass={(proof) => {
            handleVerificationPass(activeDemo, proof);
            setActiveDemo(null);
          }}
          onFail={(error) => {
            console.error('Verification failed:', error);
            setActiveDemo(null);
          }}
        />
      )}

      {/* CTA */}
      <Section className="bg-card/30 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to integrate?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Add these flows to your app in minutes with our drop-in React widgets.
          </p>
          <AirButton variant="hero" size="xl">
            Get Started
          </AirButton>
        </motion.div>
      </Section>
    </div>
  );
}
