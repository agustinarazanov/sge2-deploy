import { type z } from "zod";
import type { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { ReservaLaboratorioCerradoEstadoFilter } from "./filtros/laboratorio_cerrado-filter-estado";
import { LaboratorioCerradoReservasFilterText } from "./filtros/laboratorio_cerrado-reserva-filter-text";

type reservasLaboratorioCerradoFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type ActionButtonsProps = {
  filters: reservasLaboratorioCerradoFilters;
};

export const ActionButtonsPrestamos = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row md:space-x-1.5 md:space-y-0">
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <LaboratorioCerradoReservasFilterText filters={filters} />
        </div>
        <div className="md:basis-1/2">
          <ReservaLaboratorioCerradoEstadoFilter filters={filters} />
        </div>
      </div>
    </div>
  );
};
