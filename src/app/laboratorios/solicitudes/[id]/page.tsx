"use client";

import { useRouter } from "next/navigation";
import { ReservaViewAdmin } from "./form-gestion-reserva";

type PageProps = {
  params: { id: string };
};

export default function PageLibroDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => {
    router.back();
  };

  const handleClickAprobar = () => {
    router.refresh();
    // TODO: NO ANDA
  };

  const handleClickRechazar = () => {
    router.refresh();
    // TODO: NO ANDA
  };

  return (
    <>
      <ReservaViewAdmin
        reservaId={Number(id)}
        onCancel={handleClickCancel}
        onAprobar={handleClickAprobar}
        onRechazar={handleClickRechazar}
      />
    </>
  );
}
