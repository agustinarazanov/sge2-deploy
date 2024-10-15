import {
  inputEliminarMateria,
  inputEditarMateria,
  inputAgregarMateria,
  inputGetMateria,
} from "../../../../shared/filters/materia-filter.schema";

import {
  getAllMaterias,
  eliminarMateria,
  editarMateria,
  agregarMateria,
  getMateriaById,
} from "../../repositories/materia/materia.repository";

import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { Prisma } from "@prisma/client";

export const getAllMateriasProcedure = protectedProcedure.query(async ({ ctx }) => {
  return await getAllMaterias(ctx);
});

export const getMateriaByIdProcedure = protectedProcedure.input(inputGetMateria).query(async ({ ctx, input }) => {
  validarInput(inputGetMateria, input);

  const materia = await getMateriaById(ctx, input);

  return materia;
});

export const eliminarMateriaProcedure = protectedProcedure
  .input(inputEliminarMateria)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEliminarMateria, input);

    const materia = await eliminarMateria(ctx, input);

    return materia;
  });

export const editarMateriaProcedure = protectedProcedure.input(inputEditarMateria).mutation(async ({ ctx, input }) => {
  validarInput(inputEditarMateria, input);

  const userId = ctx.session.user.id;

  try {
    const materia = await editarMateria(ctx, input, userId);

    return materia;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(error);
        throw new Error("Ocurrió un error al editar la materia");
      }
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Error editando materia");
  }
});

export const nuevaMateriaProcedure = protectedProcedure.input(inputAgregarMateria).mutation(async ({ ctx, input }) => {
  validarInput(inputAgregarMateria, input);

  const userId = ctx.session.user.id;

  try {
    const materia = await agregarMateria(ctx, input, userId);

    return materia;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(error);
        throw new Error("Ocurrió un error al agregar la materia");
      }
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Error agregando materia");
  }
});
