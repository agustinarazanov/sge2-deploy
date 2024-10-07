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
    setTimeout(() => router.back(), 100);
  };

  const handleClickRechazar = () => {
    router.refresh();
    setTimeout(() => router.back(), 100);
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
