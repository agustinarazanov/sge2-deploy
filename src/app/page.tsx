import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Image from "next/image";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
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
              Todos los cursos de la carrera de Ingeniería Electrónica
              En construcción, no entrar
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
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center text-2xl text-white">
              {session && (
                <>
                  <p>
                    Vos sos: <code>{session.user?.name}</code>
                  </p>
                  <p>
                    id: <code>{session.user.id}</code>
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

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Tu mas reciente ToDo creado: {latestPost.name}</p>
      ) : (
        <p>No tenes tareas pendientes.</p>
      )}

      <CreatePost />
    </div>
  );
}
