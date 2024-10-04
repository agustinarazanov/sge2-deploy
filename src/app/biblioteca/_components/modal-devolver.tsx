"use client";

import { useState } from "react";

import { Button, toast } from "@/components/ui";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Handshake } from "lucide-react";

type DevolverLibroModalProps = {
  libroId: number;
};

export default function DevolverLibroModal({ libroId }: DevolverLibroModalProps) {
  const router = useRouter();
  const devolverLibro = api.reservas.reservaBiblioteca.devolverLibro.useMutation();

  const [open, setOpen] = useState(false);

  const handleCancel = () => setOpen(false);

  const handleDevolverLibro = async () => {
    devolverLibro.mutate(
      { libroId },
      {
        onSuccess: () => {
          toast.success("Libro devuelto con éxito.");
          router.refresh();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al devolver el libro");
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
      titulo={`Devolver libro`}
      open={open}
      onOpenChange={setOpen}
      onCancel={handleCancel}
      onSubmit={handleDevolverLibro}
      isAlertDialog
      cancelText="Cancelar"
      submitText="Si, devolver"
    >
      <div>Está seguro que desea devolver el libro?</div>
    </ModalDrawer>
  );
}
