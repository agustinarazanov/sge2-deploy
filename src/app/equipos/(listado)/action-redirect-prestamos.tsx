import { type z } from "zod";

import { EquiposPrestamoFilterText } from "./filtros/equipos-prestamo-filter-text";
import { EquiposPrestamoEstadoFilter } from "./filtros/equipos-prestamo-estado";
import { type inputGetAllPrestamosEquipos } from "@/shared/filters/reservas-equipos-filter.schema";

type EquiposFilters = z.infer<typeof inputGetAllPrestamosEquipos>;

type ActionButtonsProps = {
  filters: EquiposFilters;
};

export const ActionButtonsPrestamos = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row md:space-x-1.5 md:space-y-0">
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <EquiposPrestamoFilterText filters={filters} />
        </div>
        <div className="md:basis-1/2">
          <EquiposPrestamoEstadoFilter filters={filters} />
        </div>
      </div>
    </div>
  );
};
