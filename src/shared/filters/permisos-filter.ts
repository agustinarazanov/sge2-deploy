import { z } from "zod";

export const inputGetUsuarioYRol = z.object({
  usuarioId: z.string(),
});
export const permisosSchema = z.object({
  permisos: z.array(z.string()), // Un array de permisos como strings
});
