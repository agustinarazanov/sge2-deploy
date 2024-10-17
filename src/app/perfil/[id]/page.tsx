import ContenedorUsuario from "@/app/perfil/_components/contenedor-usuario";
import { api } from "@/trpc/server";
type PageProps = {
  params: { id?: string };
};

export default async function PerfilHome({ params: { id } }: PageProps) {
  if (id === undefined) {
    return <div>Usuario no encontrado</div>;
  }

  const usuario = await api.admin.usuarios.getUsuarioPorId({ id: id });

  if (!usuario) {
    return <div>Usuario no encontrado</div>;
  }

  return <ContenedorUsuario usuarioData={usuario} />;
}
