"use client";
import { MinusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

import { PRJ_QUERY } from "../utils/graphql/queries";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { DELETE_PROJECT } from "../utils/graphql/mutations";

//функция удаления проекта по его идентификатору (на входе идентификатор проекта для удаления)
export default function DeleteProject({ id }) {
  //вызов функции удаления проекта из базы данных
  const [deleteProject] = useMutation(DELETE_PROJECT, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });
  const { data: session } = useSession();

  //экран отображения кнопки удаления проекта
  return (
    <>
      {session?.user.role == "administrator" ? (
        <TrashIcon
          className="mx-2  inline-block h-6 w-6 text-red-500"
          onClick={() => {
            if (
              !window.confirm(
                "Вы уверены? Подтвердите действиеПодтвердите действие?",
              )
            ) {
              return;
            }
            deleteProject({ variables: { id: id } });
          }}
        />
      ) : null}
    </>
  );
}
