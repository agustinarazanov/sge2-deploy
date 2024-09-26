import { Dialog } from "@headlessui/react"; // Asegúrate de tener Headless UI instalado
import { Button } from "@/components/ui"; // Asegúrate de tener el botón importado
import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { ScrollArea, FormInput, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditarTutor } from "@/shared/filters/admin-usuarios-filter.schema"; // Ajusta con tu schema de validación para tutor
import { type z } from "zod";
import { useEffect, useMemo } from "react";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";
import { useRouter } from "next/navigation"; // Importa useRouter

type Props = {
  isOpen: boolean; // Estado para controlar la apertura del modal
  onClose: () => void; // Función para cerrar el modal
  id: string; // id es obligatorio para editar
  onSubmit: () => void; // Función a ejecutar al enviar el formulario
  onEditSuccess?: () => void; // Agrega la propiedad opcional onEditSuccess
  tutor: any; // Cambia "any" por el tipo específico si lo tienes
};

type FormHelperType = {
  diasHorarios: { dia: string; horario: string }[]; // Estructura para días y horarios
};

type FormEditarTutorType = z.infer<typeof inputEditarTutor> & FormHelperType;

export const EditTutorModal = ({ isOpen, onClose, id, onSubmit, tutor }: Props) => {
  const tutorId = parseInt(id);
  const router = useRouter(); // Usa useRouter

  // Se supone que el tutor ya está pasado como prop y no necesitas volver a cargarlo
  const editarTutor = api.admin.usuarios.editarTutor.useMutation(); // Solo edición

  const tutorBase: FormEditarTutorType = useMemo(() => {
    if (!tutor) return {} as FormEditarTutorType;
    return {
      id: tutor.usuario.id,
      nombre: tutor.usuario.nombre,
      especialidad: tutor.usuario.especialidad ?? "", // Añadido campo especialidad
      sede: tutor.usuario.sede,
      diasHorarios: tutor.usuario.diasHorarios || [], // Añadido campo días y horarios
    };
  }, [tutor]);

  const formHook = useForm<FormEditarTutorType>({
    mode: "onChange",
    defaultValues: tutorBase,
    resolver: zodResolver(inputEditarTutor),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => {
    if (tutorBase) {
      formHook.reset(tutorBase);
    }
  }, [formHook, tutorBase]);

  const onFormSubmit = (formData: FormEditarTutorType) => {
    editarTutor.mutate(formData, {
      onSuccess: () => {
        toast.success("Tutor actualizado con éxito.");
        router.refresh(); // Refresca la página o los datos
        onClose(); // Cierra el modal después de enviar el formulario
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el tutor");
      },
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6">
          <button onClick={onClose} className="absolute right-2 top-2 text-gray-500">
            &times;
          </button>
          <FormProvider {...formHook}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
              <ScrollArea className="max-h-[calc(100vh_-_30%)] w-full pr-4">
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="flex flex-col space-y-4 px-0 md:px-6">
                    <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                      <div className="mt-4 w-full">
                        <FormInput label={"Nombre"} control={control} name="nombre" type={"text"} className="mt-2" />
                      </div>
                    </div>

                    <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                      <div className="mt-4 w-full">
                        <FormInput
                          label={"Especialidad"}
                          control={control}
                          name="especialidad"
                          type={"text"}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Campo para los días y horarios */}
                    <div className="flex w-full flex-col lg:flex-col lg:justify-between lg:gap-x-4">
                      <div className="mt-4 w-full">
                        <FormInput
                          label={"Días y Horarios"}
                          control={control}
                          name="diasHorarios"
                          type={"text"} // Ajusta este campo según sea necesario
                          className="mt-2"
                          placeholder="Ej: Lunes 10:00-12:00, Miércoles 14:00-16:00"
                        />
                      </div>
                    </div>

                    <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                      <div className="mt-4 basis-1/2">
                        <SelectSedeForm
                          name="sede"
                          control={control}
                          className="mt-2"
                          label={"Sede"}
                          placeholder={"Selecciona una sede"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="flex w-full flex-row items-end justify-end space-x-4">
                <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={onClose}>
                  Cancelar
                </Button>
                <Button title="Guardar" type="submit" variant="default" color="primary">
                  Guardar
                </Button>
              </div>
            </form>
          </FormProvider>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
