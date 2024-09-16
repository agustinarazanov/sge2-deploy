import { protectedProcedure } from "../../trpc";
import {
  crearPrestamoEquipo,
  devolverEquipo,
  getAllReservas,
  getReservaPorUsuarioId,
  renovarEquipo,
  verReservasDeEquipo,
} from "@/server/api/repositories/reservas/equipo.repository";
import { validarInput } from "@/server/api/services/helper";
import {
  inputGetAllPrestamosEquipos,
  inputGetReservaEquipoPorUsuarioId,
  inputGetReservasEquiposPorEquipoId,
  inputPrestarEquipo,
} from "@/shared/filters/reservas-equipos-filter.schema";

export const getTodasLasReservasProcedure = protectedProcedure
  .input(inputGetAllPrestamosEquipos)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetAllPrestamosEquipos, input);

    const reservas = await getAllReservas(ctx, input);

    return reservas;
  });

export const getReservaEquipoPorUserProcedure = protectedProcedure
  .input(inputGetReservaEquipoPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaEquipoPorUsuarioId, input);

    const reserva = await getReservaPorUsuarioId(ctx, input);

    return reserva;
  });

export const crearPrestamoEquipoProcedure = protectedProcedure
  .input(inputPrestarEquipo)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputPrestarEquipo, input);

    const userId = ctx.session.user.id;

    const reserva = await crearPrestamoEquipo(ctx, input, userId);

    return reserva;
  });

export const verReservasProcedure = protectedProcedure
  .input(inputGetReservasEquiposPorEquipoId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservasEquiposPorEquipoId, input);

    const reservas = await verReservasDeEquipo(ctx, input);

    return reservas;
  });

export const devolverEquipoProcedure = protectedProcedure
  .input(inputGetReservasEquiposPorEquipoId)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputGetReservasEquiposPorEquipoId, input);

    const userId = ctx.session.user.id;

    const reserva = await devolverEquipo(ctx, input, userId);

    return reserva;
  });

export const renovarEquipoProcedure = protectedProcedure.input(inputPrestarEquipo).mutation(async ({ ctx, input }) => {
  validarInput(inputPrestarEquipo, input);

  const userId = ctx.session.user.id;

  const reserva = await renovarEquipo(ctx, input, userId);

  return reserva;
});
