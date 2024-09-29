import { api } from "@/trpc/react";
import { useMemo, useState } from "react";
import { estaDentroDe } from "@/shared/string-compare";
import { Skeleton } from "@/components/ui/skeleton";
import { Autocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";

type Props = {
  onEquipoTipoChange: (rol: string) => void;
  label?: string;
  disabled?: boolean;
};

export const EquipoTipoSelector = ({ onEquipoTipoChange, label, disabled }: Props) => {
  const { data, isLoading, isError } = api.equipos.getAllTipos.useQuery({ tipoId: undefined });

  const [query, setQuery] = useState("");

  const equiposTipo = useMemo(() => {
    if (!data) return [];

    return data.tipos
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
              id="selectEquipoTipo"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando equipos" />
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
        items={equiposTipo}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm text-white">
            <span>No se encontraron equipos</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por tipo de equipo"
        clearable
        debounceTime={0}
        onChange={(value) => value && onEquipoTipoChange(value?.id ? String(value.id) : "")}
        disabled={disabled}
      />
    </div>
  );
};
