import {
  eliminarMateriaProcedure,
  getAllMateriasProcedure,
  editarMateriaProcedure,
  nuevaMateriaProcedure,
  getMateriaByIdProcedure,
} from "../services/materia/materia.service";

import { createTRPCRouter } from "@/server/api/trpc";

export const materiasRouter = createTRPCRouter({
  getAll: getAllMateriasProcedure,
  getMateriaById: getMateriaByIdProcedure,
  eliminarMateria: eliminarMateriaProcedure,
  editarMateria: editarMateriaProcedure,
  nuevaMateria: nuevaMateriaProcedure,
});
