import { useMemo, useState, type ReactElement } from "react";
import { type Path, type FieldValues, useFormContext, type FieldError, Controller } from "react-hook-form";
import { api } from "@/trpc/react";
import { type FormSelectProps } from "@/components/ui/autocomplete";
import { FormAutocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";
import { MultiSelectFormField } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/components/utils";
import { get } from "lodash";

export const getUserLabelNameForSelect = ({
  nombre,
  name,
  apellido,
  legajo,
}: {
  nombre: string | null;
  name: string;
  apellido: string | null;
  legajo: string | null;
}) => `${nombre ?? name} ${apellido} (${legajo ? legajo : "-"})`;

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

      return {
        label: getUserLabelNameForSelect({ nombre, name, apellido, legajo }),
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
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
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

export const SelectMultipleUsuarioForm = <T extends FieldValues, TType extends string>({
  ...props
}: Omit<FormSelectProps<T, TType>, "items">): ReactElement => {
  const { className, name, control } = props;
  const { formState } = useFormContext<T>();

  const error = get(formState.errors, name, undefined) as FieldError | undefined;

  const { data, isLoading, isError } = api.admin.usuarios.getAll.useQuery({});

  const usuarios = useMemo(() => {
    if (!data || data.usuarios.length === 0) return [];

    return data.usuarios.map((usuario) => {
      const { id, nombre, name, apellido, legajo } = usuario;

      return {
        label: getUserLabelNameForSelect({ nombre, name, apellido, legajo }),
        value: id,
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
            id="selectMateria"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando materias" />
          </SelectTrigger>
        </div>
      </Select>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <>
            <MultiSelectFormField
              className={className}
              options={usuarios}
              disabled={isLoading}
              defaultValue={field.value}
              onValueChange={field.onChange}
              placeholder="Selecciona usuarios"
              variant="secondary"
            />
            {error && <span className={cn("ml-1 mt-2 block text-xs text-danger")}>{error?.message}</span>}
          </>
        );
      }}
    ></Controller>
  );
};
