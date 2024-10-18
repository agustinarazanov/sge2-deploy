import { type FieldValues, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { PoliticasPrivacidadModal } from "@/app/_components/politicas-privacidad";
import { type FormInputProps } from "@/components/ui";

export const FormInputPoliticas = <T extends FieldValues>({ name, control }: FormInputProps<T>): React.ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="aceptoTerminos"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <Checkbox
                id="aceptoTerminos"
                name="aceptoTerminos"
                className="mt-2"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <b> Declaro conocer las nuevas políticas de uso de laboratorio</b>
            </label>
            <p className="text-sm text-black">
              La política de uso de laboratorio ha cambiado,{" "}
              <PoliticasPrivacidadModal triggerText="presione aquí para verla" />
            </p>
            <div className="min-h-4 text-sm text-danger">{fieldState.error && fieldState.error.message}</div>
          </div>
        </>
      )}
    />
  );
};
