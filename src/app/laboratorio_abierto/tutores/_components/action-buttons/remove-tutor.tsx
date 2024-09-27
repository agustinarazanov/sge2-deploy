"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

import { toast } from "@/components/ui";
import { api } from "@/trpc/react";
import ModalDrawer from "@/app/_components/modal/modal-drawer";

type RemoveTutorModalProps = {
  tutorId: string;
  nombre?: string;
  onSubmit: () => void;
};

export default function RemoveTutorModal({ tutorId, nombre, onSubmit }: RemoveTutorModalProps) {
  const router = useRouter();
  const eliminarTutor = api.admin.usuarios.eliminarTutor.useMutation({
    onSuccess: () => {
      toast.success(`El tutor ${nombre} se eliminó con éxito.`);

      onSubmit?.();
      router.refresh();
    },

    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando el tutor ${nombre}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleRemoveMachine = async (tutorId: string) => {
    eliminarTutor.mutate({ id: tutorId });

    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button title="Eliminar tutor" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
      }
      titulo={`Eliminar tutor ${nombre ?? ""}`}
      cancelText="Cancelar"
      submitText="Si, eliminar"
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={() => handleRemoveMachine(tutorId)}
      isAlertDialog
    >
      <div>
        Está seguro que desea eliminar <span className="font-bold">{nombre ?? "este tutor"}</span>?
      </div>
    </ModalDrawer>
  );
}
