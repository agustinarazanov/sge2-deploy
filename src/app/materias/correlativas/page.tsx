"use client";
import { api } from "@/trpc/react";
import { Autocomplete, Button } from "@/components/ui";
import { useState, useMemo } from "react";
import { MateriaDropdownMultipleForm } from "@/app/_components/form/materias-dropdown-multiple"; // Ajusta el path de importación
import { useForm, FormProvider } from "react-hook-form";

export default function Page() {
  const [materia, setMateria] = useState<{ id: number; label: string } | null>(null);
  const { data: materiasData, isLoading: isLoadingMaterias } = api.materia.getAll.useQuery();

  const methods = useForm({
    defaultValues: {
      regularizadas: [],
      aprobadasParaCursar: [],
      aprobadasParaRendir: [],
    },
  });

  // Transformar las materias para usarlas en el Autocomplete
  const materias = useMemo(() => {
    return materiasData?.map((item) => ({ id: item.id, label: item.nombre })) ?? [];
  }, [materiasData]);

  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Correlativas</h3>

      <p className="mt-4 text-center text-lg">
        Para editar las correlativas de una materia, realice la operación como si la estuviese agregando, el sistema se
        encarga de detectar si tiene que agregar o editar correlativas.
      </p>

      <div className="mt-6">
        <label htmlFor="materia" className="block text-lg font-medium text-gray-700">
          Seleccionar Materia:
        </label>

        {/* Autocomplete para seleccionar la materia */}
        <Autocomplete
          items={materias}
          isLoading={isLoadingMaterias}
          value={materia}
          onChange={setMateria}
          noOptionsComponent={
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500">
              <span>No se encontró la materia</span>
            </div>
          }
        />
      </div>

      {/* Formularios para correlativas */}
      <FormProvider {...methods}>
        <form className="mt-6">
          {/* Para Cursar - Tener Regularizadas */}
          <div className="mt-6">
            <label htmlFor="regularizadas" className="block text-lg font-medium text-gray-700">
              Para Cursar - Tener Regularizadas:
            </label>
            <MateriaDropdownMultipleForm name="regularizadas" control={methods.control} />
          </div>

          {/* Para Cursar - Tener Aprobadas */}
          <div className="mt-6">
            <label htmlFor="aprobadasParaCursar" className="block text-lg font-medium text-gray-700">
              Para Cursar - Tener Aprobadas:
            </label>
            <MateriaDropdownMultipleForm name="aprobadasParaCursar" control={methods.control} />
          </div>

          {/* Para Rendir - Tener Aprobadas */}
          <div className="mt-6">
            <label htmlFor="aprobadasParaRendir" className="block text-lg font-medium text-gray-700">
              Para Rendir - Tener Aprobadas:
            </label>
            <MateriaDropdownMultipleForm name="aprobadasParaRendir" control={methods.control} />
          </div>
          {/* Botón Setear Correlativas */}
          <div className="mt-8">
            <Button title="Setear Correlativas" type="submit" variant="default" color="primary">
              Setear Correlativas
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
