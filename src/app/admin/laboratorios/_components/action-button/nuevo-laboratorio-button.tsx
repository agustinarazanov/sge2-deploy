"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { AdminLaboratorioForm } from "../../[id]/admin-laboratorio-form";
import { useState } from "react";

export const AdminLaboratoriosNuevoLaboratorio = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    router.refresh();
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Nuevo laboratorio"}
      description={"Creá un nuevo laboratorio"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button color={"primary"}>
          Nuevo laboratorio
          <Plus size={16} className="ml-2" />
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-full w-full flex-col">
        <AdminLaboratorioForm onCancel={handleCancel} onSubmit={handleSave} />
      </div>
    </ModalDrawer>
  );
};
