import {
  type inputEditarCurso,
  type inputEliminarCurso,
  type inputAgregarCurso,
  type inputGetCurso,
  type inputGetCursos,
} from "@/shared/filters/cursos-filter.schema";
import { Prisma, type PrismaClient } from "@prisma/client";
import { type z } from "zod";

type InputGetAll = z.infer<typeof inputGetCursos>;
export const getAllCursos = async (ctx: { db: PrismaClient }, input: InputGetAll) => {
  const { pageIndex, pageSize, materia, anioDeCarrera, userId, searchText } = input;

  const where = {
    materiaId: materia ? parseInt(materia) : undefined,
    anioDeCarrera: anioDeCarrera ? parseInt(anioDeCarrera) : undefined,
    division: {
      nombre: {
        contains: searchText.toUpperCase(),
      },
    },
    OR: [
      {
        profesores: {
          some: {
            userId: userId,
          },
        },
      },
      {
        ayudantes: {
          some: {
            userId: userId,
          },
        },
      },
    ],
  };

  const [cursos, count] = await ctx.db.$transaction([
    ctx.db.curso.findMany({
      include: {
        materia: true,
        division: true,
        sede: true,
        ayudantes: {
          include: {
            usuario: {
              select: {
                nombre: true,
                apellido: true,
              },
            },
          },
        },
        profesores: {
          include: {
            usuario: {
              select: {
                nombre: true,
                apellido: true,
              },
            },
          },
        },
      },
      where: where,
      orderBy: [
        { anioDeCarrera: "asc" },
        { materia: { nombre: "asc" } },
        { sede: { nombre: "desc" } },
        { ac: "asc" },
        { turno: "asc" },
        { division: { nombre: "asc" } },
      ],
      skip: parseInt(pageIndex) * parseInt(pageSize),
      take: parseInt(pageSize),
    }),
    ctx.db.curso.count({ where }),
  ]);

  return {
    count,
    cursos,
  };
};

type InputGetCursoPorId = z.infer<typeof inputGetCurso>;
export const getCursoPorId = async (ctx: { db: PrismaClient }, input: InputGetCursoPorId) => {
  const { id } = input;

  const curso = await ctx.db.curso.findUnique({
    include: {
      materia: true,
      division: true,
      sede: true,
      ayudantes: {
        select: {
          usuario: {
            select: {
              apellido: true,
              nombre: true,
            },
          },
        },
      },
      profesores: {
        select: {
          usuario: {
            select: {
              apellido: true,
              nombre: true,
            },
          },
        },
      },
    },
    where: {
      id,
    },
  });

  return curso;
};

type InputAgregarCurso = z.infer<typeof inputAgregarCurso>;
export const agregarCurso = async (ctx: { db: PrismaClient }, input: InputAgregarCurso, userId: string) => {
  try {
    const curso = await ctx.db.curso.create({
      data: {
        materiaId: parseInt(input.materiaId),
        // ayudanteUserId: userId,
        // profesorUserId: userId,
        sedeId: 1,
        ac: "A",
        dia1: "LUNES",
        dia2: "MARTES",
        duracion1: "4",
        duracion2: "4",
        horaInicio1: "1",
        horaInicio2: "1",
        turno: "MANANA",
        activo: true,
        anioDeCarrera: 1,
        divisionId: 1,

        usuarioCreadorId: userId,
        usuarioModificadorId: userId,
      },
    });

    return curso;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("El código de curso ya existe");
      }
    }

    throw new Error("Error agregando libro");
  }
};

type inputEliminarCurso = z.infer<typeof inputEliminarCurso>;
export const eliminarCurso = async (ctx: { db: PrismaClient }, input: inputEliminarCurso) => {
  try {
    const libro = await ctx.db.libro.delete({
      where: {
        id: input.id,
      },
    });

    return libro;
  } catch (error) {
    throw new Error(`Error eliminando curso ${input.id}`);
  }
};

type InputEditarCurso = z.infer<typeof inputEditarCurso>;
export const editarCurso = async (ctx: { db: PrismaClient }, input: InputEditarCurso, userId: string) => {
  try {
    const libro = await ctx.db.curso.update({
      data: {
        activo: input.activo,

        usuarioModificadorId: userId,
        sedeId: 1,
      },
      where: {
        id: input.id,
      },
    });

    return libro;
  } catch (error) {
    throw new Error(`Error modificando curso ${input.id}`);
  }
};
