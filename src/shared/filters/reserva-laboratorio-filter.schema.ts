import { z } from "zod";
import { enumReservaEstatus } from "./reservas-filter.schema";
import { TurnoCurso } from "@prisma/client";

const inputEquipoReservado = z.object({ equipoId: z.number(), cantidad: z.number() });

export const inputGetReservaLaboratorioPorUsuarioId = z.object({
  id: z.string().min(1),
});

export const inputGetReservaLaboratorioPorId = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
});

const inputReservaLaboratorioDiscrecionalBase = z.object({
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  requierePc: z.boolean().default(false),
  requiereProyector: z.boolean().default(false),
  equipoReservado: z.array(inputEquipoReservado).default([]),
  observaciones: z.string().max(250, { message: "Máximo 250 caracteres" }).default(""),
  aceptoTerminos: z.boolean().refine((value) => value === true, { message: "Debe aceptar los términos y condiciones" }),
});

export const inputReservaLaboratorioDiscrecional = z
  .object({
    id: z
      .number()
      .optional()
      .refine((value) => value === undefined, { message: "No debe tener valor, se utilizo para Typecheck" }),
    cursoId: z
      .number()
      .optional()
      .refine((value) => value === undefined, { message: "No debe tener valor, se utilizo para Typecheck" }),

    turno: z
      .enum([TurnoCurso.MANANA, TurnoCurso.TARDE, TurnoCurso.NOCHE])
      .default(TurnoCurso.MANANA)
      .catch(TurnoCurso.MANANA),
  })
  .merge(inputReservaLaboratorioDiscrecionalBase);

export const inputReservaLaboratorioCerrado = z
  .object({
    cursoId: z.number().min(1, { message: "Requerido" }),
  })
  .merge(inputReservaLaboratorioDiscrecionalBase);

export const inputReservaLaboratorioAbierto = z.object({
  tipo: z.enum(["LA", "TLA", "TLA_BASICA"]),
  fechaReserva: z.string().min(1, { message: "Requerido" }),
  concurrentes: z.number().min(1, { message: "Requerido" }),
  sedeId: z.string().refine((value) => parseInt(value) >= 0, { message: "Debe seleccionar una sede" }),
  equipoReservado: z.array(inputEquipoReservado).default([]),
  observaciones: z.string().default(""),
  especialidad: z.string().optional().default(""),
  aceptoTerminos: z.boolean().refine((value) => value === true, { message: "Debe aceptar los términos y condiciones" }),
});

export const inputAprobarReservaLaboratorioAbiertoSchema = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  tutorId: z.string().optional(),
  inventarioRevisado: z.array(z.string()),
  laboratorioId: z.string().optional(),
  equipoReservado: z.array(inputEquipoReservado).default([]),
});

export const inputEditarReservaLaboratorioAbiertoSchema = z
  .object({
    id: z.number().positive().min(1, { message: "Requerido" }),
  })
  .merge(inputReservaLaboratorioAbierto);

export const inputGetAllSolicitudesReservaLaboratorioAbierto = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum([
      "id",
      "laboratorioId",
      "sede",
      "reserva_fechaCreacion",
      "reserva_fechaHoraInicio",
      "reserva_fechaHoraFin",
      "reserva_usuarioSolicito_apellido",
    ])
    .default("id")
    .catch("id"),
  orderDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  searchText: z.string().default(""),
  estatus: enumReservaEstatus.default("").catch(""),
  filtrByUserId: z.enum(["true", "false"]).optional(),
});

export const inputRechazarReservaLaboratorioAbierto = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  motivo: z.string().min(1, { message: "Requerido" }),
});

export const inputCancelarReservaLaboratorioAbierto = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
});

export const inputAprobarReservaLaboratorioCerradoSchema = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  inventarioRevisado: z.array(z.string()),
  laboratorioId: z.string().optional(),
  equipoRequerido: z.array(inputEquipoReservado).default([]),
  equipoReservado: z.array(inputEquipoReservado).default([]),
});

export const inputEditarReservaLaboratorioCerradoSchema = z
  .object({
    id: z.number().positive().min(1, { message: "Requerido" }),
  })
  .merge(inputReservaLaboratorioCerrado);

export const inputGetAllSolicitudesReservaLaboratorioCerrado = z.object({
  pageSize: z.enum(["10", "20", "30", "40", "50"]).default("10").catch("10"),
  pageIndex: z
    .string()
    .default("0")
    .refine((value) => parseInt(value) >= 0, { message: "Debe ser mayor o igual a 0" })
    .catch("0"),
  orderBy: z
    .enum(["id", "laboratorioId", "sede", "reserva_fechaCreacion", "reserva_usuarioSolicito_apellido"])
    .default("id")
    .catch("id"),
  orderDirection: z.enum(["asc", "desc"]).default("desc").catch("desc"),
  searchText: z.string().default(""),
  estatus: enumReservaEstatus.default("").catch(""),
  filtrByUserId: z.enum(["true", "false"]).optional(),
});

export const inputRechazarReservaLaboratorioCerrado = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  motivo: z.string().min(1, { message: "Requerido" }),
});
