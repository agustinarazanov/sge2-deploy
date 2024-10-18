import { useMemo, useState, type ReactElement } from "react";
import { type Path, type FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { type FormSelectProps } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAutocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";
import { estaDentroDe } from "@/shared/string-compare";

export const SelectTipoForm = <T extends FieldValues, TType extends string>({
  name,
  control,
  className,
  ...props
}: Omit<FormSelectProps<T, TType>, "items"> & { tipoId?: number } & { realNameId?: Path<T> }): ReactElement => {
  const { data, isLoading, isError } = api.equipos.getAllTipos.useQuery({ tipoId: props.tipoId, fromFilter: "true" });

  const [query, setQuery] = useState("");

  const tipos = useMemo(() => {
    if (!data) return [];

    return data.tipos
      .map((tipo) => {
        const { id, nombre: label } = tipo;

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
            id="selectTipo"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando tipos" />
          </SelectTrigger>
        </div>
      </Select>
    );
  }

  return (
    <FormAutocomplete
      async
      items={tipos}
      noOptionsComponent={
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
          <span>No se encontró el tipo</span>
        </div>
      }
      className={className}
      onQueryChange={setQuery}
      isLoading={isLoading}
      placeholder="Buscar por tipo"
      clearable
      debounceTime={0}
      control={control}
      name={name}
      {...props}
    />
  );
};
