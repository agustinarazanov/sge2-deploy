"use client";

import { useState } from "react";

import { Button, toast } from "@/components/ui";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Handshake } from "lucide-react";

type DevolverEquipoModalProps = {
  equipoId: number;
};

export default function DevolverEquipoModal({ equipoId }: DevolverEquipoModalProps) {
  const router = useRouter();
  const devolverEquipo = api.reservas.reservaEquipo.devolverEquipo.useMutation();

  const [open, setOpen] = useState(false);

  const handleCancel = () => setOpen(false);

  const handleDevolverEquipo = async () => {
    devolverEquipo.mutate(
      { equipoId },
      {
        onSuccess: () => {
          toast.success("Equipo devuelto con éxito.");
          router.refresh();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al devolver el equipo");
        },
      },
    );
  };

  return (
    <ModalDrawer
      trigger={
        <Button
          title="Devolver"
          variant="default"
          color="primary"
          size="sm"
          className="mt-2 w-full rounded-full border-none"
        >
          Devolver
          <Handshake size={16} className="ml-2" />
        </Button>
      }
      titulo={`Devolver equipo`}
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={handleDevolverEquipo}
      isAlertDialog
      cancelText="Cancelar"
      submitText="Si, devolver"
    >
      <div>Está seguro que desea devolver el equipo?</div>
    </ModalDrawer>
  );
}
