import { useMemo, type ReactElement } from "react";
import type { Path, FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { FormSelect, type FormSelectProps } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue } from "@/components/ui";

export const SelectLaboratorioForm = <T extends FieldValues, TType extends string>({
  name,
  control,
  className,
  ...props
}: Omit<FormSelectProps<T, TType>, "items"> & { sedeId?: number; realNameId?: Path<T> }): ReactElement => {
  const { data, isLoading, isError } = api.admin.laboratorios.getAll.useQuery({ sedeId: props.sedeId?.toString() });

  const laboratorios = useMemo(() => {
    if (!data) return [];

    return data.laboratorios
      .map((laboratorio) => {
        const { id, nombre: label } = laboratorio;

        return {
          label,
          id: String(id),
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
    <FormSelect
      isLoading={isLoading}
      className={className}
      name={name}
      control={control}
      items={laboratorios}
      label={"Seleccioná un laboratorio"}
      {...props}
    />
  )
};
