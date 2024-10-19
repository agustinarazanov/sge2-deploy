import { type z } from "zod";

import { type inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import { BibliotecaPrestamoFilterText } from "./filtros/biblioteca-prestamo-filter-text";
import { BibliotecaPrestamoEstadoFilter } from "./filtros/biblioteca-prestamo-estado";

type BibliotecaFilters = z.infer<typeof inputGetAllPrestamosLibros>;

type ActionButtonsProps = {
  filters: BibliotecaFilters;
};

export const ActionButtonsPrestamos = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row md:space-x-1.5 md:space-y-0">
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:justify-between sm:space-x-3 sm:space-y-0">
        <div className="md:basis-1/3">
          <BibliotecaPrestamoFilterText filters={filters} />
        </div>
        <div className="md:basis-1/3">
          <BibliotecaPrestamoEstadoFilter filters={filters} />
        </div>
      </div>
    </div>
  );
};
