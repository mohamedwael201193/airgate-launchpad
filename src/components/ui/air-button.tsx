/**
 * AirButton - Button component using custom AirGate variants.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { airButtonVariants } from "./button-variants";
import type { VariantProps } from "class-variance-authority";

export interface AirButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof airButtonVariants> {
  asChild?: boolean;
}

const AirButton = React.forwardRef<HTMLButtonElement, AirButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(airButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
AirButton.displayName = "AirButton";

export { AirButton };
