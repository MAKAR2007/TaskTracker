"use client";

import UserSelect from "@/app/components/UserSelect";
import { UsersQuery } from "@/app/components/UsersQuery";
import {
  ADD_COMMENT,
  DELETE_FILE,
  UPDATE_TASK,
} from "@/app/utils/graphql/mutations";
import { PRJ_QUERY, TASK_QUERY, sPRJ_QUERY } from "@/app/utils/graphql/queries";
import { useMutation } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { redirect, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NowDate from "@/app/components/NowDate";
import { useSelectedContext } from "@/app/context/SelectedProvider";

export const dynamic = "force-dynamic";

// Функция редактирования задачи с определенным идентификатором
// функция принимает в качестве параметра идентификатор задачи, которую небоходим отредактировать
// функция возвращает/выводит на экран форму редактирования задачи с возможностью сохранения введенных изменений

export default function Task({ params: { id } }) {
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });
  const [addComment] = useMutation(ADD_COMMENT);
  const [deleteFile] = useMutation(DELETE_FILE, {
    refetchQueries: [{ query: TASK_QUERY }],
  });

  const router = useRouter();
  // проверка авторизации
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/cc");
    },
  });

  //загружаем данные задачи
  var { data } = useSuspenseQuery(TASK_QUERY, { variables: { id } });
  const task = data.task;
  const projectId = task.projectId;
  const users = UsersQuery();
  var { data } = useSuspenseQuery(sPRJ_QUERY, { variables: { projectId } });
  const sPrj = data.project;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [comment, setComment] = useState("");
  const [endDate, setEndDate] = useState(task.endDate);

  const [selected, setSelected] = useSelectedContext();

  let nStage2 = "";
  if (task.stage === "New") {
    nStage2 = "Новые";
  } else {
    if (task.stage === "WIP") {
      nStage2 = "В работе";
    } else {
      if (task.stage === "Review") {
        nStage2 = "На проверке";
      } else {
        nStage2 = "Выполнено";
      }
    }
  }
  const [stage, setStage] = useState(nStage2);

  let nPriority2 = "";
  if (task.priority === "Undefined") {
    nPriority2 = "Не установлен";
  } else {
    if (task.priority === "Low") {
      nPriority2 = "Низкий";
    } else {
      if (task.priority === "Medium") {
        nPriority2 = "Средний";
      } else {
        nPriority2 = "Высокий";
      }
    }
  }

  const [priority, setPriority] = useState(nPriority2);
  //shared state здесь используется для определения исполнителя, который на начальном этапе создания задачи может быть неопределен сознательно
  const [sharedState, setSharedState] = useState({
    name: "Неопределен",
    id: null,
  });
  const [isChanged, setIsChanged] = useState(false);
  const isPrj = false;
  const [file, setFile] = useState();
  const [fUploaded, setFUploaded] = useState(false);

  // Функция подготовки начальных данных для отображения страницы
  //получает даннае о прикрепленных к задаче файлах, других праметрах задачи и пользвателях
  useEffect(() => {
    if (task.userId) {
      setSharedState(users.filter((user) => user.id == task.userId)[0]);
    }
    if (task.files.length) {
      setFile(task.files[0]);
      setFUploaded(true);
    }
    if (!selected) {
      setSelected(sPrj);
    }
  }, [
    sPrj,
    selected,
    setSelected,
    task.files,
    task.projectId,
    task.userId,
    users,
  ]);

  // функция обновления задачи в базе данных с указанным в параметрах id
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    //добавление файла в базу данных как часть обновления или создания задания
    if (file) {
      try {
        const data = new FormData();

        data.set("file", file);
        data.set("taskId", id);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
        // обработка ошибки сессии добавления файла
        if (!res.ok) throw new Error(await res.text());
        setFUploaded(true);
      } catch (e) {
        // обработка ошибки подготовки формы для загрузки файла в базу
        console.error(e);
      }
    }

    let nPriority = "";
    if (priority === "Не установлен") {
      nPriority = "Undefined";
    } else {
      if (priority === "Низкий") {
        nPriority = "Low";
      } else {
        if (priority === "Средний") {
          nPriority = "Medium";
        } else {
          nPriority = "High";
        }
      }
    }
    let nStage = "";
    if (stage === "Новые") {
      nStage = "New";
    } else {
      if (stage === "В работе") {
        nStage = "WIP";
      } else {
        if (stage === "На проверке") {
          nStage = "Review";
        } else {
          nStage = "Done";
        }
      }
    }

    // вызов функции обновления полей записи задачи в базе данных
    await updateTask({
      variables: {
        id: id,
        title: title,
        stage: nStage,
        description,
        endDate,
        priority: nPriority,
        userId: sharedState.id,
      },
    });
  };

  // функция обновления комментария в базе данных для определенной задачи
  const handleAddComment = async (e) => {
    e.preventDefault();
    const nUser = session.user.name + ", " + NowDate();
    //функция записи комментария в базу данных
    if (comment) {
      await addComment({
        variables: {
          taskId: id,
          comment: comment,
          user: nUser,
        },
      });
    }
    handleUpdateTask(e);

    //подготовка и отправка почтового уведомления о назначении задачи на пользователя
    if (isChanged) {
      const mName = sharedState.name;
      const mEmail = sharedState.email;
      const taskLink = `/cc/task/${task.id}`;
      const data = { mName, mEmail, title, description, taskLink };
      try {
        const response = await fetch("/api/contact", {
          method: "post",
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          console.log("falling over");
          throw new Error(`response status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData["message"]);

        alert("Уведомление сотруднику отправлено");
      } catch (err) {
        console.error(err);
        alert("Ошибка отправки уведомления об изменении задачи");
      }
      setIsChanged(false);
    }

    //переход к списку задач
    router.push("/cc/prjlist");
  };

  //функция удаления файла из базы данных
  const handleDeleteFile = async (e) => {
    e.preventDefault();

    if (!window.confirm("Вы уверены? Подтвердите действие?")) {
      return;
    }
    deleteFile({ variables: { id: file.id } });
    setFUploaded(false);
    handleUpdateTask(e);
  };

  //функция загрузки файла из базы данных (сохраняется в папке Download, настроенной в системе)
  const getFile = async () => {
    const response = await fetch(`/api/download/${id}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  //отображение экрана редактирования формы
  return (
    <Suspense fallback={<>Loading...</>}>
      {session && (
        <article className="bg-bgmain-100 pb-4">
          <section>
            <form
              className="mx-auto max-w-screen-md p-2 md:px-0 md:py-2"
              onSubmit={handleUpdateTask}
            >
              <div className="flex items-center justify-between">
                <h1 className="mb-4 text-xl">Проект : {sPrj.title}</h1>
                {/*task && task.userId ? (
                  <Image
                    src={
                      users.filter((user) => user.id == task.userId)[0].image
                    }
                    width="64"
                    height="64"
                    className="rounded-full"
                    alt="some image 1"
                  />
                  ) : null*/}
              </div>
              {session?.user.role == "manager" ? (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Название задачи
                    </label>
                    <input
                      value={title}
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                      id="title"
                      name="title"
                      autoFocus
                      placeholder="Новое название задачи"
                    />
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
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Название
                    </label>
                    <input
                      value={title}
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 bg-bgmain-100 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                      id="title"
                      name="title"
                      autoFocus
                      disabled
                      placeholder="Новое название задачи"
                    />
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
                      disabled
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 bg-bgmain-100 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                      id="description"
                      name="description"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <div className="mb-4 w-full">
                  <label
                    htmlFor="stage"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Стадия
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <option>Новые</option>
                    <option>В работе</option>
                    <option>На проверке</option>
                    <option>Выполнено</option>
                  </select>
                </div>
                <div className="mb-4 ml-2 w-full">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Срок исполнения
                  </label>
                  {session?.user.role == "manager" ? (
                    <input
                      value={endDate}
                      type="date"
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                      id="endDate"
                      name="endDate"
                      //pattern="\d{2}-\d{2}-\d{4}"
                      placeholder="Введите срок окончания задачи в формате дд.мм.гггг"
                    />
                  ) : (
                    <input
                      value={endDate}
                      disabled
                      type="text"
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-2 block w-full rounded-md border-0 bg-bgmain-100 py-1.5  pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                      id="endDate"
                      name="endDate"
                      placeholder="Введите срок окончания задачи в формате дд.мм.гггг"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="mb-4 w-full">
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Приоритет
                  </label>

                  {session?.user.role == "manager" ? (
                    <select
                      id="priority"
                      name="priority"
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option>Не установлен</option>
                      <option>Низкий</option>
                      <option>Средний</option>
                      <option>Высокий</option>
                    </select>
                  ) : (
                    <select
                      id="priority"
                      name="priority"
                      className="mt-2 block w-full rounded-md border-0 bg-bgmain-100 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                      value={priority}
                      disabled
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option>Не установлен</option>
                      <option>Низкий</option>
                      <option>Средний</option>
                      <option>Высокий</option>
                    </select>
                  )}
                </div>
                <div className="mb-4 ml-2 w-full">
                  <label
                    htmlFor="userId"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Исполнитель
                  </label>

                  <UserSelect
                    people={users}
                    setSharedState={setSharedState}
                    sharedState={sharedState}
                    isChanged={isChanged}
                    setIsChanged={setIsChanged}
                    isPrj={isPrj}
                  />
                </div>
              </div>

              {/**<div className="mb-4">
                <button className=" bg-accent-600 focus-visible:outline-accent-600 hover:bg-accent-500 mb-4 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                  Сохранить
                </button>
              </div>*/}
            </form>
          </section>

          <form
            onSubmit={handleAddComment}
            className="mx-auto max-w-screen-md gap-2 px-2 md:px-0"
          >
            <label
              htmlFor="userId"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Добавить новый комментарий
            </label>

            <div className=" mb-4  gap-2">
              <textarea
                rows={4}
                type="textarea"
                onChange={(e) => setComment(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                id="comment"
                name="comment"
                placeholder="Введите комментарий"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="userId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Комментарии:
              </label>
              <div className="  gap-2">
                {task?.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="my-1 flex items-center gap-2 rounded-md border-0 border-gray-300  p-2 text-xs ring-1 ring-inset ring-gray-300"
                  >
                    <div>{comment?.comment}</div>
                    <div className="italic"> - {comment?.user}</div>
                  </div>
                ))}
              </div>
            </div>
            {fUploaded ? (
              <div className="mx-auto max-w-screen-md px-2  md:px-0">
                <div className="inline-block">
                  В задаче загружен файл {file?.name}
                </div>
                {/*task.files.length ? (
                <p>{task.files.length}</p>
              ) : (
                <p>файл не записан в задачу</p>
              )*/}
                <button
                  type="button"
                  className="default-button-narrow mx-2"
                  onClick={getFile}
                >
                  Скачать файл из базы данных
                </button>
                {session?.user.role == "manager" ? (
                  <button
                    className="default-button-narrow-att  mx-2"
                    onClick={handleDeleteFile}
                  >
                    Удалить файл из базы
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="mx-auto max-w-screen-md px-2  md:px-0">
                <div className="mb-4">
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Добавить файл
                  </label>

                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="my-4 block w-full rounded-md border-0 bg-white py-1.5  pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <button className="rounded-md bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600">
                Cохранить
              </button>
            </div>
          </form>
        </article>
      )}
    </Suspense>
  );
}
