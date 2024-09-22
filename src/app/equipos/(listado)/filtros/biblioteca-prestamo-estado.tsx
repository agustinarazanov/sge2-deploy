"use client";

import { type z } from "zod";
import { useState } from "react";
import { useEquiposPrestamosQueryParam } from "../../_hooks/use-equipos-prestamo-query-param";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type RouterOutputs } from "@/trpc/react";
import { cn } from "@/components/utils";
import { type inputGetAllPrestamosEquipos } from "@/shared/filters/reservas-equipos-filter.schema";

type EquiposPrestamoFilters = z.infer<typeof inputGetAllPrestamosEquipos>;
type EstadoReservaType = RouterOutputs["reservas"]["reservaEquipo"]["getAll"]["reservas"][number]["reserva"]["estatus"];

type Props = {
  filters: EquiposPrestamoFilters;
};

export const EquiposPrestamoEstadoFilter = ({ filters }: Props) => {
  const { reservaEstatus, onReservaEstatusChange } = useEquiposPrestamosQueryParam(filters);

  const [currentEstatus, setCurrentEstatus] = useState<EstadoReservaType | "">(reservaEstatus);

  const handleTextChange = (nuevoEstatus: EstadoReservaType | "") => {
    onReservaEstatusChange(nuevoEstatus);
    setCurrentEstatus(nuevoEstatus);
  };

  return (
    <ToggleGroup type="single" className="flex flex-row">
      <ToggleGroupItem
        value={"PENDIENTE" as EstadoReservaType}
        aria-label="Cambiar a pendientes"
        className={cn("basis-1/3 hover:bg-primary", { "bg-primary": currentEstatus === "PENDIENTE" })}
        onClick={() => handleTextChange("PENDIENTE")}
      >
        Activos
      </ToggleGroupItem>
      <ToggleGroupItem
        value={"FINALIZADA" as EstadoReservaType}
        aria-label="Cambiar a finalizadas"
        className={cn("basis-1/3 hover:bg-primary", { "bg-primary": currentEstatus === "FINALIZADA" })}
        onClick={() => handleTextChange("FINALIZADA")}
      >
        Finalizados
      </ToggleGroupItem>
      <ToggleGroupItem
        value={"" as EstadoReservaType}
        aria-label="Cambiar a ambos"
        className={cn("basis-1/3 hover:bg-primary", { "bg-primary": currentEstatus === "" })}
        onClick={() => handleTextChange("")}
      >
        Todos
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
