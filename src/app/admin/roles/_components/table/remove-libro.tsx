"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui";

import { toast } from "@/components/ui";
import { api } from "@/trpc/react";
import ModalDrawer from "@/app/_components/modal/modal-drawer";

type RemoveRolModalProps = {
  rolId: number;
  nombre?: string;
  onSubmit: () => void;
};

export default function RemoverRolModal({ rolId, nombre, onSubmit }: RemoveRolModalProps) {
  const eliminarRol = api.admin.roles.eliminarRol.useMutation({
    onSuccess: () => {
      toast.success(`El rol ${nombre} se eliminó con éxito.`);

      onSubmit?.();
    },

    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando el rol ${nombre}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleRemoveMachine = async (rolId: number) => {
    eliminarRol.mutate({ id: rolId });

    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button title="Eliminar rol" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
      }
      titulo={`Eliminar rol ${nombre ?? ""}`}
      cancelText="Cancelar"
      submitText="Si, eliminar"
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={() => handleRemoveMachine(rolId)}
      isAlertDialog
    >
      <div>
        Está seguro que desea eliminar <span className="font-bold">{nombre ?? "este rol"}</span>?
      </div>
    </ModalDrawer>
  );
}
