"use client";
import Image from "next/image";
import {
  ChevronDownIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PlusCircleIcon,
  QueueListIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import TaskStage from "@/app/utils/task-stage.json";
import { useEffect, useState } from "react";
import CardItem from "./CardItem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@apollo/client";
import { ADD_TASK, UPDATE_TASK } from "../utils/graphql/mutations";
import { PRJ_QUERY } from "../utils/graphql/queries";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useSession } from "next-auth/react";

import { useSelectedContext } from "../context/SelectedProvider";

//функция создания идентификатора
function createGuidId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
//функция создания идентификатора в формате Атлас/МоногДБ
function createAtlasId() {
  const template = "xxxxxxxxxxxxxxxxxxxxxxxx";
  return template.replace(/x/g, function () {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
}

//функция подготовки данных для доски проектов
//получает в качестве параметров список стадий проекта, ссылку на выбранный проект и список пользователй
function CreateBoardData({ taskStage, selected, allUsers }) {
  if (taskStage && selected && allUsers) {
    let y = [];
    let nSelected = JSON.parse(JSON.stringify(selected));

    for (let i = 0; i < taskStage?.length; i++) {
      y.length++;
      y[i] = [];
      let z = [];

      for (let j = 0; j < selected.tasks?.length; j++) {
        for (let k = 0; k < allUsers?.length; k++) {
          if (allUsers[k].id == selected?.tasks[j]?.userId) {
            nSelected.tasks[j].user = allUsers[k];
          }
        }
        if (selected.tasks[j].stage == taskStage[i].stage) {
          z.push(nSelected.tasks[j]);
        }
      }
      y[i].push(taskStage[i], z);
    }
    let transformed = y.map((entry) => ({
      stage: entry[0].stage,
      tasks: entry[1],
    }));
    return transformed;
  }
}

//функция вывода доски проектов
export default function Board() {
  //загрузка данных
  const { data } = useSuspenseQuery(PRJ_QUERY);
  const allProjects = data.projects;
  const allUsers = data.users;

  const [ready, setReady] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [boardData, setBoardData] = useState(0);
  const [taskStage, setTaskStage] = useState(TaskStage);

  const [selected, setSelected] = useSelectedContext();

  const { data: session } = useSession();

  //вызов функции записи новой задачи в базу данных
  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });

  //вызов функции изменения задачи
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });

  //функция подгтовки данных для отображения получает в качестве параметров выбранный проект, стдии проекта, список пользователей, список проектов и функцию выбора проектов
  //получает данные о выбранном проекте и функцию управления им, стадиях задач проекта, пользователях
  useEffect(() => {
    if (selected) {
      let result = allProjects.filter((project) => project.id == selected.id);
      setSelected(result[0]);
    }
    if (typeof window !== "undefined") {
      // building board data
      if (selected && selected.title) {
        let nBoard = CreateBoardData({ taskStage, selected, allUsers });
        setBoardData(nBoard);
        setReady(true);
      }
    }
  }, [selected, taskStage, allUsers, allProjects, setSelected]);

  //функция обработки окончания претаскивания задачи между стадиями проекта, получающая на входе синтетический объект состояния
  const onDragEnd = (re) => {
    if (!re.destination) return;
    let newBoardData = boardData;
    var dragItem =
      newBoardData[parseInt(re.source.droppableId)].tasks[re.source.index];
    newBoardData[parseInt(re.source.droppableId)].tasks.splice(
      re.source.index,
      1,
    );
    newBoardData[parseInt(re.destination.droppableId)].tasks.splice(
      re.destination.index,
      0,
      dragItem,
    );
    //установка статуса доски проекта на основе изменненных данных
    setBoardData(newBoardData);
    let nStage = "";
    if (re.destination.droppableId == 0) {
      nStage = "New";
    } else {
      if (re.destination.droppableId == 1) {
        nStage = "WIP";
      } else {
        if (re.destination.droppableId == 2) {
          nStage = "Review";
        } else {
          nStage = "Done";
        }
      }
    }
    //запись обновленного задания в базу данных по идентификатору с новыми параметрами стадии
    updateTask({
      variables: {
        id: dragItem.id,
        stage: nStage,
      },
    });
  };

  //функция обработки ввода названия проекта (на входе синтетический объект состояния)
  const onTextAreaKeyPress = (e) => {
    var stage = "";
    if (e.keyCode === 13) {
      //Enter
      const title = e.target.value;
      if (title.length === 0) {
        setShowForm(false);
      } else {
        const boardId = e.target.attributes["data-id"].value;
        if (boardId == 0) {
          stage = "New";
        } else {
          if (boardId == 1) {
            stage = "WIP";
          } else {
            if (boardId == 2) {
              stage = "Review";
            } else {
              stage = "Done";
            }
          }
        }
        const priority = "Undefined";
        const projectId = selected.id;
        const item = {
          id: createGuidId(),
          userId: createAtlasId(),
          title: title,
          priority: priority,
          stage: stage,
          projectId: projectId,
          comments: "",
        };
        let newBoardData = boardData;
        newBoardData[boardId].tasks.push(item);
        setBoardData(newBoardData);
        setShowForm(false);
        addTask({
          variables: {
            title,
            stage,
            priority,
            projectId,
          },
        });
        e.target.value = "";
      }
    }
  };

  //функция прорисовки экарана с доской проектов
  return (
    <div className=" mx-auto h-screen max-w-5xl bg-bgmain-100 p-10 2xl:ml-72 2xl:max-w-full">
      {/* Board header */}
      <div className="flex flex-col items-start lg:flex-row  lg:items-center ">
        <div className="">
          <Listbox
            value={selected ? selected : "Выберите проект"}
            onChange={setSelected}
          >
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg  py-2 pr-10  text-left    focus:outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="mx-4 block truncate text-xl font-bold text-accent-600 sm:text-4xl">
                  {selected ? selected.title : "Выбeрите проект"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className="ml-5 h-7 w-9 flex-shrink-0
            rounded-full bg-white p-1 text-gray-500 shadow-xl"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {allProjects.map((item, itemIdx) => {
                    const userfromsession = allUsers.filter(
                      (user) => user.email == session?.user.email,
                    );
                    //console.log(userfromsession);
                    if (userfromsession.length) {
                      const userfromsessionid = userfromsession[0].id;
                      if (userfromsessionid) {
                        //console.log("userfromsessionid", userfromsessionid);
                        const result = item.tasks.filter(
                          (task) => task.userId == userfromsessionid,
                        );
                        //console.log("session?.user.id", session?.user.id);
                        //console.log(result, project.title);
                        if (
                          result.length ||
                          session?.user.role == "administrator" ||
                          userfromsessionid == item.managerId
                        ) {
                          //console.log(result.length,session?.user.role,userfromsessionid,);
                          return (
                            <Listbox.Option
                              key={itemIdx}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-bgmain-100 text-amber-900"
                                    : "text-gray-900"
                                }`
                              }
                              value={item}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {item.title}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          );
                        }
                      }
                    }
                  })}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        {/*<Prj Manager />*/}

        <div className=" block items-center justify-start sm:flex">
          <div className="mx-4 ">Менеджер проекта:</div>
          <div>
            {selected && selected.managerId ? (
              <>
                <Image
                  src={
                    allUsers.filter((user) => user.id == selected.managerId)[0]
                      .image
                  }
                  width="36"
                  height="36"
                  className="ml-4 mr-2  inline-block rounded-full "
                  alt="some image 1"
                />
                <p className="  inline-block pr-2">
                  {
                    allUsers.filter((user) => user.id == selected.managerId)[0]
                      .name
                  }
                </p>
              </>
            ) : (
              <div>
                <QuestionMarkCircleIcon className="h-9 w-9 text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Board columns */}
      {ready && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="my-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {boardData.map((board, bIndex) => {
              return (
                <div key={board.stage}>
                  <Droppable droppableId={bIndex.toString()}>
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div
                          className={`relative flex flex-col
                            overflow-hidden rounded-md  shadow-md
                            ${
                              snapshot.isDraggingOver
                                ? "bg-green-200"
                                : "bg-white"
                            }`}
                        >
                          {board.stage === "New" ? (
                            <span
                              className="absolute inset-x-0 top-0 h-1 w-full
                          bg-gray-400 "
                            ></span>
                          ) : board.stage === "WIP" ? (
                            <span
                              className="absolute inset-x-0 top-0 h-1 w-full
                          bg-blue-400 "
                            ></span>
                          ) : board.stage === "Review" ? (
                            <span
                              className="absolute inset-x-0 top-0 h-1 w-full
                          bg-yellow-400 "
                            ></span>
                          ) : (
                            <span
                              className="absolute inset-x-0 top-0 h-1 w-full
                          bg-green-400"
                            ></span>
                          )}

                          <h4 className=" mb-2 flex items-center justify-start p-3">
                            <span className="text-2xl text-gray-600">
                              {board.stage === "New"
                                ? "Новые - "
                                : board.stage === "WIP"
                                ? "В работе - "
                                : board.stage === "Review"
                                ? "На проверке - "
                                : "Выполнено - "}
                            </span>
                            <span className="ml-2">
                              {session?.user.role == "administrator" ||
                              allUsers.filter(
                                (user) => user.email == session?.user.email,
                              )[0].id == selected.managerId
                                ? board.tasks.length
                                : board.tasks.filter(
                                    (task) =>
                                      task.userId ==
                                      allUsers.filter(
                                        (user) =>
                                          user.email == session?.user.email,
                                      )[0].id,
                                  ).length}
                            </span>
                          </h4>

                          <div
                            className="h-auto overflow-y-auto overflow-x-hidden"
                            style={{ maxHeight: "calc(100vh - 290px)" }}
                          >
                            {board.tasks?.length > 0 &&
                              board.tasks.map((task, tIndex) => {
                                if (
                                  task.userId ==
                                    allUsers.filter(
                                      (user) =>
                                        user.email == session?.user.email,
                                    )[0].id ||
                                  session?.user.role == "administrator" ||
                                  allUsers.filter(
                                    (user) => user.email == session?.user.email,
                                  )[0].id == selected.managerId
                                ) {
                                  return (
                                    <CardItem
                                      key={task.id}
                                      task={task}
                                      index={tIndex}
                                      className="m-3"
                                    />
                                  );
                                }
                              })}
                            {provided.placeholder}
                          </div>

                          {session.user.role == "manager" ? (
                            showForm && selectedBoard === bIndex ? (
                              <div className="p-3">
                                <textarea
                                  className="w-full rounded border-2 border-gray-300 p-2 focus:ring-purple-400"
                                  rows={3}
                                  placeholder="Название задачи"
                                  data-id={bIndex}
                                  onKeyDown={(e) => onTextAreaKeyPress(e)}
                                />
                              </div>
                            ) : (
                              <button
                                className=" mx-3  my-3 max-w-fit space-x-2 rounded-md  bg-blue-200 p-2 text-lg hover:bg-blue-400 hover:text-white focus:bg-blue-600"
                                onClick={() => {
                                  setSelectedBoard(bIndex);
                                  setShowForm(true);
                                }}
                              >
                                <span>
                                  Добавить задачу
                                  <PlusCircleIcon className="inline-block h-5 w-5 " />
                                </span>
                              </button>
                            )
                          ) : (
                            <div className="  my-1.5"></div>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
