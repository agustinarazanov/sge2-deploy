"use client";

import { useRouter } from "next/navigation";
import { ReservaViewAdmin } from "./form-gestion-reserva";

type PageProps = {
  params: { id: string };
};

export default function PageLibroDetails({ params: { id } }: PageProps) {
  const router = useRouter();

  const handleClickCancel = () => router.back();
  // if user is admin show ReservaViewAdmin else show reservaViewUsuario

  return (
    <>
      <ReservaViewAdmin reservaId={Number(id)} onCancel={handleClickCancel} />
    </>
  );
}
