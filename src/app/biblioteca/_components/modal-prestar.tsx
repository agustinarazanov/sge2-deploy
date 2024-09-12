"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LibroInformacionBasica } from "../libros/_components/info-basica-libro";
import { Separator } from "@radix-ui/react-separator";
import { LibroFormPrestar } from "./form-prestar";

type PrestarLibroModalProps = {
  libroId: number;
};

export default function PrestarLibroModal({ libroId }: PrestarLibroModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => setOpen(false);

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      trigger={
        <Button
          title="Prestar"
          variant="default"
          color="outline"
          size="sm"
          className="mt-2 w-full rounded-full border-none"
        >
          Prestar
        </Button>
      }
      titulo={`Prestar libro`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-col">
        <LibroInformacionBasica libroId={libroId} />

        <Separator className="my-8 border-2" />

        <LibroFormPrestar libroId={libroId} onCancel={handleCancel} onSubmit={handleSubmit} />
      </div>
    </ModalDrawer>
  );
}
