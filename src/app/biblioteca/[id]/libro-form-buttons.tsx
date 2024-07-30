import { Button } from "@/components/ui";

type Props = {
  handleClickCancel: () => void;
  handleClickSave: () => void;
};

export const LibroFormButtons = ({ handleClickCancel, handleClickSave }: Props) => {
  return (
    <div className="flex w-full flex-row items-end justify-end space-x-4">
      <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleClickCancel}>
        Cancelar
      </Button>
      <Button title="Guardar" type="submit" variant="default" color="primary" onClick={handleClickSave}>
        Guardar
      </Button>
    </div>
  );
};
