import { z } from "zod";

export const inputGetLaboratorios = z.object({
  searchText: z.string().default(""),
  sedeId: z.string().optional(),
});

export const inputGetLaboratoriosConEstadoReserva = inputGetLaboratorios.merge(
  z.object({
    fechaHoraInicio: z.date().optional(),
    fechaHoraFin: z.date().optional(),
    excepcionReservaId: z.number().optional(),
  }),
);

export const inputGetLaboratorio = z.object({
  id: z.number(),
});

export const inputGetArmarios = z.object({
  laboratorioId: z.number(),
});

export const inputGetEstantes = z.object({
  armarioId: z.number(),
});

export const inputEliminarLaboratorio = inputGetLaboratorio;

export const inputAgregarLaboratorio = z.object({
  nombre: z.string().min(1, { message: "Requerido" }),
  esReservable: z.boolean().default(false),
  sedeId: z.string().min(1, { message: "Requerido" }),
  tienePc: z.boolean().default(false),
});

export const inputEditarLaboratorio = z
  .object({
    id: z.number().optional(), // Si viene significa que se va a usar para editar, si no significa que se va a usar para crear
  })
  .merge(inputAgregarLaboratorio);
