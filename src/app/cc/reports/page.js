"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

//функция для отображения списка отчетов

export default function Reports() {
  //функция проверки авторизации
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/cc/reports");
    },
  });

  //функция вывода на экран списка доступных отчетов
  return (
    <>
      {session && (
        <article className="mx-auto h-screen max-w-5xl bg-bgmain-100 p-10 2xl:ml-72 2xl:max-w-full">
          <section>
            <div className="flex items-center justify-between p-10">
              <div className="text-2xl font-semibold">Отчеты</div>
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

            <div className="overflow-x-auto bg-bgmain-100">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Название</th>
                    <th className="p-5 text-left">Краткое описание</th>
                    <th className="p-5 text-left">Ссылка на отчет</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="p-5">Сводный отчет по производительности</td>
                    <td className="p-5">
                      Отчет предоставляет данные о производительности каждого
                      участника в команде. Он включает информацию об общем
                      количестве задач, назначенных на каждого пользователя по
                      проектам, количестве выполненных задач и отставанию по
                      срокам выполнения. Отчет позволяет менеджерам и командам
                      оценить эффективность и распределение ресурсов.{" "}
                    </td>
                    <td className="p-5">
                      <a
                        href="reports/consrep"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ссылка на отчет
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-5">Производительность по проектам</td>
                    <td className="p-5">
                      Отчет предоставляет данные о производительности каждого
                      участника в команде. Он включает по каждому проекту
                      пользователя информацию об общем количестве задач
                      пользователя по проекту, количестве выполненных задач и
                      отставанию по срокам выполнения. Отчет позволяет
                      менеджерам и командам оценить эффективность и
                      распределение ресурсов на проектной основе.
                    </td>
                    <td className="p-5">
                      <a
                        href="reports/consrep2"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ссылка на отчет
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-5">Список задач пользователей</td>
                    <td className="p-5">
                      Отчет содержит список задач пользователя/пользователей с
                      указанием планируемых дат завершения и статусов
                    </td>
                    <td className="p-5">
                      <a
                        href="reports/consrep3"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Ссылка на отчет
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </article>
      )}
    </>
  );
}
