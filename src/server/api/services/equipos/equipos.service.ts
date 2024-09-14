import {
  inputAgregarTipo,
  inputEditarTipo,
  inputEliminarTipo,
  inputGetTipo,
  inputGetTipos,
} from "@/shared/filters/equipos-tipos-filter.schema";
import {
  agregarEquipo,
  editarEquipo,
  eliminarEquipo,
  getAllEquipos,
  getAllEstados,
  getAllMarcas,
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
} from "@/shared/filters/equipos-filter.schema";
import {
  agregarTipo,
  editarTipo,
  eliminarTipo,
  getAllTipos,
  getTipoPorId,
} from "../../repositories/equipos/equipos-tipos.repository";

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

export const eliminarTipoProcedure = protectedProcedure.input(inputEliminarTipo).mutation(async ({ ctx, input }) => {
  validarInput(inputEliminarEquipo, input);

  const tipo = await eliminarTipo(ctx, input);

  return tipo;
});

export const getTodosLosTiposProcedure = protectedProcedure.input(inputGetTipos).query(async ({ ctx, input }) => {
  validarInput(inputGetTipos, input);

  const tipos = await getAllTipos(ctx, input);

  return tipos;
});

export const tipoPorIdProcedure = protectedProcedure.input(inputGetTipo).query(async ({ ctx, input }) => {
  validarInput(inputGetTipo, input);

  const tipo = await getTipoPorId(ctx, input);

  return tipo;
});

export const editarTipoProcedure = protectedProcedure.input(inputEditarTipo).mutation(async ({ ctx, input }) => {
  validarInput(inputEditarTipo, input);

  const userId = ctx.session.user.id;

  const tipo = await editarTipo(ctx, input, userId);

  return tipo;
});

export const nuevoTipoProcedure = protectedProcedure.input(inputAgregarTipo).mutation(async ({ ctx, input }) => {
  validarInput(inputAgregarTipo, input);

  const userId = ctx.session.user.id;

  const libro = await agregarTipo(ctx, input, userId);

  return libro;
});

export const getTodasLasMarcasProcedure = protectedProcedure.query(async ({ ctx }) => {
  const marcas = await getAllMarcas(ctx);

  return marcas;
});

export const getTodosLosEstadosProcedure = protectedProcedure.query(async ({ ctx }) => {
  const marcas = await getAllEstados(ctx);

  return marcas;
});
