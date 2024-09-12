import { api } from "@/trpc/react";
import { Button, ScrollArea } from "@/components/ui";
import { Separator } from "@radix-ui/react-separator";

type Props = {
  id?: string;
  onCancel: () => void;
};

export const LibroView = ({ id, onCancel }: Props) => {
  const libroId = parseInt(id ?? "");

  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId }, { enabled: !!id });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const handleCancel = () => onCancel();

  return (
    <div className="relative flex w-full flex-col gap-4">
      <ScrollArea className="flex max-h-[calc(100vh_-_30%)] w-full flex-col pr-4">
        <div className="my-8 flex w-full flex-col items-center justify-center">
          <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Descripción:</div>
          <div className="flex flex-col space-y-4 px-12">
            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="w-full">
                <u>Título:</u> {libro?.titulo}
              </div>
            </div>

            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="w-full">
                <u>Autor:</u> {libro?.autor.autorNombre}
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="w-full">
                <u>Inventario ID:</u> {libro?.inventarioId}
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="w-full">
                <u>Biblioteca ID:</u> {libro?.bibliotecaId}
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="w-full">
                <u>ISBN:</u> {libro?.isbn}
              </div>

              <div className="w-full">
                <u>Año:</u> {libro?.anio}
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="w-full">
                <u>Editorial:</u> {libro?.editorial.editorial}
              </div>

              <div className="w-full">
                <u>Idioma:</u> {libro?.idioma.idioma}
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="w-full">
                <u>Materias:</u> {libro?.materias.map((materia) => materia.materia.nombre).join(", ")}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-2 border-2" />

        <div className="my-8 flex w-full flex-col items-center justify-center">
          <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Ubicación:</div>
          <div className="flex w-full flex-col space-y-4 px-12">
            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="basis-1/4">
                <u>Sede:</u> {libro?.sede.nombre}
              </div>

              <div className="basis-1/4">
                <u>Laboratorio:</u> {libro?.laboratorio.nombre}
              </div>

              <div className="basis-1/4">
                <u>Armario:</u> {libro?.armario?.nombre ?? "Vacío"}
              </div>

              <div className="basis-1/4">
                <u>Estante:</u> {libro?.estante?.nombre ?? "Vacío"}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-2 border-2" />

        <div className="my-8 flex w-full flex-col items-center justify-center">
          <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">
            Historial de Prestamos:
          </div>
          <div className="flex w-full flex-col space-y-4 px-12">
            <table>
              <thead>
                <th>Prestamo #</th>
                <th>Prestado a</th>
                <th>Fecha del prestamo</th>
                <th>Fecha de finalización</th>
                <th>Prestó</th>
                <th>Renovado</th>
                <th>Recibió</th>
              </thead>
            </table>
          </div>
        </div>

        <Separator className="my-2 border-2" />

        <div className="my-8 flex w-full flex-col items-center justify-center">
          <UsuarioCreador usuarioId={libro?.usuarioCreadorId ?? ""} fechaCreacion={libro?.fechaCreacion ?? ""} />
        </div>
      </ScrollArea>

      <div className="flex w-full flex-row items-end justify-end space-x-4">
        <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
          Volver
        </Button>
      </div>
    </div>
  );
};

const UsuarioCreador = ({ usuarioId, fechaCreacion }: { usuarioId: string; fechaCreacion: Date | string }) => {
  const {
    data: creador,
    isLoading,
    isError,
  } = api.admin.usuarios.getUsuarioPorId.useQuery({ id: usuarioId }, { enabled: !!usuarioId });

  if (isLoading) {
    return <div>Cargando usuario creador...</div>;
  }

  if (isError) {
    return <div>Error al cargar usuario creador...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 px-0 md:px-6">
      Equipo dado de alta el {new Date(fechaCreacion).toLocaleDateString("es-ES")} por{" "}
      {creador?.nombre ?? "Usuario sin nombre"} ({creador?.apellido ?? "Usuario sin apellido"})
    </div>
  );
};
