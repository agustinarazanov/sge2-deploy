"use client";

import { Button } from "@/components/ui/button";
import useNuevoLibroModal from "@/app/_hooks/use-nuevo-libro-modal";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const BibliotecaNewLibro = () => {
  const router = useRouter();

  const handleCambioEnBiblioteca = () => router.refresh();

  const nuevoLibroModal = useNuevoLibroModal({ onSubmit: handleCambioEnBiblioteca });

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
