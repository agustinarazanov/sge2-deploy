"use client";

import { type z } from "zod";
import { useState } from "react";
import { type inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import { useBibliotecaPrestamosQueryParam } from "../../_hooks/use-biblioteca-prestamo-query-param";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type RouterOutputs } from "@/trpc/react";
import { cn } from "@/components/utils";

type BibliotecaPrestamoFilters = z.infer<typeof inputGetAllPrestamosLibros>;
type EstadoReservaType =
  RouterOutputs["reservas"]["reservaBiblioteca"]["getAll"]["reservas"][number]["reserva"]["estatus"];

type Props = {
  filters: BibliotecaPrestamoFilters;
};

export const BibliotecaPrestamoEstadoFilter = ({ filters }: Props) => {
  const { reservaEstatus, onReservaEstatusChange } = useBibliotecaPrestamosQueryParam(filters);

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
        Pendientes
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
        Ambos
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
