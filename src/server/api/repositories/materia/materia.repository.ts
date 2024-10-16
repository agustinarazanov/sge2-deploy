import { EstatusCorrelativa, type Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import {
  type inputEliminarMateria,
  type inputAgregarMateria,
  type inputEditarMateria,
  type inputGetMateria,
} from "@/shared/filters/materia-filter.schema";
import { informacionUsuario } from "../usuario-helper";

export const getAllMaterias = async (ctx: { db: PrismaClient }) => {
  const materias = await ctx.db.materia.findMany({
    select: {
      id: true,
      nombre: true,
      codigo: true,
      anio: true,
      duracion: true,
      tipo: true,
    },
    orderBy: [
      {
        nombre: "asc",
      },
      {
        anio: "asc",
      },
    ],
  });

  return materias;
};

type InputGetMateria = z.infer<typeof inputGetMateria>;
export const getMateriaById = async (ctx: { db: PrismaClient }, input: InputGetMateria) => {
  const { id } = input;

  const materia = await ctx.db.materia.findUnique({
    select: {
      id: true,
      nombre: true,
      codigo: true,
      anio: true,
      duracion: true,
      tipo: true,
      directorUsuarioId: true,
      directorUsuario: {
        select: informacionUsuario,
      },
      jefeTrabajoPracticos: {
        select: {
          userId: true,
          usuario: {
            select: informacionUsuario,
          },
        },
      },
      correlativa: {
        select: {
          materiaPrerequisito: {
            select: {
              nombre: true,
            },
          },
          materiaPrerequisitoId: true,
          estatusCorrelativa: true,
        },
      },
    },
    where: {
      id,
    },
  });

  if (!materia) {
    throw new Error(`No se encontró una materia con el ID ${id}`);
  }

  return materia;
};

type InputEliminarMateria = z.infer<typeof inputEliminarMateria>;
export const eliminarMateria = async (ctx: { db: PrismaClient }, input: InputEliminarMateria) => {
  try {
    const materia = await ctx.db.materia.delete({
      where: {
        id: input.id,
      },
    });

    return materia;
  } catch (error) {
    throw new Error(`Error eliminando materia ${input.id}`);
  }
};

type InputAgregarMateria = z.infer<typeof inputAgregarMateria>;
export const agregarMateria = async (ctx: { db: PrismaClient }, input: InputAgregarMateria, userId: string) => {
  const existeMateria = await ctx.db.materia.findFirst({
    where: {
      codigo: input.codigo,
    },
  });

  if (existeMateria) {
    throw new Error("El código de la materia ya existe");
  }

  const materia = await ctx.db.$transaction(async (tx) => {
    const materia = await ctx.db.materia.create({
      data: {
        nombre: input.nombre,
        codigo: input.codigo,
        anio: Number(input.anio),
        duracion: input.duracion,
        tipo: input.tipo,
        jefeTrabajoPracticos: {
          createMany: {
            data:
              input.jefesTrabajoPracticoUserId?.map((userId) => ({
                userId: userId,
              })) ?? [],
          },
        },

        usuarioCreadorId: userId,
        usuarioModificadorId: userId,
      },
    });

    const correlativas = construirCorrelativas(input, userId, materia.id);
    await tx.materiaCorrelativa.createMany({
      data: correlativas,
    });

    return materia;
  });

  return materia;
};

type InputEditarMateria = z.infer<typeof inputEditarMateria>;
export const editarMateria = async (ctx: { db: PrismaClient }, input: InputEditarMateria, userId: string) => {
  const existeMateria = await ctx.db.materia.findFirst({
    where: {
      codigo: input.codigo,
      NOT: {
        id: input.id,
      },
    },
  });

  if (existeMateria) {
    throw new Error("El código de la materia ya existe");
  }

  const materia = await ctx.db.$transaction(async (tx) => {
    const materia = await ctx.db.materia.update({
      data: {
        nombre: input.nombre,
        codigo: input.codigo,
        anio: Number(input.anio),
        duracion: input.duracion,
        tipo: input.tipo,
        directorUsuarioId: input.directorUserId,
        jefeTrabajoPracticos: {
          deleteMany: {},
          createMany: {
            data:
              input.jefesTrabajoPracticoUserId?.map((userId) => ({
                userId: userId,
              })) ?? [],
          },
        },

        usuarioModificadorId: userId,
      },
      where: {
        id: input.id,
      },
    });

    await tx.materiaCorrelativa.deleteMany({
      where: {
        correlativaId: materia.id,
      },
    });

    const correlativas = construirCorrelativas(input, userId, materia.id);
    await tx.materiaCorrelativa.createMany({
      data: correlativas,
    });

    return materia;
  });

  return materia;
};

const construirCorrelativas = (
  input: InputEditarMateria | InputAgregarMateria,
  userId: string,
  correlativaId: number,
): Prisma.MateriaCorrelativaCreateManyInput[] => {
  const materiasRegularizadas: Prisma.MateriaCorrelativaCreateManyInput[] = input.regularizadas.map((materiaId) => ({
    materiaPrerequisitoId: Number(materiaId),
    correlativaId: correlativaId,
    estatusCorrelativa: EstatusCorrelativa.CURSAR_REGULARIZADA,
    usuarioCreadorId: userId,
    usuarioModificadorId: userId,
  }));

  const materiasAprobadasParaCursar: Prisma.MateriaCorrelativaCreateManyInput[] = input.aprobadasParaCursar.map(
    (materiaId) => ({
      materiaPrerequisitoId: Number(materiaId),
      correlativaId: correlativaId,
      estatusCorrelativa: EstatusCorrelativa.CURSAR_APROBADA,
      usuarioCreadorId: userId,
      usuarioModificadorId: userId,
    }),
  );

  const materiasAprobadasParaRendir: Prisma.MateriaCorrelativaCreateManyInput[] = input.aprobadasParaRendir.map(
    (materiaId) => ({
      materiaPrerequisitoId: Number(materiaId),
      correlativaId: correlativaId,
      estatusCorrelativa: EstatusCorrelativa.RENDIR_APROBADA,
      usuarioCreadorId: userId,
      usuarioModificadorId: userId,
    }),
  );

  return [...materiasRegularizadas, ...materiasAprobadasParaCursar, ...materiasAprobadasParaRendir];
};
