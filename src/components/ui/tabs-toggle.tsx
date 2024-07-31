"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";
import { cn } from "../utils";

const tabToggleVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-2 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  data-[state=active]:shadow-sm",
  {
    variants: {
      color: {
        primary: cn("data-[state=active]:bg-primary data-[state=active]:text-[#2E2F35]"),
        secondary: cn("data-[state=active]:bg-secondary data-[state=active]:text-white"),
      },
    },
    defaultVariants: {
      color: "primary",
    },
  },
);
export interface TabToggleListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  color?: "primary" | "secondary" | undefined;
}
export type TabToggleProps = {
  defaultValue?: string;
  asChild: boolean;
  disabled?: boolean;
};

export type TabToggleTriggerProps = {
  value?: string;
  displayName?: string;
  icon?: ((props: React.SVGProps<SVGSVGElement>) => React.JSX.Element) | (() => React.JSX.Element);
  onValueChange?: (value: string) => void;
};

export type TabToggleContentProps = {
  value?: string;
  children?: React.ReactNode;
};

const TabToggle = TabsPrimitive.Root;

const TabToggleList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabToggleListProps>(
  ({ className, color, children, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-md border border-[#2E2F35] p-1 text-[#8E95A2]",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return React.cloneElement(child as any, { color });
        }
        return child;
      })}
    </TabsPrimitive.List>
  ),
);
TabToggleList.displayName = TabsPrimitive.List.displayName;

const TabToggleTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & TabToggleTriggerProps
>(({ className, icon: Icon, value, displayName, disabled, color, ...props }, ref) => {
  const colorVariant = typeof color === "string" ? (color as "primary" | "secondary") : color;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabToggleVariants({ color: colorVariant }), className)}
      value={value}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={cn("size-4", displayName && "mr-2")} />}
      {displayName}
    </TabsPrimitive.Trigger>
  );
});
TabToggleTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabToggleContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-5 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Content>
));
TabToggleContent.displayName = TabsPrimitive.Content.displayName;

export { TabToggle, TabToggleList, TabToggleTrigger, TabToggleContent, tabToggleVariants };
