import { useMemo, useState, type ReactElement } from "react";
import type { Path, FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { type FormSelectProps } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAutocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";
import { estaDentroDe } from "@/shared/string-compare";

export const SelectLaboratorioForm = <T extends FieldValues, TType extends string>({
  name,
  control,
  className,
  ...props
}: Omit<FormSelectProps<T, TType>, "items"> & { sedeId?: number; realNameId?: Path<T> }): ReactElement => {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = api.admin.laboratorios.getAll.useQuery({ sedeId: props.sedeId?.toString() });

  const laboratorios = useMemo(() => {
    if (!data) return [];

    return data.laboratorios
      .map((laboratorio) => {
        const { id, nombre: label } = laboratorio;

        return {
          label,
          id,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

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
    <FormAutocomplete
      async
      items={laboratorios}
      noOptionsComponent={
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm text-white">
          <span>No se encontró el laboratorio</span>
        </div>
      }
      className={className}
      onQueryChange={setQuery}
      isLoading={isLoading}
      placeholder="Buscar por laboratorio"
      clearable
      debounceTime={0}
      control={control}
      name={name}
      {...props}
    />
  );
};
