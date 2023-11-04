"use client";

import { TasksQuery } from "@/app/components/TasksQuery";
import { PRJ_QUERY } from "@/app/utils/graphql/queries";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

//функция отображения формы отчета
export default function ReportByUser() {
  const router = useRouter();

  //функция проверки авторизации
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/cc/reports/consrep");
    },
  });
  const [ready, setReady] = useState(false);

  //загрузка данных ибз базы данных
  const { data } = useSuspenseQuery(PRJ_QUERY);
  const allProjects = data.projects;
  const allUsers = data.users;
  const allTasks = TasksQuery();

  //console.log(allProjects, allUsers, allTasks);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const percent2 = (num) => num * 100;

  //функция подготовки начального экрана отчета
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReady(true);
    }
  }, []);

  //функция отображения экрана и полей таблицы отчета
  return (
    <>
      {ready && (
        <article className="mx-auto h-screen max-w-5xl bg-bgmain-100 py-10 2xl:ml-72 2xl:max-w-full">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Сводный отчет по производительности
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Отчет предоставляет данные о производительности каждого
                  участника в команде. Он включает информацию об общем
                  количестве задач, назначенных на каждого пользователя по
                  проектам, количестве выполненных задач и отставанию по срокам
                  выполнения. Отчет позволяет менеджерам и командам оценить
                  эффективность и распределение ресурсов.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="default-button-narrow"
                >
                  Назад
                </button>
              </div>
            </div>
            <div className="mt-8 flow-root bg-bgmain-100">
              <div className="-mx-4 -my-2 overflow-x-auto bg-bgmain-100 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300 ">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Пользователь
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Количество проектов
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Количество задач
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Выполнено задач
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Процент выполнения
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Просрочено задач
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 ">
                      {allUsers.map((user) => {
                        return (
                          <tr key={user.email}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {user.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                new Set(
                                  allTasks
                                    .filter((task) => task.userId == user.id)
                                    .map((t) => t.projectId),
                                ).size
                              }
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                allTasks.filter(
                                  (task) => task.userId == user.id,
                                ).length
                              }
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                allTasks
                                  .filter((task) => task.userId == user.id)
                                  .filter((t) => t.stage == "Done").length
                              }
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {allTasks
                                .filter((task) => task.userId == user.id)
                                .filter((t) => t.stage == "Done").length
                                ? percent2(
                                    round2(
                                      allTasks
                                        .filter(
                                          (task) => task.userId == user.id,
                                        )
                                        .filter((t) => t.stage == "Done")
                                        .length /
                                        allTasks.filter(
                                          (task) => task.userId == user.id,
                                        ).length,
                                    ),
                                  )
                                : 0}
                              &nbsp;%
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                allTasks
                                  .filter((task) => task.userId == user.id)
                                  .filter(
                                    (t) =>
                                      Date.now() - new Date(t.endDate) >= 0 &&
                                      t.stage !== "Done",
                                  ).length
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
