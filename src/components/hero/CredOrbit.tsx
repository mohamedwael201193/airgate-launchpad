/**
 * CredOrbit - Interactive orbital visualization of credential types.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Briefcase, Heart, MapPin, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const credentials = [
  { icon: Shield, label: 'KYC', color: 'text-primary', angle: 0 },
  { icon: Briefcase, label: 'Work History', color: 'text-accent', angle: 72 },
  { icon: Heart, label: 'Fan Badge', color: 'text-secondary', angle: 144 },
  { icon: MapPin, label: 'Residency', color: 'text-warn', angle: 216 },
  { icon: TrendingUp, label: 'Trades', color: 'text-primary', angle: 288 },
];

export function CredOrbit() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Center glyph */}
      <motion.div
        className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-gradient-cosmic glow-primary flex items-center justify-center"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-accent">AIR</span>
        </div>
      </motion.div>

      {/* Orbit ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="url(#orbit-gradient)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          className="opacity-30"
        />
        <defs>
          <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Orbiting credentials */}
      {credentials.map((cred, index) => {
        const isHovered = hoveredIndex === index;
        const radius = 140;
        const angleRad = (cred.angle * Math.PI) / 180;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;

        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2"
            style={{
              x: x - 20,
              y: y - 20,
            }}
            animate={{
              rotate: isHovered ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <motion.div
              className={cn(
                'w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center cursor-pointer group relative',
                isHovered && 'border-primary shadow-lg glow-primary'
              )}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <cred.icon className={cn('h-6 w-6', cred.color)} />
              
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover border border-border rounded-lg text-xs font-medium whitespace-nowrap"
                >
                  {cred.label}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-45" />
                </motion.div>
              )}
            </motion.div>

            {/* Connection line to center (visible on hover) */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                className="absolute top-1/2 left-1/2 w-px h-32 origin-bottom"
                style={{
                  background: `linear-gradient(to bottom, hsl(var(--primary)), transparent)`,
                  transform: `rotate(${-cred.angle + 180}deg) translateY(-50%)`,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
