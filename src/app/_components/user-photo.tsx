import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";

export default async function UserPhoto() {
    const session = await getServerAuthSession();

    if (!session) {
        return null;
    }

    return (
      <>
        <div className="h-8 w-8 relative">
          <Image
            alt="Imagen de perfil"
            src={session.user.image!}
            className="rounded-full"
            sizes="32px"
            fill
          />
        </div>
      </>
    );
}
