import { inputGetReservaPorUsuarioId } from "@/shared/filters/reservas-filter.schema";
import { getReservaPorUsuarioId } from "../../repositories/reservas/laboratorioAbierto.repository";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";

export const getReservaLaboratorioAbiertoPorUserProcedure = protectedProcedure
  .input(inputGetReservaPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaPorUsuarioId, input);

    const reserva = await getReservaPorUsuarioId(ctx, input);

    return reserva;
  });
