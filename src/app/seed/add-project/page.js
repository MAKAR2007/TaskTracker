// функция для инициализации работы с системой
// использовалась на анчальных этапах сборки проекта и подготовки данных
// оставлена для последующего использования и случаев аварийного восстановления данных

import { prisma } from "@/app/utils/db/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add Project",
};

async function addProject(formData) {
  "use server";

  /*
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-project");
  }
*/
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();

  if (!title || !description) {
    throw Error("Пропущены обязательные поля");
  }

  await prisma.project.create({
    data: { title, description },
  });

  redirect("/");
}

export default async function AddProjectPage() {
  // const session = await getServerSession(authOptions);
  /*
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-project");
  }
*/

  //экран функции воода данных о проекте
  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add Project</h1>
      <form action={addProject}>
        <input
          required
          name="title"
          placeholder="Title"
          className="input input-bordered mb-3 w-full"
        />
        <textarea
          required
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered mb-3 w-full"
        />
        <button className="btn btn-primary btn-block" type="submit">
          Add Project
        </button>
      </form>
    </div>
  );
}
