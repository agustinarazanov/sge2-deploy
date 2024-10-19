import { type z } from "zod";
import { LaboratorioAbiertoReservasFilterText } from "./filtros/laboratorio_abierto-reserva-filter-text";
import { ReservaLaboratorioAbiertoEstadoFilter } from "./filtros/laboratorio_abierto-filter-estado";
import { type inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";

type reservasLaboratorioAbiertoFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioAbierto>;

type ActionButtonsProps = {
  filters: reservasLaboratorioAbiertoFilters;
};

export const ActionButtonsPrestamos = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row md:space-x-1.5 md:space-y-0">
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <LaboratorioAbiertoReservasFilterText filters={filters} />
        </div>
        <div className="md:basis-1/2">
          <ReservaLaboratorioAbiertoEstadoFilter filters={filters} />
        </div>
      </div>
    </div>
  );
};
