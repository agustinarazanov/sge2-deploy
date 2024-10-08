"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { LibroInformacionBasica } from "../libros/_components/info-basica-libro";
import { Separator } from "@radix-ui/react-separator";
import { LibroFormPrestarORenovar } from "./form-prestar";
import { HandHelping } from "lucide-react";
import { api } from "@/trpc/react";

type PrestarLibroModalProps = {
  libroId: number;
};

export default function PrestarLibroModal({ libroId }: PrestarLibroModalProps) {
  const [open, setOpen] = useState(false);

  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId });

  const handleSubmit = () => setOpen(false);
  const handleCancel = () => setOpen(false);

  if (isError) {
    return <div>Error al cargar información del libro...</div>;
  }

  return (
    <ModalDrawer
      trigger={
        <Button
          title="Prestar"
          variant="default"
          color="primary"
          size="sm"
          className="mt-2 w-full rounded-full border-none"
        >
          Prestar
          <HandHelping size={16} className="ml-2" />
        </Button>
      }
      titulo={`Prestar libro`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-col">
        <LibroInformacionBasica libroId={libroId} />

        <Separator className="my-8 border-2" />

        {!isLoading && libro && (
          <LibroFormPrestarORenovar
            libroId={libroId}
            libroNombre={libro.titulo}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </ModalDrawer>
  );
}
