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

export const EquiposFilterArmario = ({ filters }: Props) => {
  const { armario, onArmarioChange } = useEquiposQueryParam(filters);

  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = api.equipos.getAllArmarios.useQuery();

  const armarios = useMemo(() => {
    if (!data) return [];

    return data
      .map((item) => {
        const { id, nombre, laboratorio } = item;
        return {
          id: id,
          label: `${nombre} (${laboratorio.nombre})`,
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  const currentTipo = useMemo(() => {
    if (!armarios) return null;

    return armarios.find((item) => String(item.id) === armario);
  }, [armarios, armario]);

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
              id="selectArmario"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando armarios" />
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
        items={armarios}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
            <span>No se encontró el armario</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por armario"
        clearable
        debounceTime={0}
        value={currentTipo}
        onChange={(value) => onArmarioChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};
