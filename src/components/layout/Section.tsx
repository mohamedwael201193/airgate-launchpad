/**
 * Section - Reusable page section wrapper with optional animations.
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  id?: string;
}

export function Section({ children, className, animate = true, id }: SectionProps) {
  const Wrapper = animate ? motion.section : 'section';
  
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  } : {};

  return (
    <Wrapper
      id={id}
      className={cn('py-16 md:py-24', className)}
      {...animationProps}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </Wrapper>
  );
}
