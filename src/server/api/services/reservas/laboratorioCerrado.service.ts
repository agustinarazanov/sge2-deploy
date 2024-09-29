import {
  inputAprobarReservaLaboratorioCerradoSchema,
  inputEditarReservaLaboratorioCerradoSchema,
  inputGetAllSolicitudesReservaLaboratorioCerrado,
  inputGetReservaLaboratorioPorId,
  inputGetReservaLaboratorioPorUsuarioId,
  inputRechazarReservaLaboratorioCerrado,
  inputReservaLaboratorioCerrado,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import {
  aprobarReserva,
  cancelarReserva,
  crearReservaLaboratorioCerrado,
  editarReserva,
  getAllReservas,
  getReservaPorId,
  getReservaPorUsuarioId,
  rechazarReserva,
} from "../../repositories/reservas/laboratorioCerrado.repository";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";

export const getReservaLaboratorioCerradoPorUserProcedure = protectedProcedure
  .input(inputGetReservaLaboratorioPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaLaboratorioPorUsuarioId, input);

    const reserva = await getReservaPorUsuarioId(ctx, input);

    return reserva;
  });

export const getTodasLasReservasProcedure = protectedProcedure
  .input(inputGetAllSolicitudesReservaLaboratorioCerrado)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetAllSolicitudesReservaLaboratorioCerrado, input);

    const userId = ctx.session.user.id;

    const reservas = await getAllReservas(ctx, input, userId);

    return reservas;
  });

export const getReservaLaboratorioCerradoPorIdProcedure = protectedProcedure
  .input(inputGetReservaLaboratorioPorId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaLaboratorioPorId, input);

    const reserva = await getReservaPorId(ctx, input);

    return reserva;
  });

export const aprobarReservaProcedure = protectedProcedure
  .input(inputAprobarReservaLaboratorioCerradoSchema)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputAprobarReservaLaboratorioCerradoSchema, input);

    const userId = ctx.session.user.id;

    const reserva = await aprobarReserva(ctx, input, userId);

    return reserva;
  });

export const rechazarReservaProcedure = protectedProcedure
  .input(inputRechazarReservaLaboratorioCerrado)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputRechazarReservaLaboratorioCerrado, input);

    const userId = ctx.session.user.id;

    const reserva = await rechazarReserva(ctx, input, userId);

    return reserva;
  });

export const cancelarReservaProcedure = protectedProcedure
  .input(inputRechazarReservaLaboratorioCerrado)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputRechazarReservaLaboratorioCerrado, input);

    const userId = ctx.session.user.id;

    const reserva = await cancelarReserva(ctx, input, userId);

    return reserva;
  });

export const editarReservaProcedure = protectedProcedure
  .input(inputEditarReservaLaboratorioCerradoSchema)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEditarReservaLaboratorioCerradoSchema, input);

    const userId = ctx.session.user.id;

    const reserva = await editarReserva(ctx, input, userId);

    return reserva;
  });

export const inputCrearReservaLaboratorioCerradoProcedure = protectedProcedure
  .input(inputReservaLaboratorioCerrado)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputReservaLaboratorioCerrado, input);

    const userId = ctx.session.user.id;

    const reserva = await crearReservaLaboratorioCerrado(ctx, input, userId);

    return reserva;
  });
