"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { type z } from "zod";
import { useEquiposQueryParam } from "../../_hooks/use-equipos-query-param";
import { type inputGetEquipos } from "@/shared/filters/equipos-filter.schema";

type EquiposFilters = z.infer<typeof inputGetEquipos>;

type Props = {
  filters: EquiposFilters;
};

export const EquiposFilterArmario = ({ filters }: Props) => {
  const { armario, onArmarioChange } = useEquiposQueryParam(filters);

  const { data: armarios, isLoading, isError } = api.materia.getAll.useQuery();

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
      <Select onValueChange={(value) => onArmarioChange(value)} value={armario}>
        <div className="flex flex-row items-center space-x-2">
          <SelectGroup className="w-full">
            <SelectLabel className="sr-only">Selecciona un armario</SelectLabel>
            <SelectTrigger
              id="selectArmario"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Selecciona un armario" />
            </SelectTrigger>
            <SelectContent>
              {(armarios ?? []).map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.nombre} ({option.codigo})
                </SelectItem>
              ))}
            </SelectContent>
          </SelectGroup>
        </div>
      </Select>
    </div>
  );
};
