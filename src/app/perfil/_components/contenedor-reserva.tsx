"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeakerIcon, BookIcon, BoxIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import DetalleReserva from "./detalle-reserva";
import type { RouterOutputs } from "@/trpc/react";

type UsuarioData = RouterOutputs["admin"]["usuarios"]["getUsuarioPorId"];
type ReservaBibliotecaData = RouterOutputs["reservas"]["reservaBiblioteca"]["getReservaPorUser"];
type ReservaEquipoData = RouterOutputs["reservas"]["reservaEquipo"]["getReservaPorUser"];
type ReservaLaboratorioData = RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getReservaPorUser"];

type ClienteContenedorUsuarioProps = {
  usuarioData: UsuarioData;
};

const mockReservasLibros = [
  {
    id: 1,
    fechaCreacion: new Date(),
    fechaEntregado: new Date(),
    reservaId: 1,
    libroId: 1,
    usuarioCreadorId: "idUsuario",
    usuarioModificadorId: "",
    fechaModificacion: new Date(),
    libro: {
      id: 1,
      bibliotecaId: "1",
      inventarioId: "1",
      titulo: "Libro 1",
      anio: 2022,
      autorId: 1,
      editorialId: 1,
      isbn: "ISBN 1",
      sedeId: 1,
      laboratorioId: 1,
      idiomaId: 1,
      armarioId: 0,
      estanteId: 0,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      usuarioCreadorId: "",
      usuarioModificadorId: "",
    },
    reserva: {
      id: 1,
      usuarioCreadorId: "idUsuario",
      fechaCreacion: new Date(),
      tipo: "LIBRO",
      estatus: "PENDIENTE",
      fechaHoraInicio: new Date(),
      fechaHoraFin: new Date(),
      codigo: "",
      usuarioModificadorId: "",
      disponible: true,
      usuarioTutorId: "",
      fechaModificacion: new Date(),
      fechaAprobacion: new Date(),
    },
  },
  {
    id: 2,
    fechaCreacion: new Date(),
    fechaEntregado: new Date(),
    reservaId: 2,
    libroId: 2,
    usuarioCreadorId: "idUsuario",
    usuarioModificadorId: "",
    fechaModificacion: new Date(),
    libro: {
      id: 2,
      bibliotecaId: "2",
      inventarioId: "2",
      titulo: "Libro 2asdasd",
      disponible: true,
      anio: 2022,
      autorId: 2,
      editorialId: 2,
      isbn: "ISBN 2",
      sedeId: 2,
      laboratorioId: 2,
      idiomaId: 2,
      armarioId: 0,
      estanteId: 0,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      usuarioCreadorId: "",
      usuarioModificadorId: "",
    },
    reserva: {
      id: 2,
      usuarioCreadorId: "idUsuario",
      fechaCreacion: new Date(),
      tipo: "LIBRO",
      estatus: "PENDIENTE",
      fechaHoraInicio: new Date(),
      fechaHoraFin: new Date(),
      codigo: "",
      usuarioModificadorId: "",
      usuarioTutorId: "",
      fechaModificacion: new Date(),
      fechaAprobacion: new Date(),
    },
  },
];

export default function ContenedorReserva({ usuarioData }: ClienteContenedorUsuarioProps) {
  const [activeTab, setActiveTab] = useState<"libros" | "inventario" | "laboratorio">("libros");

  const { data: reservasLibros, isLoading: isLoadingLibros } = useQuery({
    queryKey: ["reservasLibros", usuarioData.id],
    queryFn: () => api.reservas.reservaBiblioteca.getReservaPorUser({ id: usuarioData.id }),
    enabled: activeTab === "libros",
  });

  const { data: reservasInventario, isLoading: isLoadingInventario } = useQuery({
    queryKey: ["reservasInventario", usuarioData.id],
    queryFn: () => api.reservas.reservaEquipo.getReservaPorUser({ id: usuarioData.id }),
    enabled: activeTab === "inventario",
  });

  const { data: reservasLaboratorio, isLoading: isLoadingLaboratorio } = useQuery({
    queryKey: ["reservasLaboratorio", usuarioData.id],
    queryFn: () => api.reservas.reservaLaboratorioAbierto.getReservaPorUser({ id: usuarioData.id }),
    enabled: activeTab === "laboratorio",
  });

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
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
        {isLoadingLibros ? (
          <div>Cargando reservas de libros...</div>
        ) : (
          <DetalleReserva<ReservaBibliotecaData>
            idUsuario={usuarioData.id}
            titulo="Reserva de Libros"
            descripcion="Historial de Libros"
            reservas={reservasLibros || []}
            columns={[
              { header: "ID", key: "id", className: "w-[100px]" },
              { header: "Fecha de préstamo", key: (item) => item.fechaCreacion.toLocaleDateString("es-ES") },
              { header: "Libro", key: (item) => item.libro?.titulo },
              {
                header: "Estado",
                key: (item) => (
                  <Badge color={item.reserva.estatus === "PENDIENTE" ? "warning" : "primary"}>
                    {item.reserva.estatus}
                  </Badge>
                ),
                className: "text-right",
              },
            ]}
          />
        )}
      </TabsContent>
      <TabsContent value="inventario">
        {isLoadingInventario ? (
          <div>Cargando reservas de inventario...</div>
        ) : (
          <DetalleReserva<ReservaEquipoData>
            idUsuario={usuarioData.id}
            titulo="Reserva de Inventario"
            descripcion="Historial de Inventarios"
            reservas={reservasInventario || []}
            columns={[
              { header: "ID", key: "id", className: "w-[100px]" },
              { header: "Fecha de préstamo", key: (item) => item.fechaCreacion.toLocaleDateString("es-ES") },
              { header: "Nombre", key: (item) => item.reserva.equipo.modelo },
              { header: "Marca", key: (item) => item.reserva.equipo.marca.nombre },
              {
                header: "Estado",
                key: (item) => (
                  <Badge color={item.reserva.estatus === "PENDIENTE" ? "warning" : "primary"}>
                    {item.reserva.estatus}
                  </Badge>
                ),
                className: "text-right",
              },
            ]}
          />
        )}
      </TabsContent>
      <TabsContent value="laboratorio">
        {isLoadingLaboratorio ? (
          <div>Cargando reservas de laboratorio...</div>
        ) : (
          <DetalleReserva<ReservaLaboratorioData>
            idUsuario={usuarioData.id}
            titulo="Reserva de Laboratorio"
            descripcion="Historial de Laboratorios"
            reservas={reservasLaboratorio || []}
            columns={[
              { header: "ID", key: "id", className: "w-[100px]" },
              { header: "Fecha", key: (item) => item.fechaCreacion.toLocaleDateString("es-ES") },
              { header: "Laboratorio", key: "laboratorio" },
              {
                header: "Estado",
                key: (item) => (
                  <Badge color={item.estatus === "PENDIENTE" ? "warning" : "primary"}>{item.estatus}</Badge>
                ),
                className: "text-right",
              },
            ]}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
