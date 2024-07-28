import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";

export default async function UserPhoto() {
  const session = await getServerAuthSession();

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="relative h-8 w-8">
        <Image
          alt="Imagen de perfil"
          src={session.user.image!}
          className="rounded-full"
          sizes="32px"
          priority={false}
          fill
        />
      </div>
    </>
  );
}
