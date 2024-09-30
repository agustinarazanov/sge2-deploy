"use client";

import { type z } from "zod";
import { useState } from "react";
import { useReservasLaboratorioAbiertoQueryParam } from "../../_hooks/use-reserva-laboratorio-abierto-query-param";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type RouterOutputs } from "@/trpc/react";
import { cn } from "@/components/utils";
import { type inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";

type LaboratorioAbiertoReservaFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioAbierto>;
type EstadoReservaType =
  RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getAll"]["reservas"][number]["reserva"]["estatus"];

type Props = {
  filters: LaboratorioAbiertoReservaFilters;
};

export const ReservaLaboratorioAbiertoEstadoFilter = ({ filters }: Props) => {
  const { reservaEstatus, onReservaEstatusChange } = useReservasLaboratorioAbiertoQueryParam(filters);

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
