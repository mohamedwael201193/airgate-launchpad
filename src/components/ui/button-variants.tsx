/**
 * Custom button variants using design system tokens.
 * Extends shadcn button with AirGate-specific styles.
 */

import { cva } from "class-variance-authority";

export const airButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        outline: "border border-border bg-background hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Custom AirGate variants
        hero: "bg-gradient-cosmic text-primary-foreground font-semibold glow-primary hover:scale-[1.02] hover:glow-primary",
        glow: "bg-card border border-primary/30 text-foreground glow-primary hover:bg-card/80 hover:border-primary/50",
        accent: "bg-accent text-accent-foreground font-semibold hover:opacity-90",
        "outline-glow": "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground glow-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
