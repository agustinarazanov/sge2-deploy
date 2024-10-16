import { z } from "zod";

export const inputGetUsuarios = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z.enum(["email", "legajo", "apellido", "nombre", "fechaCreacion"]).default("email").catch("email"),
  orderDirection: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  searchText: z.string().default(""),
  rol: z
    .string()
    .optional()
    .refine((value) => value && parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch(""),
});

export const inputEliminarUsuario = z.object({ id: z.string() });

export const inputGetUsuario = z.object({ id: z.string() });

export const inputGetUsuariosPorIds = z.object({ ids: z.array(z.string()) });

export const inputGetTutor = z.object({ id: z.string() });

export const inputEditarUsuario = z.object({
  id: z.string(),
  roles: z.array(z.string()).default([]),
  nombre: z.string().min(1, { message: "Requerido" }),
  apellido: z.string().min(1, { message: "Requerido" }),
  email: z.string().min(1, { message: "Requerido" }),
  legajo: z.string().min(1, { message: "Requerido" }),
  esTutor: z.boolean(),
  esDocente: z.boolean(),
});

// Definimos el esquema de validación para editar un tutor
export const inputEditarTutor = z.object({
  id: z.string(), // ID del tutor, asumimos que es un string
  nombre: z.string().min(1, { message: "El nombre es requerido" }).optional(), // El nombre es obligatorio
  diasHorarios: z.string().min(1, { message: "Los días y horarios son requeridos" }).optional(), // Días y horarios obligatorios
  sede: z.string().min(1, { message: "La sede es requerida" }).optional(), // Sede obligatoria
  especialidad: z.string().min(1, { message: "La especialidad es requerida" }).optional(), // Especialidad obligatoria
});
