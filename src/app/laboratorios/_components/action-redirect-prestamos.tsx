import { type z } from "zod";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import type { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { ReservaLaboratorioCerradoEstadoFilter } from "./filtros/laboratorio_cerrado-filter-estado";
import { LaboratorioCerradoReservasFilterText } from "./filtros/laboratorio_cerrado-reserva-filter-text";

type reservasLaboratorioCerradoFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;

type ActionButtonsProps = {
  filters: reservasLaboratorioCerradoFilters;
};

const laboratorioCerrado = LABORATORIO_ROUTE;

export const ActionButtonsPrestamos = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row-reverse md:space-x-1.5 md:space-y-0">
      <div className="relative flex w-full flex-col justify-end space-y-3 sm:basis-1/2 sm:flex-row sm:space-x-2 sm:space-y-0 md:w-auto md:basis-1/3 md:space-y-0">
        <Button color={"ghost"}>
          <Link href={laboratorioCerrado.href} passHref>
            Ir a Laboratorio cerrado
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioCerrado?.subRutas && laboratorioCerrado.subRutas[0] ? laboratorioCerrado.subRutas[0].href : ""
            }
            passHref
          >
            Ir a mis cursos
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioCerrado?.subRutas && laboratorioCerrado.subRutas[1] ? laboratorioCerrado.subRutas[1].href : ""
            }
            passHref
          >
            Ir a mi catedra
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioCerrado?.subRutas && laboratorioCerrado.subRutas[2] ? laboratorioCerrado.subRutas[2].href : ""
            }
            passHref
          >
            Ir a software
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioCerrado?.subRutas && laboratorioCerrado.subRutas[3] ? laboratorioCerrado.subRutas[3].href : ""
            }
            passHref
          >
            Ir a reservas
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioCerrado?.subRutas && laboratorioCerrado.subRutas[4] ? laboratorioCerrado.subRutas[4].href : ""
            }
            passHref
          >
            Ir a mis reservas
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioCerrado?.subRutas && laboratorioCerrado.subRutas[5] ? laboratorioCerrado.subRutas[5].href : ""
            }
            passHref
          >
            Ir a solicitudes de reservas
          </Link>
        </Button>
      </div>
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
