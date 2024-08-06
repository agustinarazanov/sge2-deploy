import { api } from "@/trpc/react";
import { useMemo, useState } from "react";
import { estaDentroDe } from "@/shared/string-compare";
import { Skeleton } from "@/components/ui/skeleton";
import { Autocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";

type Props = {
  onPermisoChange: (permiso: string) => void;
  currentPermisoId?: number;
  label?: string;
};

export const PermisosSelector = ({ onPermisoChange, currentPermisoId, label }: Props) => {
  const { data, isLoading, isError } = api.admin.roles.getAllPermisos.useQuery();

  const [query, setQuery] = useState("");

  const permisos = useMemo(() => {
    if (!data) return [];

    return data
      .map((item) => {
        const { id, nombre } = item;
        return {
          id: id,
          label: `${nombre} `,
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  const currentPermiso = useMemo(() => {
    if (!permisos) return null;

    return permisos.find((item) => currentPermisoId === item.id);
  }, [permisos, currentPermisoId]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-row items-center space-x-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full">
        <Select>
          <div className="flex flex-row items-center space-x-2">
            <SelectTrigger
              disabled
              id="selectPermiso"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando permisos" />
            </SelectTrigger>
          </div>
        </Select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Autocomplete
        label={label ?? ""}
        async
        items={permisos}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
            <span>No se encontraron permisos</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por nombre de permiso"
        clearable
        debounceTime={0}
        value={currentPermiso}
        onChange={(value) => onPermisoChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};
