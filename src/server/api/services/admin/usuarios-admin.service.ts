import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";
import { getAllUsuarios } from "../../repositories/admin/usuarios-admin.repository";

export const getTodosLosUsuariosProcedure = protectedProcedure.input(inputGetUsuarios).query(async ({ ctx, input }) => {
  validarInput(inputGetUsuarios, input);

  const usuarios = await getAllUsuarios(ctx, input);

  return usuarios;
});
