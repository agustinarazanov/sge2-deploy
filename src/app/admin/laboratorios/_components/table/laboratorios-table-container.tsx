import { api } from "@/trpc/server";
import { type z } from "zod";
import { AdminLaboratoriosTable } from "./admin-laboratorios-table";
import { type inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";

type LaboratoriosFilters = z.infer<typeof inputGetLaboratorios>;

type LaboratoriosTableContainerProps = {
  filters: LaboratoriosFilters;
};

// TODO @Alex: Va a ser mejor convertir todos estos componentes de tablas en `use client` porque asi TRPC podrá invalidar los hooks y hacer queries desde los modals
export default async function AdminLaboratoriosTableContainer({ filters }: LaboratoriosTableContainerProps) {
  const roles = await api.admin.laboratorios.getAll(filters);

  return <AdminLaboratoriosTable data={roles} filters={filters} />;
}
