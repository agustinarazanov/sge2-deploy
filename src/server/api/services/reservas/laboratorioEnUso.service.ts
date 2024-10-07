import { protectedProcedure } from "../../trpc";
import { validarInput } from "../helper";
import { inputGetReservasExistentesDeLaboratorio } from "@/shared/filters/laboratorio-en-uso.schema";
import { obtenerReservasExistentesDeLaboratorio } from "../../repositories/reservas/laboratorioEnUso.repository";

export const reservasExistentesProcedure = protectedProcedure
  .input(inputGetReservasExistentesDeLaboratorio)
  .query(async ({ ctx, input }) => {
    validarInput(inputGetReservasExistentesDeLaboratorio, input);

    const reservasExistentes = await obtenerReservasExistentesDeLaboratorio(ctx, input);

    return reservasExistentes;
  });
