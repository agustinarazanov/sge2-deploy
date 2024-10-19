"use client";

import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { DivisionForm } from "../[id]/division-form";
import { useState } from "react";

interface EditDivisionProps {
  divisionId: string;
}

export const EditDivisionModal = ({ divisionId }: EditDivisionProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    router.refresh();
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  return (
    <ModalDrawer
      titulo={"Editar División"}
      description={"Modifica los detalles de la división"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button color={"primary"} className="flex h-8 w-8 items-center gap-2 px-2 py-2">
          <EditIcon size={16} />
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col gap-4">
        <DivisionForm id={divisionId} onCancel={handleCancel} onSubmit={handleSave} />
      </div>
    </ModalDrawer>
  );
};
export default EditDivisionModal;
