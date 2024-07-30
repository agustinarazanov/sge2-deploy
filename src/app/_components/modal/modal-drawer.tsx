"use client";

import { useMediaQuery } from "usehooks-ts";
import { AlertDialogModalDrawer } from "./alert-dialog-modal";
import { DialogModalDrawer } from "./dialog-modal";
import { DrawerModalDrawer } from "./drawer-modal";

export type ModalDrawerProps = {
  isAlertDialog?: boolean; // Si es true, vista de escritorio llama la atención del usuario
  cantBeDrawer?: boolean; // Si es true, nunca se va a mostrar el drawer en mobile
  titulo: string;
  description?: string;
  children?: React.ReactNode; // Es el contenido del modal
  open: boolean; // Estado por defecto a mostrar
  cancelText?: string; // Texto del botón cancelar
  submitText?: string; // Texto del botón aceptar
  trigger?: React.ReactNode; // Elemento que activa el modal (no necesita un `onClick`)
  onSubmit?: () => void; // Función que se ejecuta al aceptar
  onCancel?: () => void; // Función que se ejecuta al cancelar
  onOpenChange?: (open: boolean) => void; // Función que se ejecuta al cambiar el estado del modal (lo dispara automaticamente el modal cuando el usuario lo abre)
  className?: string;
};

export default function ModalDrawer(props: ModalDrawerProps) {
  const { isAlertDialog, cantBeDrawer } = props;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop || cantBeDrawer) {
    const Comp = isAlertDialog ? AlertDialogModalDrawer : DialogModalDrawer;

    return <Comp {...props} />;
  }

  return <DrawerModalDrawer {...props} />;
}
