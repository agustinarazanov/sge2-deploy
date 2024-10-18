"use client";

import React, { useMemo, useState } from "react";
import { Autocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { type z } from "zod";
import { useEquiposQueryParam } from "../../_hooks/use-equipos-query-param";
import { type inputGetEquipos } from "@/shared/filters/equipos-filter.schema";
import { estaDentroDe } from "@/shared/string-compare";

type EquiposFilters = z.infer<typeof inputGetEquipos>;

type Props = {
  filters: EquiposFilters;
};

export const EquiposFilterLaboratorio = ({ filters }: Props) => {
  const { laboratorio, onLaboratorioChange } = useEquiposQueryParam(filters);

  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = api.admin.laboratorios.getAll.useQuery({ sedeId: undefined });

  const laboratorios = useMemo(() => {
    if (!data) return [];

    return data.laboratorios
      .map((item) => {
        const { id, nombre, sede } = item;
        return {
          id: id,
          label: `${nombre} (${sede.nombre})`,
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  const currentLaboratorio = useMemo(() => {
    if (!laboratorios) return null;

    return laboratorios.find((item) => String(item.id) === laboratorio);
  }, [laboratorios, laboratorio]);

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
              id="selectLaboratorio"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando laboratorios" />
            </SelectTrigger>
          </div>
        </Select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Autocomplete
        async
        items={laboratorios}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
            <span>No se encontró el laboratorio</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por laboratorio"
        clearable
        debounceTime={0}
        value={currentLaboratorio}
        onChange={(value) => onLaboratorioChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};
