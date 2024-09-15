"use client";

import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import ModalDrawer from "@/app/_components/modal/modal-drawer";
import { AdminLaboratorioForm } from "../../[id]/admin-laboratorio-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AdminLaboratoriosNuevoLaboratorio = () => {
  const [open, setOpen] = useState(false);
  const [armarios, setArmarios] = useState([{ nombre: "Armario 01", estantes: ["Estante 01"] }]);

  const router = useRouter();

  const handleSave = () => {
    // Aquí deberías enviar los datos del laboratorio, incluyendo los armarios y estantes
    console.log("Guardando laboratorio con armarios:", armarios);
    router.refresh();
    setOpen(false);
  };

  const handleCancel = () => setOpen(false);

  const agregarArmario = () => {
    setArmarios([...armarios, { nombre: `Armario ${armarios.length + 1}`, estantes: ["Estante 01"] }]);
  };

  const agregarEstante = (armarioIndex: number) => {
    const nuevosArmarios = [...armarios];
    nuevosArmarios[armarioIndex]?.estantes.push(`Estante ${nuevosArmarios[armarioIndex].estantes.length + 1}`);
    setArmarios(nuevosArmarios);
  };

  const eliminarArmario = (index: number) => {
    setArmarios(armarios.filter((_, i) => i !== index));
  };

  const eliminarEstante = (armarioIndex: number, estanteIndex: number) => {
    const nuevosArmarios = [...armarios];
    nuevosArmarios[armarioIndex].estantes = nuevosArmarios[armarioIndex]?.estantes.filter((_, i) => i !== estanteIndex);
    setArmarios(nuevosArmarios);
  };

  const actualizarNombreArmario = (index: number, nuevoNombre: string) => {
    const nuevosArmarios = [...armarios];
    nuevosArmarios[index].nombre = nuevoNombre;
    setArmarios(nuevosArmarios);
  };

  const actualizarNombreEstante = (armarioIndex: number, estanteIndex: number, nuevoNombre: string) => {
    const nuevosArmarios = [...armarios];
    nuevosArmarios[armarioIndex].estantes[estanteIndex] = nuevoNombre;
    setArmarios(nuevosArmarios);
  };

  return (
    <ModalDrawer
      titulo={"Nuevo laboratorio"}
      description={"Creá un nuevo laboratorio"}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button color={"primary"}>
          Nuevo laboratorio
          <Plus size={16} className="ml-2" />
        </Button>
      }
      className={"max-h-[calc(100vh_-_10%)]"}
    >
      <div className="flex max-h-max w-full flex-col gap-4 overflow-y-auto">
        <AdminLaboratorioForm onCancel={handleCancel} onSubmit={handleSave} />

        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Armarios y Estantes</h3>
          {armarios.map((armario, armarioIndex) => (
            <div key={armarioIndex} className="mb-4 rounded border p-4">
              <div className="mb-2 flex items-center justify-between">
                <Input
                  value={armario.nombre}
                  onChange={(e) => actualizarNombreArmario(armarioIndex, e.target.value)}
                  className="mr-2 w-full"
                />
                <Button onClick={() => eliminarArmario(armarioIndex)} variant="destructive" size="icon">
                  <Minus size={16} />
                </Button>
              </div>
              {armario.estantes.map((estante, estanteIndex) => (
                <div key={estanteIndex} className="mb-2 flex items-center">
                  <Input
                    value={estante}
                    onChange={(e) => actualizarNombreEstante(armarioIndex, estanteIndex, e.target.value)}
                    className="mr-2 w-full"
                  />
                  <Button onClick={() => eliminarEstante(armarioIndex, estanteIndex)} variant="destructive" size="icon">
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
              <Button onClick={() => agregarEstante(armarioIndex)} variant="outline" size="sm" className="mt-2">
                Agregar Estante
              </Button>
            </div>
          ))}
          <Button onClick={agregarArmario} variant="outline" className="mt-2">
            Agregar Armario
          </Button>
        </div>
      </div>
    </ModalDrawer>
  );
};
