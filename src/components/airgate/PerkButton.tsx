/**
 * PerkButton - Action button that requires verification proof to enable.
 */

import { Lock, CheckCircle } from 'lucide-react';
import { AirButton } from '@/components/ui/air-button';
import { cn } from '@/lib/utils';
import type { VerificationProof } from '@/air/airkit';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const handleClick = () => {
    if (proof && onSubmit) {
      onSubmit(proof);
    } else if (proof && href) {
      window.open(href, '_blank', 'noopener,noreferrer');
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
