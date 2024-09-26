"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { EquipoView } from "@/app/equipos/equipo/ver/[id]/equipo-view";
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

  const handleClickCancel = () => handleOpenChange(false);

  return (
    <ModalDrawer
      titulo={"Detalles del equipo"}
      description={"Esta es la página de detalles del equipo."}
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<></>}
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col gap-4">
        <EquipoView id={id} onCancel={handleClickCancel} />
      </div>
    </ModalDrawer>
  );
}
