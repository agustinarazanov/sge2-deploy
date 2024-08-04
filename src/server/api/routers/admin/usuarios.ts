import { createTRPCRouter } from "@/server/api/trpc";
import { getTodosLosUsuariosProcedure } from "../../services/admin/usuarios-admin.service";

export const usuariosRouter = createTRPCRouter({
  getAll: getTodosLosUsuariosProcedure,
});
