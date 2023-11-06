"use client";
import { MinusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";

import { PRJ_QUERY, PRJ_TREE_QUERY } from "../utils/graphql/queries";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import {
  DELETE_COMMENT,
  DELETE_FILE,
  DELETE_PROJECT,
  DELETE_TASK,
} from "../utils/graphql/mutations";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

//функция удаления проекта по его идентификатору (на входе идентификатор проекта для удаления)
export default function DeleteProject({ id }) {
  //функция вызова удаления задачи из базы данных
  const [deleteTask] = useMutation(DELETE_TASK);
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [deleteFile] = useMutation(DELETE_FILE);

  var { data } = useSuspenseQuery(PRJ_TREE_QUERY, { variables: { id } });
  const project = data.project;

  //вызов функции удаления проекта из базы данных
  const [deleteProject] = useMutation(DELETE_PROJECT, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });

  const { data: session } = useSession();
  const handleDeleteComment = async (tcomments) => {
    //const tcomments = task.comments;
    if (tcomments?.length) {
      for (let i = 0; i < tcomments.length; i++) {
        await deleteComment({ variables: { id: tcomments[i].id } });
      }
    }
  };

  const handleDeleteFile = async (tfiles) => {
    //const tfiles = task.files;
    if (tfiles?.length) {
      for (let j = 0; j < tfiles.length; j++) {
        await deleteFile({ variables: { id: tfiles[j].id } });
      }
    }
  };

  const handleDeleteTask = async (ptask) => {
    var tcomments = ptask.comments;
    var tfiles = ptask.files;
    await handleDeleteComment(tcomments);
    await handleDeleteFile(tfiles);
    await deleteTask({ variables: { id: ptask.id } });
  };

  const handleDeleteProject = async () => {
    //e.preventDefault();

    if (!window.confirm("Вы уверены? Подтвердите действие.")) {
      return;
    }

    const ptasks = project.tasks;
    if (ptasks?.length) {
      for (let k = 0; k < ptasks.length; k++) {
        let ptask = ptasks[k];
        await handleDeleteTask(ptask);
      }
    }

    await deleteProject({ variables: { id: id } });
  };

  //экран отображения кнопки удаления проекта
  return (
    <>
      {session?.user.role == "administrator" ? (
        <TrashIcon
          className="mx-2  inline-block h-6 w-6 text-red-500"
          onClick={() => {
            handleDeleteProject();
          }}
        />
      ) : null}
    </>
  );
}
