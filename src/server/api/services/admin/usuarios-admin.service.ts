import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import {
  inputEditarUsuario,
  inputEliminarUsuario,
  inputGetUsuario,
  inputGetUsuarios,
  inputGetTutor,
  inputEditarTutor,
} from "@/shared/filters/admin-usuarios-filter.schema";
import {
  editarUsuario,
  eliminarTutor,
  editarTutor,
  eliminarUsuario,
  getAllProfesores,
  getAllTutores,
  getAllUsuarios,
  getUsuarioPorId,
  getAllTutoresEspecialidades,
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

export const getTutorPorIdProcedure = protectedProcedure.input(inputGetTutor).query(async ({ ctx, input }) => {
  console.log(ctx, input);
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

export const editarTutorProcedure = protectedProcedure.input(inputEditarTutor).mutation(async ({ ctx, input }) => {
  validarInput(inputEditarTutor, input);

  const tutor = await editarTutor(ctx, input);

  return tutor;
});

export const getAllTutoresProcedure = protectedProcedure.query(async ({ ctx }) => {
  const tutores = await getAllTutores(ctx);

  return tutores;
});

export const getAllTutoresEspecialidadesProcedure = protectedProcedure.query(async ({ ctx }) => {
  const especialidades = await getAllTutoresEspecialidades(ctx);

  return especialidades;
});

export const eliminarTutorProcedure = protectedProcedure
  .input(inputEliminarUsuario)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEliminarUsuario, input);

    const usuario = await eliminarTutor(ctx, input);

    return usuario;
  });

export const getAllProfesoresProcedure = protectedProcedure.query(async ({ ctx }) => {
  return await getAllProfesores(ctx);
});
