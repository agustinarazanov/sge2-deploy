import { useId, useState, type FocusEventHandler, type ReactElement, type ReactNode } from "react";
import { Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { get } from "lodash";
import {
  Controller,
  useFormContext,
  type Control,
  type FieldError,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";

import { cn } from "../../utils";

export interface ISelectItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export type ISelectItemType<TType> = TType;

export interface SelectSelectProps<TType> {
  name?: string;
  label?: string | null;
  placeholder?: string | null;
  className?: string;
  items: TType[];
  value?: string | ISelectItem | null;
  onChange?: (value: string | null | undefined) => void;
  onBlur?: FocusEventHandler;
  disabled?: boolean;
  isDirty?: boolean;
  isLoading?: boolean;
  clearable?: boolean;
  error?: string;
}

export const CustomSelect = <TType extends ISelectItem | string>({
  label,
  placeholder,
  className,
  error,
  isDirty: _isDirty,
  isLoading,
  ...props
}: SelectSelectProps<TType>): ReactElement => {
  const [key, setKey] = useState(+new Date());
  const id = useId();

  const handleChange = (newValue: string) => {
    props.onChange?.(newValue);
  };

  const currentValue = typeof props.value === "string" ? props.value : props.value?.id;

  const handleClear = () => {
    props.onChange?.(undefined);
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label htmlFor={id} className="mb-3 block text-sm">
          {label}
        </Label>
      )}
      <Select key={key} value={currentValue} onValueChange={handleChange}>
        <SelectTrigger className="w-full bg-input">
          {isLoading ? <SelectValue placeholder={"Cargando..."} /> : <SelectValue placeholder={placeholder ?? ""} />}
        </SelectTrigger>
        <SelectContent id={id} className="hover:bg-card mt-1 max-h-[300px] overflow-y-auto bg-menu text-black">
          {props.items.map((item) => {
            if (typeof item === "string") {
              return (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              );
            }

            return (
              <SelectItem key={item.id} value={String(item.id)}>
                <div className="flex w-full flex-row items-center gap-x-4">
                  {item.icon}
                  {item.label}
                </div>
              </SelectItem>
            );
          })}
          {props.clearable && (
            <Button
              className="w-full border-none px-2"
              color="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
                setKey(+new Date());
              }}
            >
              Limpiar
            </Button>
          )}
        </SelectContent>
      </Select>
      {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error}</span>}
    </div>
  );
};

export interface FormSelectProps<T extends FieldValues, TType extends ISelectItem | string>
  extends Omit<SelectSelectProps<TType>, "name" | "error" | "value"> {
  control: Control<T>;
  name: Path<T>;
}

export const FormSelect = <T extends FieldValues, TType extends ISelectItem | string>({
  name,
  control,
  ...props
}: FormSelectProps<T, TType>): ReactElement => {
  const { formState } = useFormContext<T>();
  const error = get(formState.errors, name, undefined) as FieldError | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = field.value as (string | number) | (string | number)[];
        let value = null;

        value = props.items.find((item) => {
          if (typeof item === "string") return item === selected;
          return item.id === selected;
        });

        return (
          <CustomSelect
            {...props}
            value={value}
            onChange={(value) => {
              props.onChange?.(value);
              value && field.onChange?.(value as PathValue<T, Path<T>>);
            }}
            onBlur={field.onBlur}
            isDirty={fieldState.isDirty}
            error={error?.message}
          />
        );
      }}
    />
  );
};
