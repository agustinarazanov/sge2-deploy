import { type z } from "zod";
import { AdminUsuariosFilterText } from "../filtros/admin-roles-filter-text";
import { AdminUsuariosFilterRol } from "../filtros/admin-roles-filter-permiso";
import { type inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";
import { SubLinks } from "@/app/admin/roles/_components/action-button/action-buttons-links";

type AdminUsuariosRolesFilters = z.infer<typeof inputGetUsuarios>;

type ActionButtonsProps = {
  filters: AdminUsuariosRolesFilters;
};

export const AdminUsuariosActionButtons = ({ filters }: ActionButtonsProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse  md:space-x-1.5">
      <div className="relative flex w-full flex-row justify-end space-x-2 sm:basis-1/2 md:w-auto md:basis-1/3">
        <SubLinks />
      </div>

      <div className="flex w-full flex-row space-x-3 md:basis-1/2">
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
