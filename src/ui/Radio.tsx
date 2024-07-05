"use client";

import { type ReactElement } from "react";
import { get } from "lodash";
import {
  Controller,
  useFormContext,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { RadioGroup, RadioGroupItem, type RadioProps } from "./RadioGroup";

export interface FormRadioProps<T extends FieldValues>
  extends Omit<RadioProps, "name" | "error" | "onValueChange" | "isSelected"> {
  control: Control<T>;
  name: Path<T>;
  onValueChange?: (isSelected: boolean | string) => void;
  clickableSpace?: boolean;
  value: string;
}

export const FormRadio = <T extends FieldValues>({
  name,
  control,
  onValueChange,
  clickableSpace = false,
  value,
  ...props
}: FormRadioProps<T>): ReactElement => {
  const { formState } = useFormContext<T>();
  const error = get(formState.errors, name, undefined) as FieldError | undefined;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <RadioGroup value={field.value} onValueChange={field.onChange}>
          <RadioGroupItem
            {...props}
            clickableSpace={clickableSpace}
            onValueChange={() => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            isSelected={field.value === value}
            value={value}
            isDirty={fieldState.isDirty}
            error={error?.message}
          />
        </RadioGroup>
      )}
    />
  );
};
