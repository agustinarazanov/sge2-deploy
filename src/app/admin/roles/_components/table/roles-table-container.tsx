import { api } from "@/trpc/server";
import { type z } from "zod";
import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { RolesTable } from "./roles-table";

type RolesFilters = z.infer<typeof inputGetRoles>;

type LaboratoriosTableContainerProps = {
  filters: RolesFilters;
};

export default async function RolesTableContainer({ filters }: LaboratoriosTableContainerProps) {
  const roles = await api.admin.roles.getAll(filters);

  return <RolesTable data={roles} filters={filters} />;
}
