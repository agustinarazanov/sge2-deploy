import { api } from "@/trpc/server";
import { TutorCard } from "./tutor-card";

export default async function TutoresContainer() {
  const data = await api.admin.usuarios.getAllTutores();

  const tutores = data;

  return (
    <div className="flex w-full flex-row gap-x-8 px-4">
      <div className="grid w-full grid-cols-1 content-center justify-center gap-8 px-8 md:grid-cols-2 lg:grid-cols-3 xl:px-12 ">
        {tutores.map((tutor) => {
          return <TutorCard key={tutor.userId} tutor={tutor} className="grid-flow-row" />;
        })}
      </div>
    </div>
  );
}
