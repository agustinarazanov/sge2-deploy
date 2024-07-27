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
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState(false);

  const handleRemoveMachine = async (libroId: number) => {
    eliminarLibro.mutate({ libroId });

    setOpen(false);
  };

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button title="Eliminar libro" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Eliminar libro {nombre ?? ""}</AlertDialogTitle>
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button title="Eliminar libro" variant="icon" color="danger" className="h-8 w-8 px-2 py-2" icon={TrashIcon} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Eliminar libro {nombre ?? ""}</DrawerTitle>
          <DrawerDescription>
            Está seguro que desea eliminar <span className="font-bold">{nombre ?? "este libro"}</span>?
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant={"default"} color={"ghost"}>
              Cancelar
            </Button>
          </DrawerClose>
          <Button variant={"default"} color={"danger"} onClick={() => handleRemoveMachine(libroId)}>
            Si, eliminar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
