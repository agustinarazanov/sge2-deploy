"use client";

import { type z } from "zod";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type RouterOutputs } from "@/trpc/react";
import { cn } from "@/components/utils";
import { type inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { useReservasLaboratorioCerradoQueryParam } from "../../_hooks/use-reserva-laboratorio-cerrado-query-param";

type LaboratorioCerradoReservaFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;
type EstadoReservaType =
  RouterOutputs["reservas"]["reservarLaboratorioCerrado"]["getAll"]["reservas"][number]["reserva"]["estatus"];

type Props = {
  filters: LaboratorioCerradoReservaFilters;
};

export const ReservaLaboratorioCerradoEstadoFilter = ({ filters }: Props) => {
  const { reservaEstatus, onReservaEstatusChange } = useReservasLaboratorioCerradoQueryParam(filters);

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
        className={cn("basis-1/3 hover:bg-gray-500", { "bg-gray-500": currentEstatus === "PENDIENTE" })}
        onClick={() => handleTextChange("PENDIENTE")}
      >
        Pendientes
      </ToggleGroupItem>
      <ToggleGroupItem
        value={"FINALIZADA" as EstadoReservaType}
        aria-label="Cambiar a finalizadas"
        className={cn("basis-1/3 hover:bg-gray-500", { "bg-gray-500": currentEstatus === "FINALIZADA" })}
        onClick={() => handleTextChange("FINALIZADA")}
      >
        Finalizados
      </ToggleGroupItem>
      <ToggleGroupItem
        value={"" as EstadoReservaType}
        aria-label="Cambiar a ambos"
        className={cn("basis-1/3 hover:bg-gray-500", { "bg-gray-500": currentEstatus === "" })}
        onClick={() => handleTextChange("")}
      >
        Ambos
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
