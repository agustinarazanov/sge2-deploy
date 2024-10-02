"use client";

import { Select, SelectTrigger, SelectValue } from "@/components/ui";
import { MultiSelectFormField } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/utils";
import { type ReactElement, useMemo } from "react";
import {
  type Control,
  Controller,
  type FieldError,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { api } from "@/trpc/react";
import { get } from "lodash";

type LaboratorioDropdownType = {
  className?: string;
  defaultValue?: string[];
  onValueChange: (value: string[]) => void;
  error?: string;
};


/*TEST aMMend */
export const LaboratorioDropdownMultiple = (props: LaboratorioDropdownType): ReactElement => {
  const { className, defaultValue, onValueChange, error } = props;

  const { data, isLoading, isError } = api.admin.laboratorios.getAll.useQuery({});

  const laboratorios = useMemo(() => {
    if (!data) return [];

    return data.laboratorios.map((laboratorio) => {
      const { id, nombre } = laboratorio;

      return {
        label: nombre,
        value: String(id),
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-row items-center space-x-2">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Select>
        <div className="flex flex-row items-center space-x-2">
          <SelectTrigger
            disabled
            id="selectLaboratorio"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando laboratorios" />
          </SelectTrigger>
        </div>
      </Select>
    );
  }

  return (
    <>
      <MultiSelectFormField
        className={className}
        options={laboratorios}
        disabled={isLoading}
        defaultValue={defaultValue ?? []}
        onValueChange={onValueChange}
        placeholder="Selecciona un laboratorio"
        variant="secondary"
      />
      {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error}</span>}
    </>
  );
};

interface FormAutocompleteProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  labelTooltip?: React.ReactNode;
  noOptionsComponent?: React.ReactNode;
  className?: string;
}

export const LaboratorioDropdownMultipleForm = <T extends FieldValues>(
  props: FormAutocompleteProps<T>,
): ReactElement => {
  const { className, name, control } = props;
  const { formState } = useFormContext<T>();

  const error = get(formState.errors, name, undefined) as FieldError | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <LaboratorioDropdownMultiple
            className={className}
            defaultValue={field.value}
            onValueChange={field.onChange}
            error={error?.message}
            {...props}
          />
        );
      }}
    ></Controller>
  );
};
