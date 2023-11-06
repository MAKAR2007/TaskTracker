"use client";

import UserSelect from "@/app/components/UserSelect";
import { ADD_PROJECT } from "@/app/utils/graphql/mutations";
import { PRJ_QUERY, USERS_QUERY } from "@/app/utils/graphql/queries";
import { useMutation } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

export const dynamic = "force-dynamic";

//функция создания  нового или редактирования существующего проекта
export default function CreateProject() {
  //  функция проверки авторизации
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/cc");
    },
  });

  //загрузка данных из базы данных
  const { data } = useSuspenseQuery(USERS_QUERY);
  const users = data.users;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [manager, setManager] = useState({
    name: "Неопределен",
    id: 0,
  });
  const [isChanged, setIsChanged] = useState(false);
  const isPrj = true;
  //функция для добавления данных по проекту в базу данных
  const [addProject] = useMutation(ADD_PROJECT, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });

  const handleCreatePrj = async (e) => {
    //предотварщает перезагрузку/обновление страницы
    e.preventDefault();

    //добавление проекта в базу данных
    await addProject({
      variables: {
        title,
        description,
        managerId: manager.id,
      },
    });

    //добавление уведомления nodemailer notification менеджеру о создании проекта

    const mName = manager.name;
    const mEmail = manager.email;

    const data = { mName, mEmail, title, description };
    try {
      const response = await fetch("/api/contact", {
        method: "post",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.log("ошибка отправки уведомления");
        throw new Error(`response status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log(responseData["message"]);

      alert("Уведомление менеджеру о новом проекте отправлено");
    } catch (err) {
      console.error(err);
      alert("Ошибка отправки уведомления о создании нового проекта");
    }

    // возврат к списку проектов
    router.push("/cc");
  };

  //отображение экрана создания или изменения проекта
  return (
    <Suspense fallback={<>Loading...</>}>
      <article className="h-screen  bg-bgmain-100">
        <section className="mx-auto  max-w-xl px-4 ">
          <h1 className="mb-4 text-xl">Создать проект</h1>
          <p className="mb-4 text-sm text-gray-400">
            Заполните поля для создания проекта. Обязательные поля отмечены *.
          </p>
          <form
            className=" group w-full max-w-screen-md"
            onSubmit={handleCreatePrj}
          >
            <div className=" mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Название *
              </label>
              <div className="relative">
                <input
                  value={title}
                  required
                  pattern=".{2,}"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  className="peer mt-2  block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                  id="title"
                  name="title"
                  autoFocus
                  placeholder="Название проекта"
                />
                <div className="pointer-events-none  absolute inset-y-0 right-0  hidden items-center py-1.5 pr-3 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                  <ExclamationCircleIcon
                    className="h-5 w-5  text-red-600 "
                    aria-hidden="true"
                  />
                </div>
                <p className="invisible text-xs font-light text-red-600 peer-[&:not(:placeholder-shown):not(:focus):invalid]:visible">
                  Название проекта должно состоять из двух и более символов
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Описание
              </label>
              <textarea
                rows={4}
                value={description}
                type="textarea"
                //defaultValue={""}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                id="description"
                name="description"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="userId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Менеджер проекта *
              </label>

              <UserSelect
                people={users}
                setSharedState={setManager}
                sharedState={manager}
                isChanged={isChanged}
                setIsChanged={setIsChanged}
                isPrj={isPrj}
              />
            </div>

            <div className="mb-4 group-invalid:opacity-30">
              {title && manager.name !== "Неопределен" ? (
                <button className=" mb-4 rounded-md bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600">
                  Сохранить
                </button>
              ) : (
                <button
                  disabled
                  className="  mb-4 rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
                >
                  Сохранить
                </button>
              )}
            </div>
          </form>
        </section>
      </article>
    </Suspense>
  );
}
