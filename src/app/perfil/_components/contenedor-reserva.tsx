"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeakerIcon, BookIcon, BoxIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import DetalleReserva from "./detalle-reserva";
import type { RouterOutputs } from "@/trpc/react";
import { getDateISOString, getDateTimeISO, getTimeISOString } from "@/shared/get-date";

type UsuarioData = RouterOutputs["admin"]["usuarios"]["getUsuarioPorId"];

type ClienteContenedorUsuarioProps = {
  usuarioData: UsuarioData;
};

export default function ContenedorReserva({ usuarioData }: ClienteContenedorUsuarioProps) {
  const [activeTab, setActiveTab] = useState<"libros" | "inventario" | "laboratorio abierto" | "laboratorio cerrado">(
    "libros",
  );

  if (!usuarioData) {
    return <div>Usuario no encontrado</div>;
  }

  const { data: reservasLibros, isLoading: isLoadingLibros } =
    api.reservas.reservaBiblioteca.getReservaPorUser.useQuery(
      { id: usuarioData.id },
      {
        enabled: activeTab === "libros",
      },
    );

  const { data: reservasInventario, isLoading: isLoadingInventario } =
    api.reservas.reservaEquipo.getReservaPorUser.useQuery(
      { id: usuarioData.id },
      {
        enabled: activeTab === "inventario",
      },
    );

  const { data: reservasLaboratorioAbierto, isLoading: isLoadingLaboratorioAbierto } =
    api.reservas.reservaLaboratorioAbierto.getReservaPorUser.useQuery(
      { id: usuarioData.id },
      {
        enabled: activeTab === "laboratorio abierto",
      },
    );

  const { data: reservasLaboratorioCerrado, isLoading: isLoadingLaboratorioCerrado } =
    api.reservas.reservarLaboratorioCerrado.getReservaPorUser.useQuery(
      { id: usuarioData.id },
      {
        enabled: activeTab === "laboratorio cerrado",
      },
    );

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="libros">
          <BookIcon className="mr-2 h-4 w-4" />
          Libros
        </TabsTrigger>
        <TabsTrigger value="inventario">
          <BoxIcon className="mr-2 h-4 w-4" />
          Inventario
        </TabsTrigger>
        <TabsTrigger value="laboratorio abierto">
          <BeakerIcon className="mr-2 h-4 w-4" />
          Laboratorio abierto
        </TabsTrigger>
        <TabsTrigger value="laboratorio cerrado">
          <BeakerIcon className="mr-2 h-4 w-4" />
          Laboratorio cerrado
        </TabsTrigger>
      </TabsList>
      <TabsContent value="libros">
        {isLoadingLibros ? (
          <div>Cargando reservas de libros...</div>
        ) : (
          <DetalleReserva
            idUsuario={usuarioData.id}
            titulo="Reserva de Libros"
            descripcion="Historial de Libros"
            reservas={reservasLibros ?? []}
            columns={[
              { header: "ID", key: "id", className: "w-[100px]" },
              { header: "Fecha de préstamo", key: (item) => getDateISOString(item.fechaCreacion) },
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
          <DetalleReserva
            idUsuario={usuarioData.id}
            titulo="Reserva de Inventario"
            descripcion="Historial de Inventarios"
            reservas={reservasInventario ?? []}
            columns={[
              { header: "ID", key: "id", className: "w-[100px]" },
              { header: "Fecha de préstamo", key: (item) => getDateISOString(item.fechaCreacion) },
              { header: "Nombre", key: (item) => item.equipo.modelo },
              { header: "Marca", key: (item) => item.equipo.marca.nombre },
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
      <TabsContent value="laboratorio abierto">
        {isLoadingLaboratorioAbierto ? (
          <div>Cargando reservas de laboratorio abierto...</div>
        ) : (
          <DetalleReserva
            idUsuario={usuarioData.id}
            titulo="Reserva de Laboratorio abierto"
            descripcion="Historial de Reservas de Laboratorios abiertos"
            reservas={reservasLaboratorioAbierto ?? []}
            columns={[
              { header: "ID", key: "id", className: "w-[100px]" },
              {
                header: "Fecha Solicitud Reserva",
                key: (item) => getDateISOString(item.fechaCreacion),
              },
              {
                header: "Hora Inicio",
                key: (item) => getTimeISOString(item.reserva.fechaHoraInicio),
              },
              {
                header: "Hora Fin",
                key: (item) => getTimeISOString(item.reserva.fechaHoraFin),
              },
              { header: "Laboratorio", key: (item) => item.laboratorio?.nombre ?? "" },
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
      <TabsContent value="laboratorio cerrado">
        {isLoadingLaboratorioCerrado ? (
          <div>Cargando reservas de laboratorio...</div>
        ) : (
          <DetalleReserva
            idUsuario={usuarioData.id}
            titulo="Reserva de Laboratorio"
            descripcion="Historial de Reservas de Laboratorios"
            reservas={reservasLaboratorioCerrado ?? []}
            columns={[
              { header: "ID", key: "id", className: "w-[100px]" },
              {
                header: "Fecha Solicitud Reserva",
                key: (item) => getDateISOString(item.fechaCreacion),
              },
              {
                header: "Hora Inicio",
                key: (item) => getTimeISOString(item.reserva.fechaHoraInicio),
              },
              {
                header: "Hora Fin",
                key: (item) => getTimeISOString(item.reserva.fechaHoraFin),
              },
              { header: "Laboratorio", key: (item) => item.laboratorio?.nombre ?? "" },
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
    </Tabs>
  );
}
