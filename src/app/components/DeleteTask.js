"use client";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { DELETE_TASK } from "../utils/graphql/mutations";
import { PRJ_QUERY } from "../utils/graphql/queries";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";

//компонент удаления задачи по идентификатору (получает идентификатор задачи для удаления)
export default function DeleteTask({ id }) {
  //функция вызова удаления задачи из базы данных
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });
  const { data: session } = useSession();

  //отображение значка удаления задачи
  return (
    <>
      {session?.user.role == "manager" ? (
        <MinusCircleIcon
          className="inline-block  h-5 w-5 text-red-500"
          onClick={() => {
            if (!window.confirm("Вы уверены? Подтвердите действие?")) {
              return;
            }
            deleteTask({ variables: { id: id } });
          }}
        />
      ) : null}
    </>
  );
}
