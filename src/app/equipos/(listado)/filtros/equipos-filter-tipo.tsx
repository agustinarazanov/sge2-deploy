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
import { EquipoTipoSelector } from "@/app/laboratorios/mis_cursos/_components/filtros/equipo-tipo-selector";

type EquiposFilters = z.infer<typeof inputGetEquipos>;

type Props = {
  filters: EquiposFilters;
};

export const EquiposFilterTipo = ({ filters }: Props) => {
  const { tipo, onTipoChange } = useEquiposQueryParam(filters);

  const { data: tipos, isLoading, isError } = api.materia.getAll.useQuery();

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
              <SelectValue placeholder="Error cargando tipos" />
            </SelectTrigger>
          </div>
        </Select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <EquipoTipoSelector onEquipoTipoChange={onTipoChange} />
    </div>
  );

  // return (
  //   <div className="w-full">
  //     <Select onValueChange={(value) => onTipoChange(value)} value={tipo}>
  //       <div className="flex flex-row items-center space-x-2">
  //         <SelectGroup className="w-full">
  //           <SelectLabel className="sr-only">Selecciona un tipo</SelectLabel>
  //           <SelectTrigger
  //             id="selectTipo"
  //             className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
  //           >
  //             <SelectValue placeholder="Selecciona un tipo" />
  //           </SelectTrigger>
  //           <SelectContent>
  //             {(tipos ?? []).map((option) => (
  //               <SelectItem key={option.id} value={String(option.id)}>
  //                 {option.nombre} ({option.codigo})
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </SelectGroup>
  //       </div>
  //     </Select>
  //   </div>
  // );
};
