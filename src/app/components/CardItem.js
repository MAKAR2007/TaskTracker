import Image from "next/image";
import {
  PlusIcon,
  ChatBubbleOvalLeftIcon,
  PaperClipIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Draggable } from "@hello-pangea/dnd";

import { useRouter } from "next/navigation";
import DeleteTask from "./DeleteTask";
import EndDate from "./DueDate";

//функция компонента карточки задачи для доски проекта
// на входе данные задачи и ее индекс на доске в рамках стадии проекта

function CardItem({ task, index }) {
  const router = useRouter();

  return (
    <Draggable index={index} draggableId={task.id.toString()}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className=" m-3 mt-0 break-words rounded-md border-2 border-gray-500 bg-white p-3 last:mb-0  "
        >
          <div className="flex items-center justify-between">
            <label
              className={`rounded
              bg-gradient-to-r px-2 py-1 text-sm text-white
              ${
                task.priority === "Undefined"
                  ? "from-gray-600 to-gray-400"
                  : task.priority === "Low"
                  ? "from-blue-600 to-blue-400"
                  : task.priority === "Medium"
                  ? "from-green-600 to-green-400"
                  : "from-red-600 to-red-400"
              }
              `}
            >
              {task.priority === "Undefined"
                ? "Не установлен"
                : task.priority === "Low"
                ? "Низкий"
                : task.priority === "Medium"
                ? "Средний"
                : "Высокий"}
            </label>
            <span>
              <PencilIcon
                className=" inline-block h-5 w-5 text-gray-500"
                onClick={() => router.push("/cc/task/" + task.id)}
              />

              <DeleteTask id={task.id} />
            </span>
          </div>

          <h5 className="text-md my-3 text-lg leading-6  ">{task.title}</h5>

          <EndDate endDate={task.endDate} />
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <ChatBubbleOvalLeftIcon className="h-4 w-4 text-gray-500" />
                <span>{task.comments?.length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <PaperClipIcon className="h-4 w-4 text-gray-500" />
                <span>{task.files?.length}</span>
              </span>
            </div>

            <div className="flex">
              {task.user && task.user.image ? (
                <Image
                  src={task.user.image}
                  width="36"
                  height="36"
                  className=" rounded-full "
                  alt="another image"
                />
              ) : (
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed
                    border-gray-500"
                >
                  <PlusIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default CardItem;
