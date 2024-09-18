import { inputGetReservaPorUsuarioId } from "@/shared/filters/reservas-filter.schema";
import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { getReservaPorUsuarioId } from "../../repositories/reservas/equipo.repository";

export const getReservaEquipoPorUserProcedure = protectedProcedure
  .input(inputGetReservaPorUsuarioId)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservaPorUsuarioId, input);

    const reservas = await getReservaPorUsuarioId(ctx, input);

    return reservas;
  });
