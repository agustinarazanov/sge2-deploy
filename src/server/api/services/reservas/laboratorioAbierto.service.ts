import { revalidatePath } from "next/cache";
import {
  getReservaPorUsuarioId,
  getAllReservas,
  getReservaPorId,
  aprobarReserva,
  rechazarReserva,
  crearReservaLaboratorioAbierto,
  cancelarReserva,
  editarReserva,
} from "../../repositories/reservas/laboratorioAbierto.repository";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import {
  inputAprobarReservaLaboratorioAbiertoSchema,
  inputReservaLaboratorioAbierto,
  inputEditarReservaLaboratorioAbiertoSchema,
  inputGetAllSolicitudesReservaLaboratorioAbierto,
  inputRechazarReservaLaboratorioAbierto,
  inputGetReservaLaboratorioPorUsuarioId,
  inputGetReservaLaboratorioPorId,
  inputCancelarReservaLaboratorioAbierto,
} from "@/shared/filters/reserva-laboratorio-filter.schema";

export const getReservaLaboratorioAbiertoPorUserProcedure = protectedProcedure
  .input(inputGetReservaLaboratorioPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaLaboratorioPorUsuarioId, input);

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
  .input(inputGetReservaLaboratorioPorId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaLaboratorioPorId, input);

    const reserva = await getReservaPorId(ctx, input);

    return reserva;
  });

export const aprobarReservaProcedure = protectedProcedure
  .input(inputAprobarReservaLaboratorioAbiertoSchema)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputAprobarReservaLaboratorioAbiertoSchema, input);

    const userId = ctx.session.user.id;

    const reserva = await aprobarReserva(ctx, input, userId);

    return reserva;
  });

export const rechazarReservaProcedure = protectedProcedure
  .input(inputRechazarReservaLaboratorioAbierto)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputRechazarReservaLaboratorioAbierto, input);

    const userId = ctx.session.user.id;

    const reserva = await rechazarReserva(ctx, input, userId);

    return reserva;
  });

export const cancelarReservaProcedure = protectedProcedure
  .input(inputCancelarReservaLaboratorioAbierto)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputCancelarReservaLaboratorioAbierto, input);

    const userId = ctx.session.user.id;

    const reserva = await cancelarReserva(ctx, input, userId);

    return reserva;
  });

export const editarReservaProcedure = protectedProcedure
  .input(inputEditarReservaLaboratorioAbiertoSchema)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputEditarReservaLaboratorioAbiertoSchema, input);

    const userId = ctx.session.user.id;

    const reserva = await editarReserva(ctx, input, userId);

    return reserva;
  });

export const inputCrearReservaLaboratorioAbiertoProcedure = protectedProcedure
  .input(inputReservaLaboratorioAbierto)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputReservaLaboratorioAbierto, input);

    const userId = ctx.session.user.id;

    const reserva = await crearReservaLaboratorioAbierto(ctx, input, userId);

    revalidatePath("/");

    return reserva;
  });
