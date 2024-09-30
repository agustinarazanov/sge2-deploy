import type {
  inputAgregarReservaPantalla,
  inputEliminarReservaPantallas,
} from "@/shared/filters/reserva-pantalla-filter.schema";
import type { PrismaClient } from "@prisma/client";
import { type z } from "zod";

export const getReservasEnPantalla = async (_ctx: { db: PrismaClient }) => {
  return [
    {
      id: 1,
      docente: "Juan Pérez",
      materia: "Ingeniería Electrónica",
      laboratorio: "UTN-FRBA",
      horaInicio: "10:00",
    },
    {
      id: 2,
      docente: "Alexander Armua",
      materia: "Física",
      laboratorio: "ALU-FRBA",
      horaInicio: "11:00",
    },
  ];
};

type InputEliminarReservaPantalla = z.infer<typeof inputEliminarReservaPantallas>;
export const removerReservaPantalla = async (_ctx: { db: PrismaClient }, _input: InputEliminarReservaPantalla) => {
  // const reservasPantallaEliminadas = await _ctx.db.reserva.deleteMany({
  //   where: {
  //     id: {
  //       in: ids,
  //     },
  //   },
  // });

  // return reservasPantallaEliminadas;

  return [];
};

type InputCrearReservaPantalla = z.infer<typeof inputAgregarReservaPantalla>;
export const crearReservaPantalla = async (_ctx: { db: PrismaClient }, _input: InputCrearReservaPantalla) => {
  // const reservaPantallaCreada = await _ctx.db.reserva.create({
  //   data: {
  //     docente: input.docente,
  //     materiaId: input.materiaId,
  //     materia: input.materia,
  //     laboratorio: input.laboratorio,
  //     horaInicio: input.horaInicio,
  //   },
  // });

  // return reservaPantallaCreada;

  return [];
};
