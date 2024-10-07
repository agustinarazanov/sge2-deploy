import { reservasExistentesProcedure } from "../../services/reservas/laboratorioEnUso.service";
import { createTRPCRouter } from "../../trpc";

export const laboratorioEnUsoRouter = createTRPCRouter({
  obtenerReservasExistentesDeLaboratorio: reservasExistentesProcedure,
});
