"use client";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import {
  DELETE_COMMENT,
  DELETE_FILE,
  DELETE_TASK,
} from "../utils/graphql/mutations";
import { PRJ_QUERY, TASK_QUERY } from "../utils/graphql/queries";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

//компонент удаления задачи по идентификатору (получает идентификатор задачи для удаления)
export default function DeleteTask({ id }) {
  //функция вызова удаления задачи из базы данных
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [deleteFile] = useMutation(DELETE_FILE);

  var { data } = useSuspenseQuery(TASK_QUERY, { variables: { id } });
  const task = data.task;

  const { data: session } = useSession();

  const handleDeleteComment = async () => {
    const tcomments = task.comments;
    if (tcomments?.length) {
      for (let i = 0; i < tcomments.length; i++) {
        await deleteComment({ variables: { id: tcomments[i].id } });
      }
    }
  };

  const handleDeleteFile = async () => {
    const tfiles = task.files;
    if (tfiles?.length) {
      for (let j = 0; j < tfiles.length; j++) {
        await deleteFile({ variables: { id: tfiles[j].id } });
      }
    }
  };

  const handleDeleteTask = async () => {
    //e.preventDefault();

    if (!window.confirm("Вы уверены? Подтвердите действие.")) {
      return;
    }
    await handleDeleteComment();
    await handleDeleteFile();
    await deleteTask({ variables: { id: id } });
  };

  //отображение значка удаления задачи
  return (
    <>
      {session?.user.role == "manager" ? (
        <MinusCircleIcon
          className="inline-block  h-5 w-5 text-red-500"
          onClick={() => {
            handleDeleteTask();
          }}
        />
      ) : null}
    </>
  );
}
