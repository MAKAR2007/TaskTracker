"use client";
import { MinusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

import { TASK_QUERY } from "../utils/graphql/queries";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { DELETE_FILE } from "../utils/graphql/mutations";

// компонент кнопки даления файла из задачи, на входе получает идентификатор задачи из которой требуется удалить файл
export default function DeleteFile({ id }) {
  //функция вызова удаления афайла из базы
  const [deleteFile] = useMutation(DELETE_FILE, {
    refetchQueries: [{ query: TASK_QUERY }],
  });
  const { data: session } = useSession();

  //экран отображени кнопки удаления файла
  return (
    <>
      {session?.user.role == "manager" ? (
        <button
          className="default-button-narrow-att  mx-2"
          onClick={() => {
            if (!window.confirm("Вы уверены? Подтвердите действие?")) {
              return;
            }
            deleteFile({ variables: { id: id } });
          }}
        >
          Удалить файл из базы
        </button>
      ) : null}
    </>
  );
}
