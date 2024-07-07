"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui";

import { toast } from "@/components/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/trpc/react";

type RemoveLibroModalProps = {
  libroId: number;
  nombre?: string;
  onSubmit: () => void;
};

export default function RemoveLibroModal({ libroId, nombre, onSubmit }: RemoveLibroModalProps) {
  const eliminarLibro = api.biblioteca.eliminarLibro.useMutation({
    onSuccess: () => {
      toast.success(`El libro ${nombre} se eliminó con éxito.`);

      onSubmit?.();
    },

    onError: (error) => {
      toast.error(error?.message ?? `Error eliminando el libro ${nombre}`);
    },
  });

  const [open, setOpen] = useState(false);

  const handleRemoveMachine = async (libroId: number) => {
    eliminarLibro.mutate({ libroId });

    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button title="Eliminar libro" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Eliminar libro</AlertDialogTitle>
        <AlertDialogDescription>
          Está seguro que desea eliminar <span className="font-bold">{nombre ?? "este libro"}</span>?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleRemoveMachine(libroId)}>Si, eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
