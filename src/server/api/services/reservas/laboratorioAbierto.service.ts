import {
  inputAprobarORechazarSolicitudReservaLaboratorioAbierto,
  inputEditarReservaLaboratorioAbiertoSchema,
  inputGetAllSolicitudesReservaLaboratorioAbierto,
  inputGetReservaPorId,
  inputGetReservaPorUsuarioId,
} from "@/shared/filters/reservas-filter.schema";
import {
  getReservaPorUsuarioId,
  getAllReservas,
  getReservaPorId,
  aprobarReserva,
  rechazarReserva,
} from "../../repositories/reservas/laboratorioAbierto.repository";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";

export const getReservaLaboratorioAbiertoPorUserProcedure = protectedProcedure
  .input(inputGetReservaPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaPorUsuarioId, input);

    const reserva = await getReservaPorUsuarioId(ctx, input);

    return reserva;
  });

export const getTodasLasReservasProcedure = protectedProcedure
  .input(inputGetAllSolicitudesReservaLaboratorioAbierto)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetAllSolicitudesReservaLaboratorioAbierto, input);

    const userId = ctx.session.user.id;

    const reservas = await getAllReservas(ctx, input, userId);

    return reservas;
  });

export const getReservaLaboratorioAbiertoPorIdProcedure = protectedProcedure
  .input(inputGetReservaPorId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaPorId, input);

    const reserva = await getReservaPorId(ctx, input);

    return reserva;
  });

export const aprobarReservaProcedure = protectedProcedure
  .input(inputAprobarORechazarSolicitudReservaLaboratorioAbierto)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputAprobarORechazarSolicitudReservaLaboratorioAbierto, input);

    const userId = ctx.session.user.id;

    const reserva = await aprobarReserva(ctx, input, userId);

    return reserva;
  });

export const rechazarReservaProcedure = protectedProcedure
  .input(inputAprobarORechazarSolicitudReservaLaboratorioAbierto)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputAprobarORechazarSolicitudReservaLaboratorioAbierto, input);

    const userId = ctx.session.user.id;

    const reserva = await rechazarReserva(ctx, input, userId);

    return reserva;
  });

export const editarReservaProcedure = protectedProcedure
  .input(inputEditarReservaLaboratorioAbiertoSchema)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEditarReservaLaboratorioAbiertoSchema, input);

    console.log("TODO: editar reserva", ctx, input);

    return {};
  });
