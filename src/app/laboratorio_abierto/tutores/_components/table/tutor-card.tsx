"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type TutorType } from "./constants";
import { cn } from "@/components/utils";
import Image from "next/image";
import RemoveTutorModal from "../action-buttons/remove-tutor";
import { EditTutorModal } from "../action-buttons/edit-tutor";
import { EditIcon } from "lucide-react";

type CardProps = React.ComponentProps<typeof Card>;

type TutorData = {
  tutor: TutorType;
};

export function TutorCard({ className, ...props }: CardProps & TutorData) {
  const { tutor } = props;
  const { nombre, apellido, image } = tutor.usuario;

  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

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
            src={image ?? ""}
            alt="Imagen de tutor"
            className="rounded-lg"
            blurDataURL=""
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
            <span className="font-bold">Email:</span> {tutor.usuario.email}
          </CardDescription>
          <CardDescription>
            <span className="font-bold">Días y horarios:</span> {tutor.diasHorarios}
          </CardDescription>
          <CardDescription>
            <span className="font-bold">Especialidad:</span> {tutor.especialidad}
          </CardDescription>
        </div>
        <div className="mt-4 flex justify-between">
          {}
          <button
            onClick={handleEditClick}
            className="flex items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
            title="Editar"
          >
            <EditIcon /> {}
          </button>
          <RemoveTutorModal
            tutorId={tutor.usuario.id}
            nombre={`${nombre} ${apellido}`}
            onSubmit={() => console.log("Tutor eliminado")}
          />
        </div>
      </CardContent>

      {}
      <EditTutorModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        id={tutor.usuario.id}
        onSubmit={() => {
          console.log("Tutor editado");
        }}
        onEditSuccess={() => {
          console.log("Tutor editado");
          handleModalClose();
        }}
        tutor={tutor}
      />
    </Card>
  );
}
