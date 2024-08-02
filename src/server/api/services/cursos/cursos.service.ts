import {
  agregarCurso,
  editarCurso,
  eliminarCurso,
  getAllCursos,
  getCursoPorId,
} from "../../repositories/cursos/cursos.repository";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import {
  inputAgregarCurso,
  inputEditarCurso,
  inputEliminarCurso,
  inputGetCurso,
  inputGetCursos,
} from "@/shared/cursos-filter.schema";

export const getTodosLosCursosProcedure = protectedProcedure.input(inputGetCursos).query(async ({ ctx, input }) => {
  validarInput(inputGetCursos, input);

  const cursos = await getAllCursos(ctx, input);

  return cursos;
});

export const cursoPorIdProcedure = protectedProcedure.input(inputGetCurso).query(async ({ ctx, input }) => {
  validarInput(inputGetCurso, input);

  const curso = await getCursoPorId(ctx, input);

  return curso;
});

export const nuevoCursoProcedure = protectedProcedure.input(inputAgregarCurso).mutation(async ({ ctx, input }) => {
  validarInput(inputAgregarCurso, input);

  const userId = ctx.session.user.id;

  const curso = await agregarCurso(ctx, input, userId);

  return curso;
});

export const editarCursoProcedure = protectedProcedure.input(inputEditarCurso).mutation(async ({ ctx, input }) => {
  validarInput(inputEditarCurso, input);

  const userId = ctx.session.user.id;

  const curso = await editarCurso(ctx, input, userId);

  return curso;
});

export const eliminarCursoProcedure = protectedProcedure.input(inputEliminarCurso).mutation(async ({ ctx, input }) => {
  validarInput(inputEliminarCurso, input);

  const curso = await eliminarCurso(ctx, input);

  return curso;
});
