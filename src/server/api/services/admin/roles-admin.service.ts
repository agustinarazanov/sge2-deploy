import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { inputEliminarRol, inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { eliminarRol, getAllPermisos, getAllRoles } from "../../repositories/admin/roles-admin.repository";

export const getTodosLosRolesProcedure = protectedProcedure.input(inputGetRoles).query(async ({ ctx, input }) => {
  validarInput(inputGetRoles, input);

  const roles = await getAllRoles(ctx, input);

  return roles;
});

export const eliminarRolProcedure = protectedProcedure.input(inputEliminarRol).mutation(async ({ ctx, input }) => {
  validarInput(inputEliminarRol, input);

  const role = await eliminarRol(ctx, input);

  return role;
});

export const getTodosLosPermisosProcedure = protectedProcedure.query(async ({ ctx }) => {
  const permisos = await getAllPermisos(ctx);

  return permisos;
});
