import { type z } from "zod";
import { AdminRolesNuevoRol } from "./nuevo-rol-button";
import { SubLinks } from "./action-buttons-links";
import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { AdminRolesFilterText } from "../filtros/admin-roles-filter-text";
import { AdminRolesFilterPermiso } from "../filtros/admin-roles-filter-permiso";

type AdminRolesFilters = z.infer<typeof inputGetRoles>;

type ActionButtonsProps = {
  filters: AdminRolesFilters;
};

export const AdminActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-3 sm:space-y-0 md:flex-row-reverse md:space-x-2">
      <div className="relative flex w-full flex-col justify-end space-y-3 sm:basis-1/2 sm:flex-row sm:space-x-2 sm:space-y-0 md:w-auto md:basis-1/3">
        <AdminRolesNuevoRol />
        <div className="flex flex-row justify-center gap-x-2">
          <SubLinks />
        </div>
      </div>
      <div className="w-full space-y-3 sm:flex sm:flex-row sm:space-x-3 sm:space-y-0 md:basis-1/2">
        <div className="md:basis-1/2">
          <AdminRolesFilterText filters={filters} />
        </div>
        <div className="md:basis-1/2">
          <AdminRolesFilterPermiso filters={filters} />
        </div>
      </div>
    </div>
  );
};
