"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { type ModalDrawerProps } from "./modal-drawer";

export const AlertDialogModalDrawer = ({
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className={className}>
        <AlertDialogTitle>{titulo}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        {children}
        <AlertDialogFooter>
          {onCancel && <AlertDialogCancel onClick={onCancel}>{cancelText ?? "Cancelar"}</AlertDialogCancel>}
          {onSubmit && <AlertDialogAction onClick={onSubmit}>{submitText ?? "Aceptar"}</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
