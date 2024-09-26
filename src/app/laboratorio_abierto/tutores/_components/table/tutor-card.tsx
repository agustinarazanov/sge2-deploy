"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type TutorType } from "./constants"; // Asegúrate de que este tipo esté definido correctamente
import { cn } from "@/components/utils"; // Asegúrate de que esta función exista y esté correcta
import Image from "next/image";
import RemoveTutorModal from "../action-buttons/remove-tutor";
import { EditTutorModal } from "../action-buttons/edit-tutor"; // Asegúrate de que este componente sea exportado correctamente
import { FaEdit } from "react-icons/fa"; // Ícono de lápiz desde react-icons

type CardProps = React.ComponentProps<typeof Card>;

type TutorData = {
  tutor: TutorType; // Asegúrate de que TutorType tenga la estructura adecuada
};

export function TutorCard({ className, ...props }: CardProps & TutorData) {
  const { tutor } = props;
  const { nombre, apellido, email, image } = tutor.usuario; // Asumiendo que 'usuario' tiene estas propiedades

  // Estado para controlar el modal de edición
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Función para manejar la apertura del modal
  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  // Función para manejar el cierre del modal
  const handleModalClose = () => {
    setEditModalOpen(false);
  };

  return (
    <Card
      className={cn(
        "flex flex-col justify-between text-center hover:border-primary/50 hover:bg-[#75757533]/[.2]",
        className,
      )}
      {...props}
    >
      <CardHeader>
        <div className="w-full">
          <Image
            src={image ?? ""} // Manejo de imágenes null
            alt="Imagen de tutor"
            className="rounded-lg"
            blurDataURL="" // Considera agregar un URL de imagen difusa si lo deseas
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={500}
            height={300}
          />
        </div>
        <CardTitle className="py-4">
          {nombre} {apellido}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-left">
          <CardDescription>
            <span className="font-bold">Nombre:</span> {nombre} {apellido}
          </CardDescription>
          <CardDescription>
            <span className="font-bold">Días y horarios:</span> {tutor.diasHorarios}
          </CardDescription>
          <CardDescription>
            <span className="font-bold">Sede:</span> {tutor.sede}
          </CardDescription>
          <CardDescription>
            <span className="font-bold">Especialidad:</span> {tutor.especialidad}
          </CardDescription>
        </div>
        <div className="mt-4 flex justify-between">
          {/* Botón solo con el ícono de lápiz */}
          <button
            onClick={handleEditClick} // Maneja el clic en el botón de editar
            className="flex items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
            title="Editar"
          >
            <FaEdit /> {/* Ícono de lápiz */}
          </button>
          <RemoveTutorModal
            tutorId={tutor.usuario.id} // ID del tutor para eliminar
            nombre={`${nombre} ${apellido}`} // Nombre completo para mostrar
            onSubmit={() => console.log("Tutor eliminado")} // Callback para eliminar
          />
        </div>
      </CardContent>

      {/* Modal de edición */}
      <EditTutorModal
        isOpen={isEditModalOpen} // Controla si el modal está abierto
        onClose={handleModalClose} // Función para cerrar el modal
        id={tutor.usuario.id} // Asumiendo que el ID del tutor se obtiene así
        onSubmit={() => {}} // Manejo del envío del formulario
        onEditSuccess={() => {
          console.log("Tutor editado");
          handleModalClose(); // Cierra el modal después de editar
        }} // Callback para éxito
        tutor={tutor} // Pasa el objeto tutor al modal de edición
      />
    </Card>
  );
}
