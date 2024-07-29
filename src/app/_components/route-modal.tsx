"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";
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
            <DialogContent>{children}</DialogContent>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
