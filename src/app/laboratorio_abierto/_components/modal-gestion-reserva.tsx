"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LaboratorioAbiertoReservaInformacionBasica } from "./info-basica-reserva";
import { Separator } from "@radix-ui/react-separator";
import { LaboratorioAbiertoAprobarORechazar } from "./form-gestion-reserva";

type AprobarSolicitudLaboratorioAbiertoModalProps = {
  reservaID: number;
};

export default function AprobarSolicitudLaboratorioAbiertoModal({
  reservaID,
}: AprobarSolicitudLaboratorioAbiertoModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => setOpen(false);

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button
          title="Aprobar"
          variant="default"
          color="secondary"
          size="sm"
          className="mt-2 w-full rounded-full border-none"
        >
          Renovar
        </Button>
      }
      titulo={`Renovar libro`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-col">
        <LaboratorioAbiertoReservaInformacionBasica reservaID={reservaID} />

        <Separator className="my-8 border-2" />

        <LaboratorioAbiertoAprobarORechazar reservaID={reservaID} onCancel={handleCancel} onSubmit={handleSubmit} />
      </div>
    </ModalDrawer>
  );
}
