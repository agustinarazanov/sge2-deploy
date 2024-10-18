"use client";

import React, { useMemo, useState } from "react";
import { Autocomplete, Select, SelectTrigger, SelectValue } from "@/components/ui";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { type z } from "zod";
import { useCursosQueryParam } from "../../_hooks/use-cursos-query-param";
import { estaDentroDe } from "@/shared/string-compare";
import { type inputGetCursos } from "@/shared/filters/cursos-filter.schema";

type CursosFilters = z.infer<typeof inputGetCursos>;

type Props = {
  filters: CursosFilters;
};

export const CursosFilterMateria = ({ filters }: Props) => {
  const { materia, onMateriaChange } = useCursosQueryParam(filters);
  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = api.materia.getAll.useQuery();

  const materias = useMemo(() => {
    if (!data) return [];

    return data
      .map((item) => {
        const { id, nombre, codigo } = item;
        return {
          id: id,
          label: `${nombre} (${codigo})`,
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  const currentMateria = useMemo(() => {
    if (!materias) return null;

    return materias.find((item) => String(item.id) === materia);
  }, [materias, materia]);

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
              id="selectMateria"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando materias" />
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
        items={materias}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm">
            <span>No se encontró la materia</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Materia"
        clearable
        debounceTime={0}
        value={currentMateria}
        onChange={(value) => onMateriaChange(value?.id ? String(value.id) : "")}
      />
    </div>
  );
};
