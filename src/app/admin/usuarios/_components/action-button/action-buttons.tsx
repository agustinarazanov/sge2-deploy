import { type z } from "zod";
import { AdminUsuariosFilterText } from "../filtros/admin-roles-filter-text";
import { AdminUsuariosFilterRol } from "../filtros/admin-roles-filter-permiso";
import { type inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";

type AdminUsuariosRolesFilters = z.infer<typeof inputGetUsuarios>;

type ActionButtonsProps = {
  filters: AdminUsuariosRolesFilters;
};

export const AdminUsuariosActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 sm:space-y-0 md:flex-row md:space-x-1.5">
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <AdminUsuariosFilterText filters={filters} />
        </div>
        <div className="md:basis-1/2">
          <AdminUsuariosFilterRol filters={filters} />
        </div>
      </div>
    </div>
  );
};
