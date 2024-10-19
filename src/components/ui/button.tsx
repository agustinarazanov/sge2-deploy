"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, type LucideIcon } from "lucide-react";

import { cn } from "@/components/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center border rounded-md text-sm leading-6 transition-colors font-medium !outline-none !ring-transparent disabled:pointer-events-none disabled:opacity-30 shadow-[0px_1px_3px_0px_#00000040]",
  {
    variants: {
      variant: {
        default: cn("h-9 px-4 py-2"),
        icon: cn("p-2 h-10 w-10"),
      },
      color: {
        primary: cn(
          "bg-primary text-primary-foreground border-[#3b82f6] hover:bg-[#3b82f6] focus-visible:bg-primary/80 active:shadow-[inset_0px_4px_4px_0px_#0000004D,0px_1px_3px_0px_#00000040]",
        ),
        secondary: cn(
          "bg-transparent text-secondary-foreground border-border/50 hover:bg-secondary/20 focus-visible:bg-secondary/80 disabled:border-border-secondary active:shadow-[inset_0px_4px_4px_0px_#0000004D,0px_1px_3px_0px_#00000040]",
        ),
        white: cn(
          "bg-secondary text-white border-border/50 hover:bg-secondary/20 focus-visible:bg-secondary/80 disabled:border-border-secondary active:shadow-[inset_0px_4px_4px_0px_#0000004D,0px_1px_3px_0px_#00000040]",
        ),
        ghost: cn(
          "bg-transparent hover:bg-slate-100 focus-visible:text-secondary-foreground active:bg-[#393A3B] shadow-none active:shadow-[inset_0px_4px_4px_0px_#0000004D]",
        ),
        danger: cn(
          "bg-danger border-none hover:bg-danger/90 text-white focus-visible:bg-danger/80 active:shadow-[inset_0px_4px_4px_0px_#0000004D,0px_1px_3px_0px_#00000040]",
        ),
        outline: cn(
          "bg-transparent text-white hover:text-secondary-foreground focus-visible:text-secondary-foreground active:bg-[#393A3B] shadow-none active:shadow-[inset_0px_4px_4px_0px_#0000004D] border border-input",
        ),
      },
      size: {
        default: cn("px-4 py-2"),
        sm: cn("px-3 py-2 text-xs h-8"),
        md: cn("px-1 py-3 text-base h-12"),
        lg: cn("px-6 py-3 h-12 text-base"),
      },
    },
    compoundVariants: [
      {
        variant: "icon",
        size: "default",
        className: cn("p-2 w-10"),
      },
      {
        variant: "icon",
        size: "sm",
        className: cn("p-2 w-8 h-8"),
      },
      {
        variant: "icon",
        size: "md",
        className: cn("py-2.5 w-8 h-14"),
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  icon?: ((props: React.SVGProps<SVGSVGElement>) => React.JSX.Element) | LucideIcon | (() => React.JSX.Element);
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, icon: Icon, variant, size, asChild = false, color, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, color, className }))}
        ref={ref}
        disabled={isLoading ?? props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className={cn("size-4 animate-spin")} />}
        {Icon && <Icon className={cn("size-4", { "mr-2": variant !== "icon" })} />}
        {variant !== "icon" && children ? Icon ? <span>{children}</span> : children : null}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
