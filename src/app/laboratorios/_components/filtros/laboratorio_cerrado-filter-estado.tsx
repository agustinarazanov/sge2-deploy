"use client";

import { type z } from "zod";
import { useState } from "react";
import { type RouterOutputs } from "@/trpc/react";
import { type inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { useReservasLaboratorioCerradoQueryParam } from "../../_hooks/use-reserva-laboratorio-cerrado-query-param";
import { EstadoReservaToString } from "@/app/_components/estados-reservas";

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

  return <EstadoReservaToString handleEstadoChange={handleTextChange} currentEstado={currentEstatus} />;
};
