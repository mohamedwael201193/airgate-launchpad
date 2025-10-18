/**
 * PerkButton - Action button that requires verification proof to enable.
 */

import { AirButton } from '@/components/ui/air-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock } from 'lucide-react';
// Define VerificationProof type locally since it's not exported from airkit
type VerificationProof = any;

interface PerkButtonProps {
  label: string;
  proof?: VerificationProof | null;
  disabledReason?: string;
  onSubmit?: (proof: VerificationProof) => void | Promise<void>;
  href?: string;
  className?: string;
}

export function PerkButton({
  label,
  proof,
  disabledReason = 'Complete verification to unlock',
  onSubmit,
  href,
  className,
}: PerkButtonProps) {
  const isEnabled = !!proof;

  const handleClick = async () => {
    if (proof && onSubmit) {
      onSubmit(proof);
    } else if (proof && href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (proof) {
      // POST proof to /api/open-perk and navigate to returned URL
      try {
        const response = await fetch('/api/open-perk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ proof }),
        });
        if (response.ok) {
          const { url } = await response.json();
          if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        } else {
          console.error('Failed to open perk:', response.statusText);
        }
      } catch (error) {
        console.error('Error opening perk:', error);
      }
    }
  };

  const buttonContent = (
    <AirButton
      variant={isEnabled ? 'accent' : 'outline'}
      size="lg"
      disabled={!isEnabled}
      onClick={handleClick}
      className={cn('relative group', className)}
    >
      {isEnabled ? (
        <>
          <CheckCircle className="h-5 w-5" />
          {label}
        </>
      ) : (
        <>
          <Lock className="h-5 w-5" />
          {label}
        </>
      )}
      
      {isEnabled && (
        <span className="absolute inset-0 rounded-lg bg-accent/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
      )}
    </AirButton>
  );

  if (!isEnabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabledReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
}
