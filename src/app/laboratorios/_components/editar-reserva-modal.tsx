"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { Button } from "@/components/ui";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LaboratorioCerradoForm } from "./reserva-form";

type PageProps = {
  params: { id: number; cursoId: string };
};

export default function EditarReservaModal({ params: { id, cursoId } }: PageProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClickCancel = () => {
    setOpen(false);
    setTimeout(() => router.refresh(), 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  const handleClickSave = () => {
    setOpen(false);
    setTimeout(() => router.refresh(), 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  return (
    <ModalDrawer
      titulo="Editar reserva"
      description="Si modifica la reserva, volverá al estado pendiente de aprobación"
      trigger={<Button title="Editar reserva" variant="icon" color="ghost" icon={EditIcon} />}
      open={open}
      onOpenChange={setOpen}
      className="max-h-[calc(100vh_-_10%)]"
    >
      <div className="flex max-h-max w-full flex-col gap-4">
        <LaboratorioCerradoForm
          reservaId={id}
          cursoId={cursoId}
          onCancel={handleClickCancel}
          onSubmit={handleClickSave}
        />
      </div>
    </ModalDrawer>
  );
}
