import * as React from "react";

import { get } from "lodash";
import { useFormContext, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";

import { cn } from "@/components/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | null;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, ...props }, ref) => {
  const id = React.useId();

  return (
    <>
      {label && (
        <label htmlFor={id} className="mb-3 text-sm">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error}</span>}
    </>
  );
});
Textarea.displayName = "Textarea";

export interface FormTextareaProps<T extends FieldValues> extends Omit<TextareaProps, "name" | "error" | "onChange"> {
  control: Control<T>;
  name: Path<T>;
}

export const FormTextarea = <T extends FieldValues>({
  control: _ctrl,
  name,
  ...props
}: FormTextareaProps<T>): React.ReactElement => {
  const { register, formState } = useFormContext<T>();
  const error = get(formState.errors, name, undefined) as FieldError | undefined;

  return <Textarea {...props} {...register(name)} error={error?.message} />;
};

export { Textarea };
