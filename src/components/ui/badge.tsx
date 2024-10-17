"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/components/utils";

const badgeVariants = cva(
  "inline-flex items-center border text-[12px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: cn("px-2.5 py-0.5 rounded-[13px]"),
        icon: cn("p-2 rounded-full"),
      },
      color: {
        primary: "border-primary bg-primary/20 hover:bg-primary/40",
        success: "border-success bg-success/20 hover:bg-success/40",
        info: "border-info bg-info/20 hover:bg-info/40",
        danger: "border-danger bg-danger/20 hover:bg-danger/40",
        warning: "border-warning bg-warning/20 hover:bg-warning/40",
        secondary: "border-secondary bg-secondary/20 hover:bg-secondary/40",
        aqua: "border-aqua bg-aqua/20 hover:bg-aqua/40",
        midnight: "border-midnight bg-midnight/20 hover:midnight/40",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "primary",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  color?: "primary" | "success" | "info" | "danger" | "warning" | "secondary" | "aqua" | "midnight";
  variant?: "default" | "icon";
  label?: React.ReactNode;
  icon?: ((props: React.SVGProps<SVGSVGElement>) => React.JSX.Element) | LucideIcon;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, children, variant, label, color, icon: Icon, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant, color }), className)} {...props}>
        {Icon && <Icon className={cn("h-2.5 w-2.5")} />}
        {variant !== "icon" ? (
          Icon ? (
            <span className="ml-1.5">
              {label}
              {children}
            </span>
          ) : (
            <>
              {label}
              {children}
            </>
          )
        ) : null}
      </div>
    );
  },
);

Badge.displayName = "Badge";
export { Badge, badgeVariants };
