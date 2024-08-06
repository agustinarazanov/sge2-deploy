import { api } from "@/trpc/server";
import { type z } from "zod";
import { type inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { RolesTable } from "./roles-table";

type RolesFilters = z.infer<typeof inputGetRoles>;

type LaboratoriosTableContainerProps = {
  filters: RolesFilters;
};

// TODO @Alex: Va a ser mejor convertir todos estos componentes de tablas en `use client` porque asi TRPC podrá invalidar los hooks y hacer queries desde los modals
export default async function RolesTableContainer({ filters }: LaboratoriosTableContainerProps) {
  const roles = await api.admin.roles.getAllRoles(filters);

  return <RolesTable data={roles} filters={filters} />;
}
