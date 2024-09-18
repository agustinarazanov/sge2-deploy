import { z } from "zod";

export const inputAddSoftware = z.object({
  nombre: z.string().min(1, { message: "Requerido" }),
  version: z.string().min(1, { message: "Requerido" }),
  estado: z.string().min(1, { message: "Requerido" }),
  laboratorios: z.array(z.string()).default([]),
});

export const inputGetBooks = z.object({});

export const inputGetSoftware = z.object({
  id: z.number(),
});

export const inputEliminarSoftware = inputGetSoftware;

export const inputEditarSoftware = z
  .object({
    id: z.number().optional(), // Si viene significa que se va a usar para editar, si no significa que se va a usar para crear
  })
  .merge(inputAddSoftware);
