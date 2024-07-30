"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LibroForm } from "@/app/biblioteca/[id]/libro-form";
import { LibroFormButtons } from "@/app/biblioteca/[id]/libro-form-buttons";
import PageLibroDetails from "@/app/biblioteca/[id]/page";
import { ScrollArea } from "@/components/ui";
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
    router.back();
  };

  const handleClickCancel = () => {
    handleOpenChange(false);
  };

  return (
    <ModalDrawer
      titulo={"Detalle"}
      description={"Esta es la página de detalles del libro."}
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<></>}
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_30%)] w-full overflow-auto px-2">
          <LibroForm id={id} />
        </ScrollArea>

        <LibroFormButtons handleClickCancel={handleClickCancel} handleClickSave={handleClickSave} />
      </div>
    </ModalDrawer>
  );
}
