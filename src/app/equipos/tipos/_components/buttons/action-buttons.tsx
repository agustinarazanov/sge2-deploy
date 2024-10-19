import { type z } from "zod";
import { TiposFilterText } from "../filtros/tipos-filter-text";
import { type inputGetTipos } from "@/shared/filters/equipos-tipos-filter.schema";

type EquiposTiposFilters = z.infer<typeof inputGetTipos>;

type ActionButtonsProps = {
  filters: EquiposTiposFilters;
};

export const EquiposTiposActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 md:flex-row md:space-x-1.5 lg:space-y-0">
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <TiposFilterText filters={filters} />
        </div>
      </div>
    </div>
  );
};
