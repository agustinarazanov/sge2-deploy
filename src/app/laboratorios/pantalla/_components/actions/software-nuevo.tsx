"use client";

import { Button } from "@/components/ui/button";
import { ScreenShareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import React, { useState } from "react";
import { AgregarCursoPantallaForm } from "../curso-pantalla-nuevo";

export const AgregarAPantallaModal = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleSave = () => {
    router.refresh();
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Agregar a pantalla - En construcción 👷🏻👷🏻‍♂️👷🏻‍♂️👷🏻‍♂️👷🏻‍♂️"}
      description={"Agregar curso a pantalla"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button type="button" color={"primary"} variant={"default"}>
          <ScreenShareIcon className="mr-2 h-4 w-4" /> Agregar a pantalla - En construcción 👷🏻👷🏻‍♂️👷🏻‍♂️👷🏻‍♂️👷🏻‍♂️
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col  gap-4">
        <AgregarCursoPantallaForm onCancel={handleCancel} onSubmit={handleSave} />
      </div>
    </ModalDrawer>
  );
};
