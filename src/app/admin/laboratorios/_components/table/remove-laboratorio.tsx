"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui";

import { toast } from "@/components/ui";
import { api } from "@/trpc/react";
import ModalDrawer from "@/app/_components/modal/modal-drawer";

type RemoveLaboratorioModalProps = {
  laboratorioId: number;
  nombre?: string;
  onSubmit: () => void;
};

export default function RemoverLaboratorioModal({ laboratorioId, nombre, onSubmit }: RemoveLaboratorioModalProps) {
  const eliminarLaboratorio = api.admin.laboratorios.eliminarLaboratorio.useMutation({
    onSuccess: () => {
      toast.success(`El laboratorio ${nombre} se eliminó con éxito.`);

      onSubmit?.();
    },

    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando el laboratorio ${nombre}`);
    },
  });

  const [open, setOpen] = useState(false);

  const hanldeRemoveLaboratorio = async (laboratorioId: number) => {
    eliminarLaboratorio.mutate({ id: laboratorioId });

    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button
          title="Eliminar laboratorio"
          variant="icon"
          color="danger"
          className="h-8 w-8 px-2 py-2"
          icon={TrashIcon}
        />
      }
      titulo={`Eliminar laboratorio ${nombre ?? ""}`}
      cancelText="Cancelar"
      submitText="Si, eliminar"
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={() => hanldeRemoveLaboratorio(laboratorioId)}
      isAlertDialog
    >
      <div>
        Está seguro que desea eliminar <span className="font-bold">{nombre ?? "este laboratorio"}</span>?
      </div>
    </ModalDrawer>
  );
}
