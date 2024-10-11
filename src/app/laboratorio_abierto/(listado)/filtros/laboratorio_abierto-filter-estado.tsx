"use client";

import { type z } from "zod";
import { useState } from "react";
import { useReservasLaboratorioAbiertoQueryParam } from "../../_hooks/use-reserva-laboratorio-abierto-query-param";
import { type RouterOutputs } from "@/trpc/react";
import { type inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { EstadoReservaToString } from "@/app/_components/estados-reservas";

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

  return <EstadoReservaToString handleEstadoChange={handleTextChange} currentEstado={currentEstatus} />;
};
