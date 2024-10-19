import { type z } from "zod";
import { EquiposFilterLaboratorio } from "./filtros/equipos-filter-laboratorio";
import { EquiposFilterText } from "./filtros/equipos-filter-text";
import { EquiposFilterArmario } from "./filtros/equipos-filter-armario";
import { EquiposFilterTipo } from "./filtros/equipos-filter-tipo";
import { type inputGetEquipos } from "@/shared/filters/equipos-filter.schema";

type EquiposFilters = z.infer<typeof inputGetEquipos>;

type ActionButtonsProps = {
  filters: EquiposFilters;
};

export const ActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:space-x-1.5 lg:flex-row lg:space-y-0">
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
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
