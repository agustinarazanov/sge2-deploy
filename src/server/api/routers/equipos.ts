import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarEquipoProcedure,
  eliminarEquipoProcedure,
  equipoPorIdProcedure,
  getTodosLosEquiposProcedure,
  getTodosLosTiposProcedure,
  nuevoEquipoProcedure,
  getTodasLasMarcasProcedure,
  getTodosLosEstadosProcedure,
  eliminarTipoProcedure,
  tipoPorIdProcedure,
  editarTipoProcedure,
  nuevoTipoProcedure,
} from "../services/equipos/equipos.service";

export const equiposRouter = createTRPCRouter({
  getAll: getTodosLosEquiposProcedure,
  equipoPorId: equipoPorIdProcedure,
  nuevoEquipo: nuevoEquipoProcedure,
  editarEquipo: editarEquipoProcedure,
  eliminarEquipo: eliminarEquipoProcedure,
  eliminarTipo: eliminarTipoProcedure,
  getAllTipos: getTodosLosTiposProcedure,
  tipoPorId: tipoPorIdProcedure,
  editarTipo: editarTipoProcedure,
  nuevoTipo: nuevoTipoProcedure,
  getAllMarcas: getTodasLasMarcasProcedure,
  getAllEstados: getTodosLosEstadosProcedure,
});
