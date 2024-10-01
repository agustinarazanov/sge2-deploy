import { type z } from "zod";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";
import { type inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import { BibliotecaPrestamoFilterText } from "./filtros/biblioteca-prestamo-filter-text";
import { BibliotecaPrestamoEstadoFilter } from "./filtros/biblioteca-prestamo-estado";

type BibliotecaFilters = z.infer<typeof inputGetAllPrestamosLibros>;

type ActionButtonsProps = {
  filters: BibliotecaFilters;
};

const rutaBiblioteca = BIBLIOTECA_ROUTE;

export const ActionButtonsPrestamos = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row-reverse md:space-x-1.5 md:space-y-0">
      <div className="relative flex w-full flex-col justify-end space-y-3 sm:basis-1/2 sm:flex-row sm:space-x-2 sm:space-y-0 md:w-auto md:basis-1/3 md:space-y-0">
        <Button color={"ghost"}>
          <Link href={rutaBiblioteca.href} passHref>
            Ir a biblioteca
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={rutaBiblioteca?.subRutas && rutaBiblioteca.subRutas[1] ? rutaBiblioteca.subRutas[1].href : ""}
            passHref
          >
            Ir a préstamos
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={rutaBiblioteca?.subRutas && rutaBiblioteca.subRutas[2] ? rutaBiblioteca.subRutas[2].href : ""}
            passHref
          >
            Ir a mis préstamos
          </Link>
        </Button>
      </div>

      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <BibliotecaPrestamoFilterText filters={filters} />
        </div>
        <div className="md:basis-1/2">
          <BibliotecaPrestamoEstadoFilter filters={filters} />
        </div>
      </div>
    </div>
  );
};
