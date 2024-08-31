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

export const EquiposFilterLaboratorio = ({ filters }: Props) => {
  const { laboratorio, onLaboratorioChange } = useEquiposQueryParam(filters);

  const { data, isLoading, isError } = api.admin.laboratorios.getAll.useQuery({ sedeId: "4" });

  const laboratorios = data?.laboratorios;

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
      <Select onValueChange={(value) => onLaboratorioChange(value)} value={laboratorio}>
        <div className="flex flex-row items-center space-x-2">
          <SelectGroup className="w-full">
            <SelectLabel className="sr-only">Selecciona un laboratorio</SelectLabel>
            <SelectTrigger
              id="selectLaboratorio"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Selecciona un laboratorio" />
            </SelectTrigger>
            <SelectContent>
              {(laboratorios ?? []).map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.nombre} ({option.esAbierto ? "Abierto" : "Cerrado"})
                </SelectItem>
              ))}
            </SelectContent>
          </SelectGroup>
        </div>
      </Select>
    </div>
  );
};
