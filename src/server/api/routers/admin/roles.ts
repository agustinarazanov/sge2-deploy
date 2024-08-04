import { createTRPCRouter } from "@/server/api/trpc";
import {
  eliminarRolProcedure,
  getTodosLosPermisosProcedure,
  getTodosLosRolesProcedure,
} from "../../services/admin/roles-admin.service";

export const rolesRouter = createTRPCRouter({
  getAll: getTodosLosRolesProcedure,
  eliminarRol: eliminarRolProcedure,

  getAllPermisos: getTodosLosPermisosProcedure,
});
