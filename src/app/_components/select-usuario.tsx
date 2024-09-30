import { useMemo, useState, type ReactElement } from "react";
import { type Path, type FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { type FormSelectProps } from "@/components/ui/autocomplete";
import { FormAutocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";

export const SelectUsuarioForm = <T extends FieldValues, TType extends string>({
  name,
  control,
  className,
  ...props
}: Omit<FormSelectProps<T, TType>, "items"> & { realNameId?: Path<T> }): ReactElement => {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = api.admin.usuarios.getAll.useQuery({
    searchText: query,
  });

  const usuarios = useMemo(() => {
    if (!data || data.usuarios.length === 0) return [];

    return data.usuarios.map((usuario) => {
      const { id, nombre, name, apellido, legajo } = usuario;

      const label = `${nombre ?? name} ${apellido} (${legajo ? legajo : "-"})`;

      return {
        label,
        id,
      };
    });
  }, [data]);

  if (isError) {
    return (
      <Select>
        <div className="flex flex-row items-center space-x-2">
          <SelectTrigger
            disabled
            id="selectUsuario"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando usuarios" />
          </SelectTrigger>
        </div>
      </Select>
    );
  }

  return (
    <FormAutocomplete
      async
      items={usuarios}
      noOptionsComponent={
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm text-white">
          <span>No se encontró al usuario</span>
        </div>
      }
      className={className}
      onQueryChange={setQuery}
      isLoading={isLoading}
      placeholder="Buscar usuario"
      clearable
      debounceTime={500}
      control={control}
      name={name}
      {...props}
    />
  );
};
