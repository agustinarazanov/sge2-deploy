import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarUsuarioProcedure,
  eliminarUsuarioProcedure,
  getAllProfesoresProcedure,
  getAllTutoresProcedure,
  eliminarTutorProcedure,
  editarTutorProcedure,
  getTutorPorIdProcedure,
  getTodosLosUsuariosProcedure,
  getUsuarioPorIdProcedure,
  getAllTutoresEspecialidadesProcedure,
  getUsuariosPorIdsProcedure,
} from "../../services/admin/usuarios-admin.service";

export const usuariosRouter = createTRPCRouter({
  getAll: getTodosLosUsuariosProcedure,
  getUsuarioPorId: getUsuarioPorIdProcedure,
  getUsuariosPorIds: getUsuariosPorIdsProcedure,
  eliminarUsuario: eliminarUsuarioProcedure,
  editarUsuario: editarUsuarioProcedure,

  getTutorPorId: getTutorPorIdProcedure,
  editarTutor: editarTutorProcedure,
  eliminarTutor: eliminarTutorProcedure,
  getAllTutores: getAllTutoresProcedure,
  getAllTutoresEspecialidades: getAllTutoresEspecialidadesProcedure,
  getAllProfesores: getAllProfesoresProcedure,
});
