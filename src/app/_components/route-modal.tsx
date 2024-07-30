"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ModalProps = {
  title?: string;
  children: React.ReactNode;
  description?: string;
};

export default function RouteModal({ title, children, description }: ModalProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const closeModal = () => {
    setOpen(false);
    router.back();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && closeModal()}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter>
            <Button title="Cancelar" variant="default" color="outline" onClick={closeModal}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
