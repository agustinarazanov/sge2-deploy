import { useMemo, type ReactElement } from "react";
import { type FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { FormSelect, type FormSelectProps, type IsMulti, type SelectItem } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue } from "@/components/ui";

export const SelectEstanteForm = <
  T extends FieldValues,
  TType extends SelectItem | string,
  TMulti extends IsMulti = undefined,
>({
  name,
  control,
  className,
  ...props
}: Omit<FormSelectProps<T, TType, TMulti>, "items"> & { armarioId?: number }): ReactElement => {
  const { data, isLoading, isError } = api.admin.laboratorios.getAllEstantes.useQuery(
    { armarioId: props.armarioId! },
    { enabled: !!props.armarioId },
  );

  const estantes = useMemo(() => {
    if (!data) return [];

    return data.map((estante) => {
      const { id, nombre: label } = estante;

      return {
        label,
        id,
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
            id="selectEstante"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando estantes" />
          </SelectTrigger>
        </div>
      </Select>
    );
  }

  return (
    <FormSelect
      className={className}
      name={name}
      control={control}
      // @ts-expect-error - The expected type comes from property 'items' which is declared on type 'FormSelectProps<...>'
      items={estantes}
      {...props}
      disabled={!props.armarioId || props.disabled}
    />
  );
};
