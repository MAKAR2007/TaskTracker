"use client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { TASKS_QUERY } from "../utils/graphql/queries";

//компонент загрузки списка задач из базы данных
export const TasksQuery = () => {
  const { data } = useSuspenseQuery(TASKS_QUERY);
  const tasks = data.tasks;
  return tasks;
};
