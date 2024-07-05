import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          SGE <span className="text-[hsl(280,100%,70%)]">2.0</span>
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="#"
          >
            <h3 className="text-2xl font-bold">Cursos 🙇🏻</h3>
            <div className="text-lg">
              Todos los cursos de la carrera de Ingeniería Electrónica En
              construcción, no entrar
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/biblioteca"
          >
            <h3 className="text-2xl font-bold">Biblioteca 📚</h3>
            <div className="text-lg">
              Todos los libros que se encuentran disponibles en la biblioteca
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center text-2xl text-white">
              {session && (
                <>
                  <p>
                    Hola <code>{session.user?.name}</code>!
                  </p>
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
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
