"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LaboratorioAbiertoForm } from "@/app/laboratorio_abierto/reservar/[tipo]/reserva-form";
import { type LaboratorioAbiertoType } from "@/app/laboratorio_abierto/reservar/_components/laboratorios";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PageProps = {
  params: { tipo: LaboratorioAbiertoType };
};

export default function PageDetails({ params: { tipo } }: PageProps) {
  const [open, setOpen] = useState(true);

  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      router.back();
    }
  };

  const handleClickSave = () => {
    router.refresh();
    setTimeout(() => router.back(), 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  const handleClickCancel = () => {
    router.refresh();
    setTimeout(() => router.back(), 100); // Hack para que primero recargue la pagina y luego haga el back, de otra forma el back cancela el refresh
  };

  return (
    <ModalDrawer
      titulo={"Reservar"}
      description={"Reservar laboratorio abierto"}
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<></>}
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <LaboratorioAbiertoForm tipo={tipo} onCancel={handleClickCancel} onSubmit={handleClickSave} />
      </div>
    </ModalDrawer>
  );
}
