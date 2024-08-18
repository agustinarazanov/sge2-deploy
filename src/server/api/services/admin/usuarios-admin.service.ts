import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import {
  inputEditarUsuario,
  inputEliminarUsuario,
  inputGetUsuario,
  inputGetUsuarios,
} from "@/shared/filters/admin-usuarios-filter.schema";
import {
  editarUsuario,
  eliminarUsuario,
  getAllTutores,
  getAllUsuarios,
  getUsuarioPorId,
} from "../../repositories/admin/usuarios-admin.repository";

export const getTodosLosUsuariosProcedure = protectedProcedure.input(inputGetUsuarios).query(async ({ ctx, input }) => {
  validarInput(inputGetUsuarios, input);

  const usuarios = await getAllUsuarios(ctx, input);

  return usuarios;
});

export const getUsuarioPorIdProcedure = protectedProcedure.input(inputGetUsuario).query(async ({ ctx, input }) => {
  validarInput(inputGetUsuario, input);

  const usuario = await getUsuarioPorId(ctx, input);

  return usuario;
});

export const eliminarUsuarioProcedure = protectedProcedure
  .input(inputEliminarUsuario)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEliminarUsuario, input);

    const usuario = await eliminarUsuario(ctx, input);

    return usuario;
  });

export const editarUsuarioProcedure = protectedProcedure.input(inputEditarUsuario).mutation(async ({ ctx, input }) => {
  validarInput(inputEditarUsuario, input);

  const userId = ctx.session.user.id;

  const usuario = await editarUsuario(ctx, input, userId);

  return usuario;
});

export const getAllTutoresProcedure = protectedProcedure.query(async ({ ctx }) => {
  const tutores = await getAllTutores(ctx);

  return tutores;
});
