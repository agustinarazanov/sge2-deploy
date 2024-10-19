"use client";

import { forwardRef, memo, useId, type InputHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { get } from "lodash";
import { useFormContext, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";

import { cn } from "@/components/utils";
import { Calendar, Clock } from "lucide-react";

import "./input.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label?: string | null;
  placeholder?: string | null;
  unit?: string | ReactNode;
  error?: string;
  isDirty?: boolean;
}

export const inputBaseStyle = cn(
  "shadow-none outline-none focus:!ring-0 transition-colors min-w-[90px] w-auto min-h-[41px] max-h-[41px]",
  "px-4 py-[9px] bg-input focus:border-input-active border border-input rounded-md focus:rounded-md hover:border-input-hover placeholder:text-sm",
  "disabled:!text-disabled disabled:!border-disabled disabled:focus:!border-disabled",
);

const calendarIconStyle = cn("h-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer");

export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, isDirty: _isDirty, unit, placeholder, ...props }, ref): ReactElement => {
      const id = useId();
      const isDate = ["date", "datetime-local", "week", "month"].includes(props.type ?? "text");
      const isTime = props.type === "time";
      const hasRightIcon = !!unit || isDate || isTime;

      const focusInput = (): void => {
        const input = document.getElementById(id);
        if (input instanceof HTMLInputElement && "showPicker" in input) {
          if (props.readOnly) return;

          // TODO: weird error happening here. tsc is failing for some reason
          // error TS2339: Property 'showPicker' does not exist on type 'never'.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          (input as any).showPicker();
        }
      };

      return (
        <div className={cn("flex flex-col", className)}>
          {label && (
            <label htmlFor={id} className="mb-3 text-sm">
              {label}
            </label>
          )}
          <div
            className={cn("relative w-full", {
              "!text-disabled": props.disabled,
            })}
          >
            {props.prefix ? (
              <div className={cn("absolute left-3 top-1/2 min-h-5 -translate-y-1/2")}>{props.prefix}</div>
            ) : null}
            <input
              {...props}
              placeholder={placeholder ?? undefined}
              ref={ref}
              id={id}
              className={cn(inputBaseStyle, "!w-full", {
                "!pr-10": hasRightIcon,
                "!pl-8": props.prefix,
              })}
            />
            {unit ? (
              <div className={cn("absolute right-3 top-1/2 min-h-5 -translate-y-1/2")}>{unit}</div>
            ) : (
              <>
                {isDate && <Calendar onClick={focusInput} className={cn(calendarIconStyle)} />}
                {isTime && <Clock onClick={focusInput} className={cn(calendarIconStyle)} />}
              </>
            )}
          </div>
          {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error}</span>}
        </div>
      );
    },
  ),
);

export interface FormInputProps<T extends FieldValues> extends Omit<InputProps, "name" | "error" | "onChange"> {
  control: Control<T>;
  name: Path<T>;
}

export const FormInput = <T extends FieldValues>({
  control: _ctrl,
  name,
  ...props
}: FormInputProps<T>): ReactElement => {
  const { register, formState, getFieldState } = useFormContext<T>();
  const error = get(formState.errors, name, undefined) as FieldError | undefined;

  const state = getFieldState(name);

  return (
    <Input
      {...props}
      {...register(name, props.type === "number" ? { valueAsNumber: true } : {})}
      isDirty={state.isDirty}
      error={error?.message}
    />
  );
};
