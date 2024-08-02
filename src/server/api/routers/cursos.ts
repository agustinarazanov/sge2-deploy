import { createTRPCRouter } from "@/server/api/trpc";
import {
  cursoPorIdProcedure,
  editarCursoProcedure,
  eliminarCursoProcedure,
  getTodosLosCursosProcedure,
  nuevoCursoProcedure,
} from "../services/cursos/cursos.service";

export const cursosRouter = createTRPCRouter({
  getAll: getTodosLosCursosProcedure,
  cursoPorId: cursoPorIdProcedure,
  nuevoCurso: nuevoCursoProcedure,
  editarCurso: editarCursoProcedure,
  eliminarCurso: eliminarCursoProcedure,
});
