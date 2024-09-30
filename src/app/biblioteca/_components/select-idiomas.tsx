import { useMemo, type ReactElement } from "react";
import { type FieldValues } from "react-hook-form";
import { api } from "@/trpc/react";
import { FormSelect, type FormSelectProps } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue } from "@/components/ui";

export const SelectIdiomasForm = <T extends FieldValues, TType extends string>({
  name,
  control,
  className,
  ...props
}: Omit<FormSelectProps<T, TType>, "items">): ReactElement => {
  const { data, isLoading, isError } = api.biblioteca.getAllIdiomas.useQuery();

  const idiomas = useMemo(() => {
    if (!data) return [];

    return data.map((idioma) => {
      const { id, idioma: label } = idioma;

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
            id="selectIdioma"
            className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
          >
            <SelectValue placeholder="Error cargando idiomas" />
          </SelectTrigger>
        </div>
      </Select>
    );
  }

  // @ts-expect-error - The expected type comes from property 'items' which is declared on type 'FormSelectProps<...>'
  return <FormSelect className={className} name={name} control={control} items={idiomas} {...props} />;
};
