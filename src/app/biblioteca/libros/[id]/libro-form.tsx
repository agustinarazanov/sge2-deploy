import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditBooks } from "@/shared/filters/biblioteca-filter.schema";
import { type z } from "zod";
import { useEffect, useMemo } from "react";
import { MateriaDropdownMultipleForm } from "@/app/_components/form/materias-dropdown-multiple";
import { SelectEditorialForm } from "../../_components/select-editorial";
import { SelectIdiomasForm } from "../../_components/select-idiomas";

type Props = {
  id?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormEditarLibroType = z.infer<typeof inputEditBooks>;

export const LibroForm = ({ id, onSubmit, onCancel }: Props) => {
  const esNuevo = id === undefined;
  const libroId = parseInt(id ?? "");

  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId }, { enabled: !!id });

  const editarLibro = api.biblioteca.editarLibro.useMutation(); // Se llama si existe libroId
  const agregarlibro = api.biblioteca.nuevoLibro.useMutation(); // Se llama si no existe libroId

  const libroBase: Partial<FormEditarLibroType> = useMemo(() => {
    if (!libro) return {};
    return {
      titulo: libro.titulo,
      isbn: libro.isbn,
      bibliotecaId: libro.bibliotecaId,
      inventarioId: libro.inventarioId,
      editorialId: libro.editorialId,
      idiomaId: libro.idiomaId,
      laboratorioId: libro.laboratorioId,
      armarioId: libro.armarioId,
      estanteId: libro.estanteId,
      sedeId: libro.sedeId,
      autorId: libro.autorId,
      anio: libro.anio,
      materias: libro.materias.map((materia) => String(materia.materia.id)),
    };
  }, [libro]);

  const formHook = useForm<FormEditarLibroType>({
    mode: "onChange",
    defaultValues: libroBase,
    resolver: zodResolver(inputEditBooks),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => formHook.reset(libroBase), [formHook, libroBase]);

  if (!esNuevo && isNaN(libroId)) {
    return <div>Error al cargar...</div>;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarLibroType) => {
    if (esNuevo) {
      agregarlibro.mutate(formData, {
        onSuccess: () => {
          toast.success("Libro agregado con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al agregar el libro");
        },
      });
      return;
    }

    editarLibro.mutate(formData, {
      onSuccess: () => {
        toast.success("Libro actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el libro");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 px-0 md:px-6">
            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 w-full">
                <FormInput label={"Titulo"} control={control} name="titulo" type={"text"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Inventario ID"}
                  control={control}
                  name="inventarioId"
                  type={"text"}
                  className="mt-2"
                />
              </div>

              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Biblioteca ID"}
                  control={control}
                  name="bibliotecaId"
                  type={"text"}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormInput label={"ISBN"} control={control} name="isbn" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/2">
                <FormInput label={"Año"} control={control} name="anio" type={"number"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/4">
                <FormInput label={"Sede"} control={control} name="sedeId" type={"number"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/4">
                <FormInput
                  label={"Laboratorio"}
                  control={control}
                  name="laboratorioId"
                  type={"number"}
                  className="mt-2"
                />
              </div>

              <div className="mt-4 basis-1/4">
                <FormInput label={"Armario"} control={control} name="armarioId" type={"number"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/4">
                <FormInput label={"Estante"} control={control} name="estanteId" type={"number"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <SelectEditorialForm name="editorialId" control={control} className="mt-2" label={"Editorial"} />
              </div>

              <div className="mt-4 basis-1/2">
                <SelectIdiomasForm name="idiomaId" control={control} className="mt-2" label={"Idioma"} />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <MateriaDropdownMultipleForm name="materias" control={control} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row items-end justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title="Guardar" type="submit" variant="default" color="primary">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
