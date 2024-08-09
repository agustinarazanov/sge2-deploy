"use client";

import React from "react";
import { type z } from "zod";
import { useEquiposQueryParam } from "../../_hooks/use-equipos-query-param";
import { type inputGetEquipos } from "@/shared/filters/equipos-filter.schema";
import { EquipoTipoSelector } from "@/app/laboratorios/mis_cursos/_components/filtros/equipo-tipo-selector";

type EquiposFilters = z.infer<typeof inputGetEquipos>;

type Props = {
  filters: EquiposFilters;
};

export const EquiposFilterTipo = ({ filters }: Props) => {
  const { onTipoChange } = useEquiposQueryParam(filters);

  return (
    <div className="w-full">
      <EquipoTipoSelector onEquipoTipoChange={onTipoChange} />
    </div>
  );
};
