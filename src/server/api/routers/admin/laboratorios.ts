import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarLaboratorioProcedure,
  eliminarLaboratorioProcedure,
  getLaboratorioPorIdProcedure,
  getTodosLosLaboratoriosProcedure,
  nuevoLaboratorioProcedure,
  getTodosLosSedesProcedure,
  getTodosLosArmariosProcedure,
  getTodosLosEstantesProcedure,
  getTodosLosLaboratoriosConEstadoReservaProcedure,
} from "../../services/admin/laboratorios-admin.service";

export const laboratoriosRouter = createTRPCRouter({
  getAll: getTodosLosLaboratoriosProcedure,
  getAllConEstadoReserva: getTodosLosLaboratoriosConEstadoReservaProcedure,
  getAllSedes: getTodosLosSedesProcedure,
  getAllArmarios: getTodosLosArmariosProcedure,
  getAllEstantes: getTodosLosEstantesProcedure,
  getLaboratorioPorId: getLaboratorioPorIdProcedure,
  eliminarLaboratorio: eliminarLaboratorioProcedure,
  editarLaboratorio: editarLaboratorioProcedure,
  nuevoLaboratorio: nuevoLaboratorioProcedure,
});
