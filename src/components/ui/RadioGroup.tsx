"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { Label } from "./Label";
import { cn } from "@/components/utils";

export type RadioProps = {
  label?: React.ReactNode | string;
  disabled?: boolean;
  isSelected?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (isSelected: boolean) => void;
  required?: boolean;
  clickableSpace?: boolean;
  error?: string;
  isDirty?: boolean;
  className?: string;
};

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & RadioProps
>(({ className, label, disabled, clickableSpace, isSelected, isDirty: _isDirty, ...props }, ref) => {
  const handleClick = () => {
    if (clickableSpace && !disabled && props.onValueChange) {
      props.onValueChange(!isSelected);
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <RadioGroupPrimitive.Item
        ref={ref}
        disabled={disabled}
        className={cn("aspect-square h-4 w-4 rounded-full border border-[#2C2D33] bg-gray-500 text-[#2C2D33]", {
          "cursor-not-allowed": disabled,
        })}
        onClick={handleClick}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2 w-2 rounded-full fill-primary" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      <div className="flex w-full flex-col">
        {label && (
          <Label
            htmlFor={props.id}
            className={cn({
              "opacity-50": disabled,
              "cursor-pointer": clickableSpace,
              "text-white": clickableSpace,
              "w-full": clickableSpace,
              "py-2": clickableSpace,
            })}
            onClick={handleClick}
          >
            {label}
          </Label>
        )}
        {props.error && <span className={cn("text-xs text-danger")}>{props.error}</span>}
      </div>
    </div>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
