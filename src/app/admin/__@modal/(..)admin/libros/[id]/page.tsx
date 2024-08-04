"use client";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LibroForm } from "@/app/biblioteca/libros/[id]/libro-form";
// import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PageProps = {
  params: { id: string };
};

export default function PageDetails({ params: { id } }: PageProps) {
  const [open, setOpen] = useState(true);

  // const utils = api.useUtils();

  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
      router.back();
    }
  };

  const handleClickSave = () => {
    // void utils.biblioteca.getAll.refetch();
    router.refresh();
  };

  const handleClickCancel = () => handleOpenChange(false);

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
        <LibroForm id={id} onCancel={handleClickCancel} onSubmit={handleClickSave} />
      </div>
    </ModalDrawer>
  );
}
