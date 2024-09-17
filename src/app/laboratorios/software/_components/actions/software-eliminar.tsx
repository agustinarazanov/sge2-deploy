import { useState } from "react";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui";

import { toast } from "@/components/ui";
import { api } from "@/trpc/react";
import ModalDrawer from "@/app/_components/modal/modal-drawer";

type RemoveSoftwareModalProps = {
  softwareId: number;
  nombre?: string;
  onSubmit: () => void;
};

export default function EliminarSoftwareModal({ softwareId, nombre, onSubmit }: RemoveSoftwareModalProps) {
  const eliminarSoftware = api.software.eliminarSoftware.useMutation({
    onSuccess: () => {
      toast.success(`La aplicación ${nombre} se eliminó con éxito.`);

      onSubmit?.();
    },

    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando la aplicación ${nombre}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleRemoveSoftware = async () => {
    eliminarSoftware.mutate({ id: softwareId });

    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button
          title="Eliminar aplicación"
          variant="icon"
          color="danger"
          className="h-8 w-8 px-2 py-2"
          icon={TrashIcon}
        />
      }
      titulo={`Eliminar aplicación ${nombre ?? ""}`}
      cancelText="Cancelar"
      submitText="Si, eliminar"
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={handleRemoveSoftware}
      isAlertDialog
    >
      <div>
        Está seguro que desea eliminar <span className="font-bold">{nombre ?? "esta aplicación"}</span>?
      </div>
    </ModalDrawer>
  );
}
