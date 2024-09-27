import {
  getReservasEnPantalla,
  removerReservaPantalla,
  crearReservaPantalla,
} from "../../repositories/reservas/pantalla.repository";
import { protectedProcedure } from "../../trpc";
import {
  inputAgregarReservaPantalla,
  inputEliminarReservaPantallas,
} from "@/shared/filters/reserva-pantalla-filter.schema";
import { validarInput } from "../helper";

export const getReservasEnPantallaProcedure = protectedProcedure.query(async ({ ctx }) => {
  const reservas = await getReservasEnPantalla(ctx);

  return reservas;
});

export const removerReservaPantallaProcedure = protectedProcedure
  .input(inputEliminarReservaPantallas)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEliminarReservaPantallas, input);

    const reservasPantallaEliminadas = await removerReservaPantalla(ctx, input);

    return reservasPantallaEliminadas;
  });

export const agregarReservaPantallaProcedure = protectedProcedure
  .input(inputAgregarReservaPantalla)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputAgregarReservaPantalla, input);

    const reservaPantallaCreada = await crearReservaPantalla(ctx, input);

    return reservaPantallaCreada;
  });
