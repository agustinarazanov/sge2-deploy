import { createTRPCRouter } from "@/server/api/trpc";
import { getTodosLosLaboratoriosProcedure } from "../../services/admin/laboratorios-admin.service";

export const laboratoriosRouter = createTRPCRouter({
  getAll: getTodosLosLaboratoriosProcedure,
});
