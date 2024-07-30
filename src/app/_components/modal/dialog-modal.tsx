"use client";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui";
import { type ModalDrawerProps } from "./modal-drawer";

export const DialogModalDrawer = ({
  open,
  titulo,
  description,
  cancelText,
  submitText,
  trigger,
  onSubmit,
  onCancel,
  children,
  onOpenChange,
  className,
}: ModalDrawerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          {onCancel && (
            <DialogClose asChild>
              <Button variant={"default"} color={"ghost"} onClick={onCancel}>
                {cancelText ?? "Cancelar"}
              </Button>
            </DialogClose>
          )}
          {onsubmit && (
            <Button variant={"default"} color={"danger"} onClick={onSubmit}>
              {submitText ?? "Aceptar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
