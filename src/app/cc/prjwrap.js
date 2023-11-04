"use client";
import { PRJ_QUERY } from "@/app/utils/graphql/queries";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useSession } from "next-auth/react";
import { useSelectedContext } from "../context/SelectedProvider";
import { redirect, useRouter } from "next/navigation";
import AddPrjBtn from "../components/AddPrjBtn";
import DeleteProject from "../components/DeleteProject";
import EditProjectBtn from "../components/EditProjectBtn";

//домашняя страница со списокм проектов в системе
//используется также администратором для создания новых и редактирования существующих проектов
export default function PrjWrap() {
  const router = useRouter();
  //функция проверки авторизации
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/cc");
    },
  });
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const percent2 = (num) => num * 100;
  //загрузка данных
  const { data } = useSuspenseQuery(PRJ_QUERY);
  const allProjects = data.projects;
  const allUsers = data.users;
  const [selected, setSelected] = useSelectedContext();

  //функция отображения экрана списка проектов
  return (
    <div className=" mx-auto h-screen max-w-5xl bg-bgmain-100  2xl:ml-72 2xl:max-w-full">
      <div className="flex items-center justify-between p-10">
        <div>
          <h1 className="text-2xl font-semibold">Доска проектов</h1>
        </div>
        <AddPrjBtn />
      </div>
      <div className="overflow-x-auto bg-bgmain-100">
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="px-5 text-left">Проект</th>
              <th className="p-5 text-left">Описание</th>
              <th className="p-5 text-left">Менеджер</th>
              <th className="p-5 text-left">Статус</th>
              <th className="p-5 text-left">Действия</th>
            </tr>
          </thead>

          <tbody>
            {session
              ? allProjects.map((project) => {
                  const userfromsession = allUsers.filter(
                    (user) => user.email == session?.user.email,
                  );
                  //проверить что пользователь залогинен и нет нуля
                  if (userfromsession.length) {
                    const userfromsessionid = userfromsession[0].id;
                    if (userfromsessionid) {
                      //result- массив задач на проекте, назначенных пользователю (если длинна 0- нет задач)
                      const result = project.tasks.filter(
                        (task) => task.userId == userfromsessionid,
                      );
                      //console.log("session?.user.id", session?.user.id);
                      //console.log(result, project.title);
                      if (
                        result.length ||
                        session?.user.role == "administrator" ||
                        userfromsessionid == project.managerId
                      ) {
                        return (
                          <tr key={project.title} className="border-b">
                            <td className="p-5">{project.title}</td>
                            <td className="p-5">
                              {project.description
                                ? project.description
                                : "Не задано"}
                            </td>
                            <td className="p-5">
                              {project.managerId
                                ? allUsers.filter(
                                    (user) => user.id == project.managerId,
                                  )[0].name
                                : "Не назначен"}
                            </td>
                            <td className="p-5">
                              {session?.user.role == "administrator" ||
                              userfromsessionid == project.managerId
                                ? project.tasks.filter(
                                    (task) => task.stage == "Done",
                                  ).length
                                  ? percent2(
                                      round2(
                                        project.tasks.filter(
                                          (task) => task.stage == "Done",
                                        ).length / project.tasks.length,
                                      ),
                                    )
                                  : 0
                                : result.filter((task) => task.stage == "Done")
                                    .length
                                ? percent2(
                                    round2(
                                      result.filter(
                                        (task) => task.stage == "Done",
                                      ).length / result.length,
                                    ),
                                  )
                                : 0}
                              &nbsp;%
                            </td>

                            <td className="p-5">
                              <button
                                onClick={() => {
                                  setSelected(project);
                                  router.push("/cc/prjlist");
                                }}
                                className="default-button-narrow"
                                type="button"
                              >
                                Открыть
                              </button>
                            </td>
                            <td className="p-5">
                              <EditProjectBtn id={project.id} />
                            </td>
                            <td className="p-5">
                              <DeleteProject id={project.id} />
                            </td>
                          </tr>
                        );
                      }
                    }
                  }
                })
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
