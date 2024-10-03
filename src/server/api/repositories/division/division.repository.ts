import {
  type inputEliminarDivision,
  type inputAgregarDivision,
  type inputEditarDivision,
  type inputGetDivision,
} from "@/shared/filters/divisiones-filter.schema";
import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";

export const getAllDivisiones = async (ctx: { db: PrismaClient }) => {
  return await ctx.db.division.findMany({
    select: {
      id: true,
      nombre: true,
      anio: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });
};

type InputGetById = z.infer<typeof inputGetDivision>;
export const getDivisionById = async (ctx: { db: PrismaClient }, input: InputGetById) => {
  const { id } = input;

  const division = await ctx.db.division.findUnique({
    select: {
      id: true,
      nombre: true,
      anio: true,
    },
    where: {
      id,
    },
  });

  if (!division) {
    throw new Error(`No se encontró una división con el ID ${id}`);
  }

  return division;
};

type InputEliminarDivision = z.infer<typeof inputEliminarDivision>;
export const eliminarDivision = async (ctx: { db: PrismaClient }, input: InputEliminarDivision) => {
  try {
    const division = await ctx.db.division.delete({
      where: {
        id: input.id,
      },
    });

    return division;
  } catch (error) {
    throw new Error(`Error eliminando division ${input.id}`);
  }
};

type InputAgregarDivision = z.infer<typeof inputAgregarDivision>;
export const agregarDivision = async (ctx: { db: PrismaClient }, input: InputAgregarDivision, userId: string) => {
  if (input.anio === undefined) {
    throw new Error("El campo 'anio' es requerido.");
  }
  const existeDivision = await ctx.db.division.findFirst({
    where: {
      nombre: input.nombre,
    },
  });

  if (existeDivision) {
    throw new Error("El nombre de la división ya existe");
  }

  const division = await ctx.db.division.create({
    data: {
      nombre: input.nombre,
      anio: input.anio,
      usuarioCreadorId: userId,
    },
  });

  return division;
};

type InputEditarDivision = z.infer<typeof inputEditarDivision>;
export const editarDivision = async (ctx: { db: PrismaClient }, input: InputEditarDivision, userId: string) => {
  const existeDivision = await ctx.db.division.findFirst({
    where: {
      nombre: input.nombre,
      NOT: {
        id: input.id,
      },
    },
  });

  if (existeDivision) {
    throw new Error("El nombre de la división ya existe");
  }

  const division = await ctx.db.division.update({
    data: {
      nombre: input.nombre,
      anio: input.anio,
    },
    where: {
      id: input.id,
    },
  });

  return division;
};
