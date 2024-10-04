import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectUsuarioForm } from "@/app/_components/select-usuario";
import { type z } from "zod";
import { useEffect } from "react";
import { inputPrestarLibro } from "@/shared/filters/reservas-filter.schema";
import { useRouter } from "next/navigation";
import { getDate } from "@/shared/get-date";

type Props = {
  libroId: number;
  onSubmit: () => void;
  onCancel: () => void;
  renovar?: boolean;
};

type FormHelperType = {
  usuarioSolicitante: { id: string; label: string };
};

type FormPrestarLibroType = z.infer<typeof inputPrestarLibro> & FormHelperType;

export const LibroFormPrestarORenovar = ({ libroId, onSubmit, onCancel, renovar }: Props) => {
  const prestarLibro = api.reservas.reservaBiblioteca.crearReserva.useMutation(); // Se usa por efecto si `renovar=false`
  const renovarLibro = api.reservas.reservaBiblioteca.renovarLibro.useMutation(); // Se usa por efecto si `renovar=true`

  const router = useRouter();

  const prestamoBase: FormPrestarLibroType = {
    libroId: libroId,
    usuarioSolicitanteId: "",
    usuarioSolicitante: {
      id: "",
      label: "",
    },
    fechaInicio: getDate(),
    fechaFin: getDate(7),
  };

  const formHook = useForm<FormPrestarLibroType>({
    mode: "onChange",
    defaultValues: prestamoBase,
    resolver: zodResolver(
      inputPrestarLibro.refine(({ usuarioSolicitanteId }) => renovar ?? !!usuarioSolicitanteId, {
        message: "Requerido",
        path: ["usuarioSolicitanteId"],
      }),
    ),
  });

  console.log({ errors: formHook.formState.errors, renovar });

  const sendEmailMutation = api.email.sendEmail.useMutation({
    onSuccess: (data) => {
      console.log("Email sent successfully:", data);
    },
    onError: (error) => {
      console.error("Error sending email:", error);
    },
  });

  const sendEmail = () => {
    return sendEmailMutation.mutate({
      to: "alexanderarmua1@gmail.com",
      subject: "Notificación Reserva",
      text: `Hola ${usuarioSolicitante.label}, has reservado el libro: ${libroId}`,
    });
  };

  const { handleSubmit, control, watch, trigger } = formHook;

  const onFormSubmit = async (formData: FormPrestarLibroType) => {
    if (renovar) {
      await handleRenovarLibro(formData);
    } else {
      sendEmail();
      await handlePrestarLibro(formData);
    }
  };

  const handleRenovarLibro = async (formData: FormPrestarLibroType) => {
    renovarLibro.mutate(formData, {
      onSuccess: () => {
        toast.success("Libro renovado con éxito.");
        router.refresh();
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al renovar el libro");
      },
    });
  };

  const handlePrestarLibro = async (formData: FormPrestarLibroType) => {
    prestarLibro.mutate(formData, {
      onSuccess: () => {
        toast.success("Libro prestado con éxito.");
        router.refresh();
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al prestar el libro");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const [usuarioSolicitante, fechaFin] = watch(["usuarioSolicitante", "fechaFin"]);

  useEffect(() => formHook.setValue("usuarioSolicitanteId", usuarioSolicitante?.id), [formHook, usuarioSolicitante]);
  useEffect(() => {
    void trigger("fechaInicio");
  }, [formHook, fechaFin, trigger]);

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 px-0 md:px-6">
            <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Desde el día"}
                  control={control}
                  name="fechaInicio"
                  className="mt-2"
                  type={"date"}
                  required
                />
              </div>
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Hasta el día"}
                  control={control}
                  name="fechaFin"
                  className="mt-2"
                  type={"date"}
                  required
                />
              </div>
            </div>

            {!renovar && (
              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  <SelectUsuarioForm
                    name="usuarioSolicitante"
                    realNameId="usuarioSolicitanteId"
                    control={control}
                    className="mt-2"
                    label={"Usuario solicitante"}
                    placeholder={"Selecciona un usuario"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full flex-row items-end justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title={renovar ? "Renovar" : "Prestar"} type="submit" variant="default" color="primary">
            {renovar ? "Renovar" : "Prestar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
