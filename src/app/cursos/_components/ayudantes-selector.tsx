import { api } from "@/trpc/react";
import { useMemo, useState } from "react";
import { estaDentroDe } from "@/shared/string-compare";
import { Skeleton } from "@/components/ui/skeleton";
import { Autocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";

type Props = {
  onAyudanteChange: (rol: string) => void;
  currentAyudanteId?: number;
  cursoId: number;
  label?: string;
};

export const AyudantesSelector = ({ onAyudanteChange, currentAyudanteId, label, cursoId }: Props) => {
  const { data, isLoading, isError } = api.cursos.cursoPorId.useQuery({ id: cursoId });

  const [query, setQuery] = useState("");

  const ayudantes = useMemo(() => {
    if (!data?.ayudantes) return [];

    return data.ayudantes
      .map((item) => {
        const { id, nombre } = item.usuario;
        return {
          id: id,
          label: nombre ?? "",
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  const currentAyudante = useMemo(() => {
    if (!ayudantes) return null;

    return ayudantes.find((item) => currentAyudanteId?.toString() === item.data.usuario.id);
  }, [ayudantes, currentAyudanteId]);

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
              id="selectAyudante"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando ayudantes" />
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
        items={ayudantes}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm text-white">
            <span>No se encontraron ayudantes</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por nombre de ayudante"
        clearable
        debounceTime={0}
        value={currentAyudante}
        onChange={(value) => onAyudanteChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};
