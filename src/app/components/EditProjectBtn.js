"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//функция удаления проекта по его идентификатору (на входе идентификатор проекта для удаления)
export default function EditProjectBtn({ id }) {
  const router = useRouter();
  //функция проверки авторизации
  const { data: session } = useSession();

  //экран отображения кнопки удаления проекта
  return (
    <>
      {session && session.user.role == "administrator" ? (
        <>
          <button
            onClick={() => router.push("/cc/project/" + id)}
            className="default-button-narrow"
          >
            Изменить
          </button>
        </>
      ) : null}
    </>
  );
}
