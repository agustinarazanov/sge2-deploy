import { createTRPCRouter } from "../trpc";
import { getUsuarioPermiso, usuarioTienePermisos } from "../services/permisos/permisos.service";

export const usuarioPermiso = createTRPCRouter({
  getPermisosUsuario: getUsuarioPermiso,
  usuarioTienePermisos: usuarioTienePermisos,
});
