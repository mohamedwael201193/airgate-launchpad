/**
 * VerifyModal - Interactive verification flow with credential claiming.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AirButton } from '@/components/ui/air-button';
import { useAirGate } from '@/air/useAirGate';
import type { RulesJSON } from '@/air/rules';
import type { VerificationProof } from '@/air/airkit';
import { cn } from '@/lib/utils';

interface VerifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rules: RulesJSON;
  title?: string;
  onMissing?: () => void;
  onPass: (proof: VerificationProof) => void;
  onFail?: () => void;
}

type Step = 'checking' | 'missing' | 'claiming' | 'verifying' | 'success' | 'error';

export function VerifyModal({
  open,
  onOpenChange,
  rules,
  title = 'Verify Eligibility',
  onMissing,
  onPass,
  onFail,
}: VerifyModalProps) {
  const { service, credentials, getVerifierId } = useAirGate();
  const [step, setStep] = useState<Step>('checking');
  const [missingCreds, setMissingCreds] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const checkEligibility = async () => {
    setStep('checking');
    
    // Simulate checking which credentials are missing
    const required = rules.all?.filter(r => r.type === 'credential').map(r => r.id) || [];
    const userCredIds = credentials.map(c => c.id);
    const missing = required.filter(id => !userCredIds.includes(id));

    if (missing.length > 0) {
      setMissingCreds(missing);
      setStep('missing');
      onMissing?.();
    } else {
      await createProof();
    }
  };

  const claimCredential = async (credId: string) => {
    if (!service) return;
    
    setStep('claiming');
    try {
      await service.issueCredential(credId);
      setMissingCreds(prev => prev.filter(id => id !== credId));
      
      if (missingCreds.length === 1) {
        // All credentials now satisfied
        await createProof();
      } else {
        setStep('missing');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim credential');
      setStep('error');
    }
  };

  const createProof = async () => {
    if (!service) return;
    
    setStep('verifying');
    try {
      const verifierId = getVerifierId('default');
      const proof = await service.createVerificationProof({
        programId: verifierId,
        rules,
      });
      
      setStep('success');
      setTimeout(() => {
        onPass(proof);
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setStep('error');
      onFail?.();
    }
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      checkEligibility();
    } else {
      // Reset on close
      setTimeout(() => {
        setStep('checking');
        setMissingCreds([]);
        setError('');
      }, 300);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <AnimatePresence mode="wait">
            {step === 'checking' && (
              <motion.div
                key="checking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Checking eligibility...</p>
              </motion.div>
            )}

            {step === 'missing' && (
              <motion.div
                key="missing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">
                  You need the following credentials to proceed:
                </p>
                
                {missingCreds.map((credId, i) => (
                  <motion.div
                    key={credId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-warn" />
                      <span className="font-medium">{credId}</span>
                    </div>
                    <AirButton
                      size="sm"
                      variant="accent"
                      onClick={() => claimCredential(credId)}
                    >
                      Claim
                    </AirButton>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {step === 'claiming' && (
              <motion.div
                key="claiming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
                <p className="text-muted-foreground">Issuing credential...</p>
              </motion.div>
            )}

            {step === 'verifying' && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Creating ZK proof...</p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-4" />
                </motion.div>
                <p className="text-lg font-semibold mb-2">Verification Complete!</p>
                <p className="text-sm text-muted-foreground">You're all set.</p>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Verification Failed</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <AirButton
                  className="mt-4"
                  onClick={() => checkEligibility()}
                >
                  Try Again
                </AirButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
