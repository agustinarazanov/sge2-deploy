"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui";
import { type ModalDrawerProps } from "./modal-drawer";

export const DrawerModalDrawer = ({
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={className}>
        <DrawerHeader>
          <DrawerTitle>{titulo}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex px-4">{children}</div>
        <DrawerFooter>
          {onCancel && (
            <DrawerClose asChild>
              <Button variant={"default"} color={"ghost"} onClick={onCancel}>
                {cancelText ?? "Cancelar"}
              </Button>
            </DrawerClose>
          )}
          {onSubmit && (
            <Button variant={"default"} color={"danger"} onClick={onSubmit}>
              {submitText ?? "Aceptar"}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
