import { type z } from "zod";
import { AdminLaboratoriosFilterText } from "../filtros/admin-laboratorios-filter-text";
import { type inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";

type AdminLaboratoriosFilters = z.infer<typeof inputGetLaboratorios>;

type ActionButtonsProps = {
  filters: AdminLaboratoriosFilters;
};

export const AdminActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 sm:space-y-0 md:flex-row  md:space-x-1.5">
      <div className="w-full sm:flex sm:flex-row sm:space-x-3">
        <div className="md:basis-1/3">
          <AdminLaboratoriosFilterText filters={filters} />
        </div>
      </div>
    </div>
  );
};
