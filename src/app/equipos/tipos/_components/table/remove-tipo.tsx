"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { toast } from "@/components/ui";
import { api } from "@/trpc/react";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { removeFile } from "@/shared/upload-file";

type RemoveTipoModalProps = {
  tipoId: number;
  nombre?: string;
  imagen?: string;
  onSubmit: () => void;
};

export default function RemoverTipoModal({ tipoId, nombre, imagen, onSubmit }: RemoveTipoModalProps) {
  const eliminarTipo = api.equipos.eliminarTipo.useMutation({
    onSuccess: () => {
      toast.success(`El tipo ${nombre} se eliminó con éxito.`);

      onSubmit?.();
    },
    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando el tipo ${nombre}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleRemoveTipo = async (tipoId: number, imagen?: string) => {
    if (imagen) {
      try {
        await removeFile(imagen);
      } catch (error) {
        toast.error("Error al eliminar la imagen");
        return;
      }
    }

    eliminarTipo.mutate({ id: tipoId });

    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button title="Eliminar tipo" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
      }
      titulo={`Eliminar tipo ${nombre ?? ""}`}
      cancelText="Cancelar"
      submitText="Si, eliminar"
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={() => handleRemoveTipo(tipoId, imagen)}
      isAlertDialog
    >
      <div>
        Está seguro que desea eliminar <span className="font-bold">{nombre ?? "este tipo"}</span>?
      </div>
    </ModalDrawer>
  );
}
