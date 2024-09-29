import { useMemo, type ReactElement } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { type FormSelectProps, type IsMulti, type SelectItem } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue } from "@/components/ui";
import { cn } from "@/components/utils";

export const SelectSedeForm = <
  T extends FieldValues,
  TType extends SelectItem | string,
  TMulti extends IsMulti = undefined,
>({
  name,
  control,
  className,
  // ...props
}: Omit<FormSelectProps<T, TType, TMulti>, "items">): ReactElement => {
  const { data, isLoading, isError } = api.admin.laboratorios.getAllSedes.useQuery();

  const sedes = useMemo(() => {
    if (!data) return [];

    return data.map((sede) => {
      const { id, nombre: label } = sede;

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
            id="selectSede"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando sedes" />
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
          <select
            className={cn(
              "h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover",
              className,
            )}
            name={name}
            onChange={field.onChange}
            value={field.value}
          >
            {sedes.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              );
            })}
          </select>
        );
      }}
    />
  );

  // // @ts-expect-error - The expected type comes from property 'items' which is declared on type 'FormSelectProps<...>'
  // return <FormSelect className={className} name={name} control={control} items={sedes} {...props} />;
};
