import { type z } from "zod";
import { EquiposFilterLaboratorio } from "./filtros/equipos-filter-laboratorio";
import { EquiposFilterText } from "./filtros/equipos-filter-text";
import { EquiposNuevoEquipoModal } from "./equipos-nuevo-equipo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EquiposFilterArmario } from "./filtros/equipos-filter-armario";
import { EquiposFilterTipo } from "./filtros/equipos-filter-tipo";
import { type inputGetEquipos } from "@/shared/filters/equipos-filter.schema";

type EquiposFilters = z.infer<typeof inputGetEquipos>;

type ActionButtonsProps = {
  filters: EquiposFilters;
};

export const ActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5">
      <div className="relative flex w-full flex-row justify-end space-x-2 sm:basis-1/2 md:w-auto md:basis-1/3">
        <EquiposNuevoEquipoModal />
        <Link href="/equipos/prestamos" passHref>
          <Button color={"ghost"}>Ir a préstamos</Button>
        </Link>
      </div>

      <div className="flex w-full flex-row space-x-3 md:basis-1/2">
        <div className="md:basis-1/4">
          <EquiposFilterText filters={filters} />
        </div>
        <div className="md:basis-1/4">
          <EquiposFilterLaboratorio filters={filters} />
        </div>
        <div className="md:basis-1/4">
          <EquiposFilterArmario filters={filters} />
        </div>
        <div className="md:basis-1/4">
          <EquiposFilterTipo filters={filters} />
        </div>
      </div>
    </div>
  );
};
