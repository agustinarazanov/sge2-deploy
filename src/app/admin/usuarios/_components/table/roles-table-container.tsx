import { api } from "@/trpc/server";
import { type z } from "zod";
import { AdminUsuariosTable } from "./roles-table";
import { type inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";

type UsuariosFilters = z.infer<typeof inputGetUsuarios>;

type Props = {
  filters: UsuariosFilters;
};

// TODO @Alex: Va a ser mejor convertir todos estos componentes de tablas en `use client` porque asi TRPC podrá invalidar los hooks y hacer queries desde los modals
export default async function AdminUsuariosTableContainer({ filters }: Props) {
  const usuarios = await api.admin.usuarios.getAll(filters);

  return <AdminUsuariosTable data={usuarios} filters={filters} />;
}
