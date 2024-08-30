"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LibroForm } from "../libros/[id]/libro-form";
import { useState } from "react";

export const BibliotecaNewLibro = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleSave = () => {
    // void utils.biblioteca.getAll.refetch();
    router.refresh();
    setOpen(false);
    // router.push("/biblioteca"); // ENVIAR AL USUARIO A LA PAGINA DE DETALLE DEL LIBRO NUEVO
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Nuevo libro"}
      description={"Creá un nuevo libro"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button color={"primary"}>
          Nuevo libro
          <Plus size={16} className="ml-2" />
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)] text-white"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <LibroForm onCancel={handleCancel} onSubmit={handleSave} />
      </div>
    </ModalDrawer>
  );
};
