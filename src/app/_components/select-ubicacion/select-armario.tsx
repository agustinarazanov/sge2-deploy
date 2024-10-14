import { useMemo, type ReactElement } from "react";
import { type FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { FormSelect, type FormSelectProps } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue } from "@/components/ui";

export const SelectArmarioForm = <T extends FieldValues, TType extends string>({
  name,
  control,
  className,
  ...props
}: Omit<FormSelectProps<T, TType>, "items"> & { laboratorioId?: string | number }): ReactElement => {
  const { data, isLoading, isError } = api.admin.laboratorios.getAllArmarios.useQuery(
    { laboratorioId: Number(props.laboratorioId) },
    { enabled: !!props.laboratorioId && props.laboratorioId !== "" },
  );

  const armarios: { id: string | null; label: string }[] = useMemo(() => {
    if (!data) return [];

    const nullArmario = { id: null, label: "Vacío" };

    const armarios = data.map((armario) => {
      const { id, nombre: label } = armario;

      return {
        label,
        id: String(id),
      };
    });

    return [nullArmario, ...armarios];
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
            id="selectArmarios"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando armarios" />
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
      items={armarios}
      {...props}
      disabled={!props.laboratorioId || props.disabled}
    />
  );
};
