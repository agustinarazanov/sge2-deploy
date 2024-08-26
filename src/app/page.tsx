import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          SGE <span className="text-[hsl(280,100%,70%)]">2.0</span>
        </h1>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center text-2xl ">
              {session && (
                <>
                  <p>
                    Hola <code>{session.user?.name}</code>!
                  </p>
                  <br></br>
                  <div>
                    <Image
                      alt="Imagen de perfil"
                      src={session.user.image!}
                      width={100}
                      height={100}
                      className="m-auto rounded-full"
                    />
                  </div>
                </>
              )}
            </div>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="bg-white/10 hover:bg-white/20 rounded-full px-10 py-3 font-semibold no-underline transition"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
