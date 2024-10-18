import { api } from "@/trpc/react";
import { useMemo, useState } from "react";
import { estaDentroDe } from "@/shared/string-compare";
import { Skeleton } from "@/components/ui/skeleton";
import { Autocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";

type Props = {
  onRolChange: (rol: string) => void;
  currentRolId?: number;
  label?: string;
};

export const RolesSelector = ({ onRolChange, currentRolId, label }: Props) => {
  const { data, isLoading, isError } = api.admin.roles.getAllRoles.useQuery();

  const [query, setQuery] = useState("");

  const roles = useMemo(() => {
    if (!data?.roles) return [];

    return data.roles
      .map((item) => {
        const { id, nombre } = item;
        return {
          id: id,
          label: nombre,
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  const currentRol = useMemo(() => {
    if (!roles) return null;

    return roles.find((item) => currentRolId === item.id);
  }, [roles, currentRolId]);

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
              id="selectRol"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando roles" />
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
        items={roles}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
            <span>No se encontraron roles</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por nombre de rol"
        clearable
        debounceTime={0}
        value={currentRol}
        onChange={(value) => onRolChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};
