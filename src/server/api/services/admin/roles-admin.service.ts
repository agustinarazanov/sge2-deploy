import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";
import { getAllRoles } from "../../repositories/admin/roles-admin.repository";

export const getTodosLosRolesProcedure = protectedProcedure.input(inputGetRoles).query(async ({ ctx, input }) => {
  validarInput(inputGetRoles, input);

  const roles = await getAllRoles(ctx, input);

  return roles;
});
