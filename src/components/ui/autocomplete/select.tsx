import { Fragment, useId, useRef, useState, type FocusEventHandler, type ReactElement, type ReactNode } from "react";
import { Label, Listbox, ListboxButton, Transition } from "@headlessui/react";
import { ChevronDownIcon, XIcon } from "lucide-react";
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

import { inputBaseStyle } from "../Input";

export interface SelectItem {
  id: number | string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export type IsMulti = boolean | undefined;

export type ItemType<TType, TMulti extends IsMulti> = TMulti extends undefined
  ? TType
  : TMulti extends true
    ? TType[]
    : TType;

export interface SelectProps<TType, TMulti extends IsMulti> {
  name?: string;
  label?: string | null;
  placeholder?: string | null;
  className?: string;
  items: TType[];
  value?: ItemType<TType, TMulti> | null;
  onChange?: (value: ItemType<TType, TMulti> | null) => void;
  onBlur?: FocusEventHandler;
  multiple?: TMulti;
  disabled?: boolean;
  isDirty?: boolean;
  isLoading?: boolean;
  clearable?: boolean;
  error?: string;
}

export const Select = <TType extends SelectItem | string, TMulti extends IsMulti = undefined>({
  label,
  placeholder,
  items,
  multiple,
  className,
  error,
  isDirty: _isDirty,
  isLoading,
  clearable = false,
  ...props
}: SelectProps<TType, TMulti>): ReactElement => {
  const id = useId();

  const popperElRef = useRef(null);
  const [targetElement, setTargetElement] = useState<HTMLButtonElement | null>(null);
  const [, setPopperElement] = useState(null);
  const valueLabel = multiple
    ? ((props.value ?? []) as SelectItem[]).map((v) => v.label).join(", ")
    : (props.value as SelectItem | undefined)?.label;

  const onClear = (e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    e.preventDefault();
    let value: ItemType<TType, TMulti> | null = null;
    if (multiple) value = [] as unknown as ItemType<TType, TMulti>;
    props.onChange?.(value);
    targetElement?.blur();
  };

  const canClear = clearable && valueLabel;

  return (
    <div className={cn("relative", className)}>
      <Listbox
        as={Fragment}
        {...props}
        value={multiple ? ((props.value ?? []) as ItemType<TType, TMulti>) : (props.value ?? null)}
        multiple={multiple}
      >
        {({ open }) => (
          <>
            {label && (
              <Label htmlFor={id} className="mb-3 block text-sm dark:text-input-label">
                {label}
              </Label>
            )}
            <ListboxButton
              ref={setTargetElement}
              id={id}
              className={cn(inputBaseStyle, "relative !w-full text-left", {
                "!border-input-active": open,
                "text-input-placeholder": !valueLabel,
              })}
            >
              {valueLabel ?? placeholder ?? <>&nbsp;</>}
              {canClear && (
                <XIcon
                  onClick={onClear}
                  className={cn(
                    "absolute right-10 top-1/2 h-5 -translate-y-1/2 select-none transition ease-in-out",
                    "hover:text-primary",
                  )}
                />
              )}
              <ChevronDownIcon
                className={cn(
                  "pointer-events-none absolute right-3 top-1/2 h-5 -translate-y-1/2 select-none transition ease-in-out",
                  {
                    "rotate-180": open,
                  },
                )}
              />
            </ListboxButton>
            {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error}</span>}
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              beforeEnter={() => setPopperElement(popperElRef.current)}
              afterLeave={() => setPopperElement(null)}
            >
              <Listbox.Options
                className={cn(
                  "ring-none absolute z-50 max-h-80 w-full rounded-b border border-input bg-menu shadow-lg outline-none",
                )}
                static
              >
                {isLoading ? (
                  <span className={cn("flex w-full items-center justify-center px-4 py-3 text-sm text-menu-item")}>
                    Loading...
                  </span>
                ) : (
                  items.map((item) => (
                    <Listbox.Option
                      key={`select-item-${typeof item === "string" ? item : item.id}`}
                      value={item}
                      disabled={(props.disabled ?? typeof item === "string") ? false : item.disabled}
                      className={({ active }) =>
                        cn(
                          "group flex w-full items-center space-x-2 px-4 py-3 text-sm",
                          active ? "bg-menu-item-active text-menu-item-active" : "text-menu-item",
                        )
                      }
                    >
                      {typeof item !== "string" && item.icon && <span className="mr-3">{item.icon}</span>}
                      {typeof item === "string" ? item : item.label}
                    </Listbox.Option>
                  ))
                )}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
};

export interface FormSelectProps<
  T extends FieldValues,
  TType extends SelectItem | string,
  TMulti extends IsMulti = undefined,
> extends Omit<SelectProps<TType, TMulti>, "name" | "error" | "value"> {
  control: Control<T>;
  name: Path<T>;
}

export const FormSelect = <
  T extends FieldValues,
  TType extends SelectItem | string,
  TMulti extends IsMulti = undefined,
>({
  name,
  control,
  ...props
}: FormSelectProps<T, TType, TMulti>): ReactElement => {
  const { formState } = useFormContext<T>();
  const error = get(formState.errors, name, undefined) as FieldError | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = field.value as (string | number) | (string | number)[];
        let value = null;
        if (props.multiple && Array.isArray(selected) && props.items.length > 0) {
          if (typeof props.items[0] === "string") {
            value = selected;
          } else {
            value = props.items.filter((item) => selected.includes((item as SelectItem).id));
          }
        }
        if (!props.multiple && !Array.isArray(selected) && props.items.length > 0) {
          value = props.items.find((item) => {
            if (typeof item === "string") return item === selected;
            return item.id === selected;
          });
        }

        return (
          <Select
            {...props}
            value={value as ItemType<TType, TMulti>}
            onChange={(value) => {
              props.onChange?.(value);
              if (!value) field.onChange?.(value as PathValue<T, Path<T>>);
              if (Array.isArray(value)) {
                field.onChange?.(
                  value.map((v) => {
                    if (typeof v === "string") return v;
                    return v.id;
                  }) as PathValue<T, Path<T>>,
                );
              } else {
                field.onChange((typeof value === "string" ? value : value?.id) as PathValue<T, Path<T>>);
              }
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
