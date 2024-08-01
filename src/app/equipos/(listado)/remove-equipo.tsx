"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui";

import { toast } from "@/components/ui";
import { api } from "@/trpc/react";
import ModalDrawer from "@/app/_components/modal/modal-drawer";

type RemoveEquipoModalProps = {
  equipoId: number;
  nombre?: string;
  onSubmit: () => void;
};

export default function RemoveEquipoModal({ equipoId, nombre, onSubmit }: RemoveEquipoModalProps) {
  const eliminarEquipo = api.equipos.eliminarEquipo.useMutation({
    onSuccess: () => {
      toast.success(`El equipo ${nombre} se eliminó con éxito.`);

      onSubmit?.();
    },

    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando el equipo ${nombre}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleRemoveMachine = async (equipoId: number) => {
    eliminarEquipo.mutate({ id: equipoId });

    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button title="Eliminar equipo" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
      }
      titulo={`Eliminar equipo ${nombre ?? ""}`}
      cancelText="Cancelar"
      submitText="Si, eliminar"
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={() => handleRemoveMachine(equipoId)}
      isAlertDialog
    >
      <div>
        Está seguro que desea eliminar <span className="font-bold">{nombre ?? "este equipo"}</span>?
      </div>
    </ModalDrawer>
  );
}
