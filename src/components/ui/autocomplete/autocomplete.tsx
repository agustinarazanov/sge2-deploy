"use client";

import { Fragment, useEffect, useId, useMemo, useRef, useState, type ReactElement } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { debounce, get } from "lodash";
import { ChevronDownIcon, Loader2, XIcon } from "lucide-react";
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
import { type IsMulti, type ItemType, type SelectItem, type SelectProps } from "./select";

interface AutocompleteProps<TType extends SelectItem | string, TMulti extends IsMulti = undefined>
  extends SelectProps<TType, TMulti> {
  async?: boolean;
  onQueryChange?: (value: string) => void;
  labelTooltip?: React.ReactNode;
  noOptionsComponent?: React.ReactNode;
  debounceTime?: number;
}

export const Autocomplete = <TType extends SelectItem | string, TMulti extends IsMulti = undefined>({
  async,
  onQueryChange,
  label,
  placeholder,
  items,
  multiple,
  labelTooltip,
  className,
  error,
  isDirty: _isDirty,
  isLoading,
  clearable = false,
  noOptionsComponent,
  debounceTime = 500,
  ...props
}: AutocompleteProps<TType, TMulti>): ReactElement => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  const [query, setQuery] = useState("");

  const filteredList = useMemo(() => {
    if (async ?? !query) return items;
    const filtered = items.filter((v) => {
      const val = typeof v === "string" ? v : v.label;
      return val.toLowerCase().includes(query.toLowerCase());
    });
    return filtered;
  }, [async, query, items]);

  const onSearch =
    debounceTime === 0
      ? onQueryChange
      : debounce((value: string): void => {
          onQueryChange?.(value);
        }, debounceTime);

  useEffect(() => {
    if (!inputWrapperRef.current) return;
    setTop((inputWrapperRef.current?.offsetTop ?? 0) + 41);
  }, []);

  const onChange = (item: ItemType<TType, TMulti> | null): void => {
    if (!multiple) return props.onChange?.(item);
    const arr = (item ?? []) as TType[];
    const newValue = [...new Set(arr)];
    return props.onChange?.(newValue as ItemType<TType, TMulti>);
  };

  const canClear = useMemo(() => {
    if (!clearable) return false;
    if (multiple && ((props.value ?? []) as TType[]).length === 0) return false;
    if (!multiple && !(props.value ?? null)) return false;
    return true;
  }, [clearable, props.value, multiple]);

  const onClear = (e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    e.preventDefault();
    onChange(null);
    inputRef.current?.focus();
    inputRef.current?.blur();
  };

  return (
    <div className={cn("group relative", className)}>
      <Combobox
        as={Fragment}
        {...props}
        // @ts-expect-error library error
        value={multiple ? ((props.value ?? []) as ItemType<TType, TMulti>) : (props.value ?? null)}
        // @ts-expect-error library error
        onChange={onChange}
        // @ts-expect-error library error
        multiple={multiple as false | undefined}
        nullable
      >
        {({ open }) => (
          <>
            {!label ? null : !labelTooltip ? (
              <Combobox.Label htmlFor={id} className="mb-3 block text-sm text-input-label">
                {label}
              </Combobox.Label>
            ) : (
              <div className="mb-3 flex items-center gap-2 text-sm text-input-label">
                {label}
                {labelTooltip}
              </div>
            )}
            <div ref={inputWrapperRef} className="relative w-full">
              <Combobox.Input
                autoComplete="off"
                id={id}
                ref={inputRef}
                onChange={(event) => {
                  const value = event.target.value;
                  if (!async) {
                    setQuery(value);
                  } else {
                    onSearch?.(value);
                  }
                }}
                placeholder={placeholder ?? undefined}
                displayValue={(p) =>
                  (multiple
                    ? ((p ?? []) as SelectItem[]).map((v) => v.label).join(", ")
                    : (p as SelectItem | undefined)?.label) ?? ""
                }
                className={({ open }) =>
                  cn(
                    inputBaseStyle,
                    "!w-full pr-10 group-focus-within:!border-input-active group-hover:border-input-hover group-active:!border-input-active",
                    "disabled:group-focus-within:!border-disabled disabled:group-active:!border-disabled",
                    {
                      "rounded-b-none": open,
                      "pr-16": isLoading,
                    },
                  )
                }
              />
              <div
                className={cn("absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-end", {
                  "!text-disabled": props.disabled,
                })}
              >
                {isLoading ? (
                  <Loader2 className="block h-4 w-4" />
                ) : (
                  canClear && <XIcon onClick={onClear} className="mr-1 h-5 cursor-pointer hover:text-primary" />
                )}
                <Combobox.Button className={cn({ "ml-2": isLoading })}>
                  <ChevronDownIcon
                    key={`autocomplete-indicator`}
                    className={cn("h-5 transition ease-in-out", {
                      "rotate-180": open,
                    })}
                  />
                </Combobox.Button>
              </div>
            </div>
            {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error}</span>}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Combobox.Options
                style={{ top: `${top}px` }}
                className={cn(
                  "ring-none custom-scrollbar absolute z-50 max-h-80 w-full overflow-y-auto rounded-b border border-input bg-menu shadow-lg outline-none",
                )}
              >
                {filteredList.map((item) => {
                  const id = typeof item === "string" ? item : item.id;
                  const label = typeof item === "string" ? item : item.label;
                  const icon = typeof item === "string" ? null : item.icon;
                  const disabled = (props.disabled ?? typeof item === "string") ? false : item.disabled;
                  return (
                    <Combobox.Option
                      key={`autocomplete-option-${id}`}
                      value={item}
                      disabled={disabled}
                      className={({ active }) =>
                        cn(
                          "group flex w-full items-center px-4 py-3 text-sm",
                          active ? "bg-menu-item-active text-menu-item-active" : "text-menu-item",
                        )
                      }
                    >
                      {icon && <span className="mr-3">{icon}</span>}
                      {label}
                    </Combobox.Option>
                  );
                })}
                {!filteredList.length &&
                  (noOptionsComponent ?? (
                    <span className={cn("flex w-full items-center justify-center px-4 py-3 text-sm text-menu-item")}>
                      No options
                    </span>
                  ))}
              </Combobox.Options>
            </Transition>
          </>
        )}
      </Combobox>
    </div>
  );
};

export interface FormAutocompleteProps<
  T extends FieldValues,
  TType extends SelectItem | string,
  TMulti extends IsMulti = undefined,
> extends Omit<AutocompleteProps<TType, TMulti>, "name" | "error" | "value" | "onChange" | "isDirty"> {
  control: Control<T>;
  name: Path<T>;
  labelTooltip?: React.ReactNode;
  noOptionsComponent?: React.ReactNode;
}

export const FormAutocomplete = <
  T extends FieldValues,
  TType extends SelectItem | string,
  TMulti extends IsMulti = undefined,
>({
  name,
  control,
  ...props
}: FormAutocompleteProps<T, TType, TMulti>) => {
  const { formState } = useFormContext<T>();
  const error = get(formState.errors, name, undefined) as FieldError | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Autocomplete
          {...props}
          value={field.value as PathValue<T, Path<T>>}
          onChange={(value) => field.onChange(value as PathValue<T, Path<T>>)}
          onBlur={field.onBlur}
          isDirty={fieldState.isDirty}
          error={error?.message}
        />
      )}
    />
  );
};
