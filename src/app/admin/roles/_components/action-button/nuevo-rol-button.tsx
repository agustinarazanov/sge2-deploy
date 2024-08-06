"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { useState } from "react";
import { AdminRolForm } from "../../[id]/admin-rol-form";

export const AdminRolesNuevoRol = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleSave = () => {
    router.refresh();
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Nuevo rol"}
      description={"Creá un nuevo rol"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button color={"primary"}>
          Nuevo rol
          <Plus size={16} className="ml-2" />
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <AdminRolForm onCancel={handleCancel} onSubmit={handleSave} />
      </div>
    </ModalDrawer>
  );
};
