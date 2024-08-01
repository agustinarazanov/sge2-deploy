import {
  agregarEquipo,
  editarEquipo,
  eliminarEquipo,
  getAllEquipos,
  getEquipoPorId,
} from "../../repositories/equipos/equipos.repository";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import {
  inputAgregarEquipo,
  inputEditarEquipos,
  inputEliminarEquipo,
  inputGetEquipo,
  inputGetEquipos,
} from "@/shared/equipos-filter.schema";

export const getTodosLosEquiposProcedure = protectedProcedure.input(inputGetEquipos).query(async ({ ctx, input }) => {
  validarInput(inputGetEquipos, input);

  const libros = await getAllEquipos(ctx, input);

  return libros;
});

export const equipoPorIdProcedure = protectedProcedure.input(inputGetEquipo).query(async ({ ctx, input }) => {
  validarInput(inputGetEquipo, input);

  const libro = await getEquipoPorId(ctx, input);

  return libro;
});

export const nuevoEquipoProcedure = protectedProcedure.input(inputAgregarEquipo).mutation(async ({ ctx, input }) => {
  validarInput(inputAgregarEquipo, input);

  const userId = ctx.session.user.id;

  const libro = await agregarEquipo(ctx, input, userId);

  return libro;
});

export const editarEquipoProcedure = protectedProcedure.input(inputEditarEquipos).mutation(async ({ ctx, input }) => {
  validarInput(inputEditarEquipos, input);

  const userId = ctx.session.user.id;

  const libro = await editarEquipo(ctx, input, userId);

  return libro;
});

export const eliminarEquipoProcedure = protectedProcedure
  .input(inputEliminarEquipo)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEliminarEquipo, input);

    const libro = await eliminarEquipo(ctx, input);

    return libro;
  });
