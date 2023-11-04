"use client";
//компонент - кнопка создания проекта
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//функция кнопки создания проекта
export default function AddPrjBtn() {
  const router = useRouter();
  //проверка авторизации
  const { data: session } = useSession();

  //функция отображения кнопки для роли администратора
  return (
    <>
      {session && session.user.role == "administrator" ? (
        <button
          onClick={() => router.push("/cc/project")}
          className="rounded-md bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
        >
          Создать проект +
        </button>
      ) : null}
    </>
  );
}
