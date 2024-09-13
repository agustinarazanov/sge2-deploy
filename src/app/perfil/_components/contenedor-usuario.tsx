import DetalleUsuario from "./detalle-usuario";
import DetalleReserva from "./detalle-reserva";
import { type RouterOutputs } from "@/trpc/react";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeakerIcon, BookIcon, BoxIcon } from "lucide-react";

type UsuarioData = RouterOutputs["admin"]["usuarios"]["getUsuarioPorId"];
type DetalleContenedor = {
  usuarioData: UsuarioData;
};

function ContenedorUsuario({ usuarioData }: DetalleContenedor) {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <DetalleUsuario usuarioData={usuarioData} />
      </div>

      <div className="space-y-8">
        <Tabs defaultValue="libros" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="libros">
              <BookIcon className="mr-2 h-4 w-4" />
              Libros
            </TabsTrigger>
            <TabsTrigger value="inventario">
              <BoxIcon className="mr-2 h-4 w-4" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="laboratorio">
              <BeakerIcon className="mr-2 h-4 w-4" />
              Laboratorio
            </TabsTrigger>
          </TabsList>
          <TabsContent value="libros">
            <Suspense fallback={<div>Cargando reservas de libros...</div>}>
              <DetalleReserva idUsuario={usuarioData.id} titulo="Reserva de Libros" descripcion="Historial de Libros" />
            </Suspense>
          </TabsContent>
          <TabsContent value="inventario">
            <Suspense fallback={<div>Cargando reservas de inventario...</div>}>
              <DetalleReserva
                idUsuario={usuarioData.id}
                titulo="Reserva de Inventario"
                descripcion="Historial de Inventarios"
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="laboratorio">
            <Suspense fallback={<div>Cargando reservas de laboratorio...</div>}>
              <DetalleReserva
                idUsuario={usuarioData.id}
                titulo="Reserva de Laboratorio"
                descripcion="Historial de Laboratorios"
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ContenedorUsuario;
