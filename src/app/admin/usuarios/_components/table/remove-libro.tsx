"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui";

import { toast } from "@/components/ui";
import { api } from "@/trpc/react";
import ModalDrawer from "@/app/_components/modal/modal-drawer";

type RemoveRolModalProps = {
  usuarioId: string;
  email?: string;
  onSubmit: () => void;
};

export default function RemoverRolModal({ usuarioId, email, onSubmit }: RemoveRolModalProps) {
  const eliminarUsuario = api.admin.usuarios.eliminarUsuario.useMutation({
    onSuccess: () => {
      toast.success(`El usuario ${email} se eliminó con éxito.`);

      onSubmit?.();
    },

    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando el usuario ${email}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleRemoveUsuario = async (usuarioId: string) => {
    eliminarUsuario.mutate({ id: usuarioId });

    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button title="Eliminar usuario" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
      }
      titulo={`Eliminar usuario ${email ?? ""}`}
      cancelText="Cancelar"
      submitText="Si, eliminar"
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={() => handleRemoveUsuario(usuarioId)}
      isAlertDialog
    >
      <div>
        Está seguro que desea eliminar <span className="font-bold">{email ?? "este usuario"}</span>?
      </div>
    </ModalDrawer>
  );
}
