"use client";

import AddUserBtn from "@/app/components/RegisterBtn";
import { DELETE_USER } from "@/app/utils/graphql/mutations";
import { PRJ_QUERY } from "@/app/utils/graphql/queries";
import { useMutation } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

//функция отображения списка сотрудников
export default function TeamWrap() {
  //функция проверки прав доступа
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/cc/teamlist");
    },
  });

  //функция загрузки данных
  const { data } = useSuspenseQuery(PRJ_QUERY);
  const allProjects = data.projects;
  const allUsers = data.users;

  //функция удаления пользователя  из базы данных
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });

  //функция удаления пользователя по его идентификатору
  //userId - идентификатор пользователя для удаления
  const deleteHandler = async (userId) => {
    if (!window.confirm("Вы уверены? Подтвердите действие?")) {
      return;
    }
    deleteUser({ variables: { id: userId } });
  };

  //экран обображения списка пользователй системы
  return (
    <div className=" mx-auto h-screen max-w-5xl bg-bgmain-100   2xl:ml-72 2xl:max-w-full">
      <div className="flex items-center justify-between p-10">
        <div className="">
          <h1 className="text-2xl font-semibold">Пользователи</h1>
          <p className="text-gray-300">
            Список зарегистрированных пользователей системы
          </p>
        </div>
        <AddUserBtn />
      </div>

      <div className="overflow-x-auto bg-bgmain-100">
        <table className="  min-w-full  ">
          <thead className=" border-b ">
            <tr>
              <th className=" px-5 text-left">Имя</th>
              <th className="p-5 text-left">Адрес эл. почты</th>
              <th className="p-5 text-left">Отдел</th>
              <th className="p-5 text-left">Роль</th>
              <th className="p-5 text-left">Действия</th>
            </tr>
          </thead>

          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-5">{user.name ? user.name : "Не задано"}</td>
                <td className="p-5">{user.email}</td>
                <td className="p-5">
                  {user.department ? user.department : "Не задан"}
                </td>

                <td className="p-5">{user.role ? user.role : "Не задана"}</td>

                <td className=" p-5 ">
                  {session && session.user.role == "administrator" ? (
                    <>
                      <button
                        onClick={() => router.push("/cc/user/" + user.id)}
                        className="default-button-narrow"
                      >
                        Изменить
                      </button>
                    </>
                  ) : null}
                </td>
                <td>
                  {session && session.user.role == "administrator" ? (
                    <>
                      <button
                        onClick={() => deleteHandler(user.id)}
                        className="default-button-narrow-att"
                        type="button"
                      >
                        Удалить
                      </button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
