import { type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { type inputGetUsuarioYRol } from "@/shared/filters/permisos-filter";

type InputGetUsuarioYRol = z.infer<typeof inputGetUsuarioYRol>;

export const getUsuarioYPermisos = async (ctx: { db: PrismaClient }, input: InputGetUsuarioYRol) => {
  const { usuarioId } = input;

  const usuario = await ctx.db.user.findUnique({
    where: { id: usuarioId },
    include: {
      usuarioRol: {
        include: {
          rol: {
            include: {
              rolPermiso: {
                include: {
                  permiso: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!usuario) {
    throw new Error(`Usuario con ID ${usuarioId} no encontrado.`);
  }

  return usuario;
};

export const verificarPermisoUsuario = async (ctx: { db: PrismaClient }, usuarioId: string, permisos: string[]) => {
  const usuarioConPermisos = await ctx.db.user.findFirst({
    where: {
      id: usuarioId,
      OR: [
        {
          usuarioRol: {
            some: {
              rol: {
                nombre: {
                  in: permisos,
                },
              },
            },
          },
        },
        {
          usuarioRol: {
            some: {
              rol: {
                rolPermiso: {
                  some: {
                    permiso: {
                      nombre: {
                        in: permisos,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });

  return !!usuarioConPermisos; // Retorna true si el usuario tiene algún permiso
};
