import { api } from "@/trpc/react";

export const UsuarioCreador = ({ libroId }: { libroId: number }) => {
  const { data: libro, isLoading: isLoading1, isError: isError1 } = api.biblioteca.libroPorId.useQuery({ libroId });

  const {
    data: creador,
    isLoading: isLoading2,
    isError: isError2,
  } = api.admin.usuarios.getUsuarioPorId.useQuery({ id: libro?.usuarioCreadorId ?? "" }, { enabled: !!libro });

  if (isError1 || isError2) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading1 || isLoading2) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 px-0 md:px-6">
      Equipo dado de alta el {new Date(libro?.fechaCreacion ?? "").toLocaleDateString("es-ES")} por{" "}
      {creador?.nombre ?? "Usuario sin nombre"} ({creador?.apellido ?? "Usuario sin apellido"})
    </div>
  );
};
