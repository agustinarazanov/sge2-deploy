import { protectedProcedure } from "../../trpc";
import { crearPrestamoLibro, getReservaPorUsuarioId } from "@/server/api/repositories/reservas/biblioteca.repository";
import { validarInput } from "@/server/api/services/helper";
import { inputGetReservaLibroPorUsuarioId, inputPrestarLibro } from "@/shared/filters/reservas-filter.schema";

export const getReservaLibroPorUserProcedure = protectedProcedure
  .input(inputGetReservaLibroPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaLibroPorUsuarioId, input);

    const reserva = await getReservaPorUsuarioId(ctx, input);

    return reserva;
  });

export const crearPrestamoLibroProcedure = protectedProcedure
  .input(inputPrestarLibro)
  .mutation(async ({ ctx, input }) => {
    validarInput(inputPrestarLibro, input);

    const userId = ctx.session.user.id;

    const reserva = await crearPrestamoLibro(ctx, input, userId);

    return reserva;
  });
