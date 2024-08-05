import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import {
  inputAgregarRol,
  inputEditarRol,
  inputEliminarRol,
  inputGetRol,
  inputGetRoles,
} from "@/shared/filters/admin-roles-filter.schema";
import {
  agregarRol,
  eliminarRol,
  editarRol,
  getAllPermisos,
  getAllRoles,
  getRolById,
} from "../../repositories/admin/roles-admin.repository";
import { Prisma } from "@prisma/client";

export const getTodosLosRolesProcedure = protectedProcedure.input(inputGetRoles).query(async ({ ctx, input }) => {
  validarInput(inputGetRoles, input);

  const roles = await getAllRoles(ctx, input);

  return roles;
});

export const getRolByIdProcedure = protectedProcedure.input(inputGetRol).query(async ({ ctx, input }) => {
  validarInput(inputGetRol, input);

  const role = await getRolById(ctx, input);

  return role;
});

export const eliminarRolProcedure = protectedProcedure.input(inputEliminarRol).mutation(async ({ ctx, input }) => {
  validarInput(inputEliminarRol, input);

  const role = await eliminarRol(ctx, input);

  return role;
});

export const getTodosLosPermisosProcedure = protectedProcedure.query(async ({ ctx }) => {
  const permisos = await getAllPermisos(ctx);

  return permisos;
});

export const editarRolProcedure = protectedProcedure.input(inputEditarRol).mutation(async ({ ctx, input }) => {
  validarInput(inputEditarRol, input);

  const userId = ctx.session.user.id;

  try {
    const role = await editarRol(ctx, input, userId);

    return role;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(error);
        throw new Error("Ocurrió un error al editar el rol");
      }
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Error editando rol");
  }
});

export const nuevoRolProcedure = protectedProcedure.input(inputAgregarRol).mutation(async ({ ctx, input }) => {
  validarInput(inputAgregarRol, input);

  const userId = ctx.session.user.id;

  try {
    const rol = await agregarRol(ctx, input, userId);

    return rol;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log(error);
        throw new Error("Ocurrió un error al agregar el rol");
      }
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Error agregando rol");
  }
});
