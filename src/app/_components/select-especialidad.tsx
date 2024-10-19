import { useMemo, type ReactElement } from "react";
import { type FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { FormSelect, type ISelectItem, type FormSelectProps } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { Label, Select, SelectTrigger, SelectValue } from "@/components/ui";

export const SelectEspecialidadForm = <T extends FieldValues, TType extends ISelectItem | string>({
  name,
  control,
  className,
  ...props
}: Omit<FormSelectProps<T, TType>, "items">): ReactElement => {
  const { data, isLoading, isError } = api.admin.usuarios.getAllTutoresEspecialidades.useQuery();

  const especialidades = useMemo(() => {
    if (!data) return [];

    return data.map((especialidad) => {
      return {
        label: especialidad,
        id: especialidad,
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
            id="selectSede"
            className="group-hover:border-input-hover h-10 transition-colors focus:border-primary focus:ring-0"
          >
            <SelectValue placeholder="Error cargando especialidades" />
          </SelectTrigger>
        </div>
      </Select>
    );
  }

  if (!especialidades.length) {
    return (
      <div className="mt-2">
        {props.label && <Label className="mb-3 block text-sm">{props.label}</Label>}
        <Select>
          <div className="flex flex-row items-center space-x-2">
            <SelectTrigger
              disabled
              id="selectSede"
              className="group-hover:border-input-hover h-10 transition-colors focus:border-primary focus:ring-0"
            >
              <SelectValue placeholder="No hay especialidades" />
            </SelectTrigger>
          </div>
        </Select>
      </div>
    );
  }

  return (
    <FormSelect
      isLoading={isLoading}
      className={className}
      name={name}
      control={control}
      items={especialidades}
      label={"Selecciona una especialidad"}
      clearable
      {...props}
    />
  );
};
