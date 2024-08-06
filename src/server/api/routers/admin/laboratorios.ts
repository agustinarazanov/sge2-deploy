import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarLaboratorioProcedure,
  eliminarLaboratorioProcedure,
  getLaboratorioPorIdProcedure,
  getTodosLosLaboratoriosProcedure,
  nuevoLaboratorioProcedure,
} from "../../services/admin/laboratorios-admin.service";

export const laboratoriosRouter = createTRPCRouter({
  getAll: getTodosLosLaboratoriosProcedure,
  getLaboratorioPorId: getLaboratorioPorIdProcedure,
  eliminarLaboratorio: eliminarLaboratorioProcedure,
  editarLaboratorio: editarLaboratorioProcedure,
  nuevoLaboratorio: nuevoLaboratorioProcedure,
});
