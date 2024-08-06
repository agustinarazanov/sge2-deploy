import { type z } from "zod";
import { AdminLaboratoriosNuevoLaboratorio } from "./nuevo-laboratorio-button";
import { SubLinks } from "./action-buttons-links";
import { AdminLaboratoriosFilterText } from "../filtros/admin-laboratorios-filter-text";
import { type inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";

type AdminLaboratoriosFilters = z.infer<typeof inputGetLaboratorios>;

type ActionButtonsProps = {
  filters: AdminLaboratoriosFilters;
};

export const AdminActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5">
      <div className="relative flex w-full flex-row justify-end space-x-2 sm:basis-1/2 md:w-auto md:basis-1/3">
        <AdminLaboratoriosNuevoLaboratorio />

        <SubLinks />
      </div>

      <div className="flex w-full flex-row space-x-3 md:basis-1/2">
        <div className="md:basis-1/2">
          <AdminLaboratoriosFilterText filters={filters} />
        </div>
      </div>
    </div>
  );
};
