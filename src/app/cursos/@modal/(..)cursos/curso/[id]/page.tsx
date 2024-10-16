"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { CursoForm } from "@/app/cursos/curso/[id]/curso-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PageProps = {
  params: { id: string };
};

export default function PageDetails({ params: { id } }: PageProps) {
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

  const handleClickCancel = () => handleOpenChange(false);

  return (
    <ModalDrawer
      titulo={"Detalle"}
      description={"Esta es la página de detalles del curso."}
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<></>}
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <CursoForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
      </div>
    </ModalDrawer>
  );
}
