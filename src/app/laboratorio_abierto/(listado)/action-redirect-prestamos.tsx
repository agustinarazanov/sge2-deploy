import { type z } from "zod";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LABORATORIO_ABIERTO_ROUTE } from "@/shared/server-routes";
import { LaboratorioAbiertoReservasFilterText } from "./filtros/laboratorio_abierto-reserva-filter-text";
import { ReservaLaboratorioAbiertoEstadoFilter } from "./filtros/laboratorio_abierto-filter-estado";
import { type inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";

type reservasLaboratorioAbiertoFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioAbierto>;

type ActionButtonsProps = {
  filters: reservasLaboratorioAbiertoFilters;
};

const laboratorioAbierto = LABORATORIO_ABIERTO_ROUTE;

export const ActionButtonsPrestamos = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row-reverse md:space-x-1.5 md:space-y-0">
      <div className="relative flex w-full flex-col justify-end space-y-3 sm:basis-1/2 sm:flex-row sm:space-x-2 sm:space-y-0 md:w-auto md:space-y-0">
        <Button color={"ghost"}>
          <Link href={laboratorioAbierto.href} passHref>
            Laboratorio abierto
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioAbierto?.subRutas && laboratorioAbierto.subRutas[1] ? laboratorioAbierto.subRutas[1].href : ""
            }
            passHref
          >
            Reservas
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioAbierto?.subRutas && laboratorioAbierto.subRutas[2] ? laboratorioAbierto.subRutas[2].href : ""
            }
            passHref
          >
            Mis reservas
          </Link>
        </Button>
        <Button color={"ghost"}>
          <Link
            href={
              laboratorioAbierto?.subRutas && laboratorioAbierto.subRutas[3] ? laboratorioAbierto.subRutas[3].href : ""
            }
            passHref
          >
            Tutores
          </Link>
        </Button>
      </div>

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
