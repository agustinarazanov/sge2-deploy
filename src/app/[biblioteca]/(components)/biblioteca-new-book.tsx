"use client";

import { Button } from "@/app/_components/button";
import useNuevoLibroModal from "@/app/_hooks/use-nuevo-libro-modal";
import { Plus } from "lucide-react";

type NuevoLibroModalProps = {
  onSubmit: () => void;
};

export const BibliotecaNewLibro = ({ onSubmit }: NuevoLibroModalProps) => {
  const nuevoLibroModal = useNuevoLibroModal({ onSubmit });

  return (
    <>
      {nuevoLibroModal.ref}
      <Button color={"primary"} onClick={() => nuevoLibroModal.open()}>
        Nuevo libro
        <Plus size={16} className="ml-2" />
      </Button>
    </>
  );
};
