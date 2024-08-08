import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarEquipoProcedure,
  eliminarEquipoProcedure,
  equipoPorIdProcedure,
  getTodosLosEquiposProcedure,
  getTodosLosTiposProcedure,
  nuevoEquipoProcedure,
} from "../services/equipos/equipos.service";

export const equiposRouter = createTRPCRouter({
  getAll: getTodosLosEquiposProcedure,
  equipoPorId: equipoPorIdProcedure,
  nuevoEquipo: nuevoEquipoProcedure,
  editarEquipo: editarEquipoProcedure,
  eliminarEquipo: eliminarEquipoProcedure,
  getAllTipos: getTodosLosTiposProcedure,
});
