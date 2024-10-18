import { useMemo, useState, type ReactElement } from "react";
import { type Path, type FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { type IsMulti, type SelectItemAutocomplete } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAutocomplete, type FormAutocompleteProps, Select, SelectTrigger, SelectValue } from "@/components/ui";
import { estaDentroDe } from "@/shared/string-compare";

export const SelectTutorForm = <
  T extends FieldValues,
  TType extends SelectItemAutocomplete | string,
  TMulti extends IsMulti = undefined,
>({
  name,
  control,
  className,
  ...props
}: Omit<FormAutocompleteProps<T, TType, TMulti>, "items"> & { realNameId?: Path<T> }): ReactElement => {
  const { data, isLoading, isError } = api.admin.usuarios.getAllTutores.useQuery();

  const [query, setQuery] = useState("");

  const tutores = useMemo(() => {
    if (!data) return [];

    return data
      .map((usuario) => {
        const tutor = usuario.usuario;

        const label = `${tutor?.apellido ?? ""} ${tutor?.nombre ?? ""}`;

        return {
          label,
          id: tutor.id,
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
            id="selectTutor"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando tutores" />
          </SelectTrigger>
        </div>
      </Select>
    );
  }

  return (
    <FormAutocomplete
      async
      items={tutores}
      noOptionsComponent={
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
          <span>No se encontró al tutor</span>
        </div>
      }
      className={className}
      onQueryChange={setQuery}
      isLoading={isLoading}
      placeholder="Buscar por nombre de tutor"
      clearable
      debounceTime={0}
      control={control}
      name={name}
      {...props}
    />
  );
};
