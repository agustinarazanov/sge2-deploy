"use client";

import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { MateriaForm } from "../[id]/materia-form";
import { useState } from "react";

interface EditMateriaProps {
  materiaId: string;
}

export const EditMateriaModal = ({ materiaId }: EditMateriaProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    router.refresh();
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Editar Materia"}
      description={"Modifica los detalles de la materia"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button color={"primary"} className="flex items-center gap-2">
          <EditIcon size={16} /> {/* Icono de edición */}
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col gap-4">
        <MateriaForm id={materiaId} onCancel={handleCancel} onSubmit={handleSave} /> {/* Formulario de materia */}
      </div>
    </ModalDrawer>
  );
};

export default EditMateriaModal;
