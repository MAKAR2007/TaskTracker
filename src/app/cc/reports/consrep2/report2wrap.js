"use client";
import { TasksQuery } from "@/app/components/TasksQuery";
import { PRJ_QUERY } from "@/app/utils/graphql/queries";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//расчетная функция для подготовки данных отчета
function CreateReportData({ allUsers, allProjects, allTasks }) {
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const percent2 = (num) => num * 100;
  var y = [];
  var count = 0;

  for (let i = 0; i < allUsers.length; i++) {
    var uTsk = allTasks.filter((task) => task.userId == allUsers[i].id);
    var uTskPrjId = uTsk.map((t) => t.projectId);
    var uPrjSet = new Set(uTskPrjId);
    var uPrj = Array.from(uPrjSet);

    for (let j = 0; j < uPrj.length; j++) {
      var pTsk = allTasks
        .filter((task) => task.projectId == uPrj[j])
        .filter((task) => task.userId == allUsers[i].id);
      var pTskDone = pTsk.filter((t) => t.stage == "Done");
      var dPrct = percent2(round2(pTskDone.length / pTsk.length));
      var tLate = pTsk.filter(
        (t) => Date.now() - new Date(t.endDate) >= 0 && t.stage !== "Done",
      ).length;
      y.length++;
      y[count] = [];
      var pTitle = allProjects.filter((project) => project.id == uPrj[j])[0]
        .title;
      y[count].push(
        allUsers[i].name,
        pTitle,
        pTsk.length,
        pTskDone.length,
        dPrct,
        tLate,
      );
      count++;
    }
  }
  //console.log(y);
  return y;
}
//функция отображения отчета
export default function ReportByUserPrj() {
  const router = useRouter();
  //функция проверки авторизации
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/cc/reports/consrep2");
    },
  });
  const [ready, setReady] = useState(false);
  const [reportData, setReportData] = useState();

  //загрузка данных
  const { data } = useSuspenseQuery(PRJ_QUERY);
  const allProjects = data.projects;
  const allUsers = data.users;
  const allTasks = TasksQuery();

  //функция подготовки начальных данных для отчета
  //получает данные о проектах, задачах и пользователях
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (allUsers && allProjects && allTasks) {
        let nReportData = CreateReportData({ allUsers, allProjects, allTasks });
        setReportData(nReportData);
      }
      setReady(true);
    }
  }, [allProjects, allTasks, allUsers]);

  //функция отображения экрана и полей таблицы отчета
  return (
    <>
      {ready && reportData && (
        <article className="mx-auto h-screen max-w-5xl bg-bgmain-100 py-10 2xl:ml-72 2xl:max-w-full">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Сводный отчет по производительности
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Отчет предоставляет данные о производительности каждого
                  участника в команде. Он включает по каждому проекту
                  пользователя информацию об общем количестве задач пользователя
                  по проекту, количестве выполненных задач и отставанию по
                  срокам выполнения. Отчет позволяет менеджерам и командам
                  оценить эффективность и распределение ресурсов на проектной
                  основе.
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
                          Название проекта
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
                      {reportData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {item[0]}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item[1]}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item[2]}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item[3]}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item[4]}
                              &nbsp;%
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item[5]}
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
