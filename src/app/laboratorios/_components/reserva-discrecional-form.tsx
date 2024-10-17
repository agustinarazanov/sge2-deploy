"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LaboratorioCerradoForm } from "@/app/laboratorios/_components/reserva-form";
import { Button } from "@/components/ui";
import { CalendarIcon } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReservaDiscrecionalModal() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleClickSave = () => {
    router.refresh();
    setOpen(false);
  };

  const handleClickCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Reserva Discrecional de Laboratorio"}
      description={
        "Estas reservas de laboratorio no estan sujetas a ningún curso y/o materia. El único requisito es que al docente que se le asigne esta reservación debería de estar dado de alta en el SGE."
      }
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button type="button" color={"outline"} variant={"default"}>
          <CalendarIcon className="mr-2 h-4 w-4" /> Realizar Reserva Discrecional
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <LaboratorioCerradoForm onCancel={handleClickCancel} onSubmit={handleClickSave} />
      </div>
    </ModalDrawer>
  );
}
