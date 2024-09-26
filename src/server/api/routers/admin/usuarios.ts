import { createTRPCRouter } from "@/server/api/trpc";
import {
  editarUsuarioProcedure,
  eliminarUsuarioProcedure,
  getAllTutoresProcedure,
  eliminarTutorProcedure,
  getTodosLosUsuariosProcedure,
  getUsuarioPorIdProcedure,
} from "../../services/admin/usuarios-admin.service";

export const usuariosRouter = createTRPCRouter({
  getAll: getTodosLosUsuariosProcedure,
  getUsuarioPorId: getUsuarioPorIdProcedure,
  eliminarUsuario: eliminarUsuarioProcedure,
  editarUsuario: editarUsuarioProcedure,

  eliminarTutor: eliminarTutorProcedure,
  getAllTutores: getAllTutoresProcedure,
});
