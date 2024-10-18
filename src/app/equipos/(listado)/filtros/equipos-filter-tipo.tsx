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

export const EquiposFilterTipo = ({ filters }: Props) => {
  const { tipo, onTipoChange } = useEquiposQueryParam(filters);

  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = api.equipos.getAllTipos.useQuery({ tipoId: undefined, fromFilter: "true" });

  const tipos = useMemo(() => {
    if (!data) return [];

    return data.tipos
      .map((item) => {
        const { id, nombre } = item;
        return {
          id: id,
          label: `${nombre}`,
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  const currentTipo = useMemo(() => {
    if (!tipos) return null;

    return tipos.find((item) => String(item.id) === tipo);
  }, [tipos, tipo]);

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
              id="selectTipo"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando tipos de equipos" />
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
        items={tipos}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
            <span>No se encontró el tipo de equipo</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por tipo"
        clearable
        debounceTime={0}
        value={currentTipo}
        onChange={(value) => onTipoChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};
