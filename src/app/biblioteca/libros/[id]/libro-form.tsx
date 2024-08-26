import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditBooks } from "@/shared/filters/biblioteca-filter.schema";
import { type z } from "zod";
import { useEffect } from "react";

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

  const formHook = useForm<FormEditarLibroType>({
    mode: "onChange",
    defaultValues: {
      id: libro?.id ?? undefined,
      anio: libro?.anio ?? new Date().getFullYear(),
      autor: libro?.autor?.autorNombre ?? "",
      editorial: libro?.editorial?.editorial ?? "",
      idioma: libro?.idioma?.idioma ?? "",
      inventario: libro?.inventarioId ?? "",
      isbn: libro?.isbn ?? "",
      materias: libro?.materias.map((materia) => materia.materia.nombre) ?? [],
      titulo: libro?.titulo ?? "",
    },
    resolver: zodResolver(inputEditBooks),
  });

  const { handleSubmit, control } = formHook;

  // TODO: Separar componente de formulario y logica de carga y actualización de libro
  useEffect(() => {
    if (libro) {
      formHook.reset({
        id: libro.id,
        anio: libro.anio,
        autor: libro.autor.autorNombre,
        editorial: libro.editorial.editorial,
        idioma: libro.idioma.idioma,
        inventario: libro.inventarioId,
        isbn: libro.isbn ?? "",
        materias: libro.materias.map((materia) => materia.materia.nombre),
        titulo: libro.titulo,
      });
    }
  }, [formHook, libro]);

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
              <div className="mt-4 basis-1/3">
                <FormInput label={"Inventario"} control={control} name="inventario" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"Año"} control={control} name="anio" type={"number"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"Autor"} control={control} name="autor" type={"text"} className="mt-2" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/3">
                <FormInput label={"Editorial"} control={control} name="editorial" type={"text"} className="mt-2" />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput
                  label={"Idioma"}
                  id="idioma"
                  control={control}
                  name="idioma"
                  type={"text"}
                  className="mt-2"
                />
              </div>

              <div className="mt-4 basis-1/3">
                <FormInput label={"ISBN"} control={control} name="isbn" type={"text"} className="mt-2" />
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
