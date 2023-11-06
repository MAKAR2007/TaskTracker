import { Suspense } from "react";
import TaskByUser from "./report3wrap";

export const dynamic = "force-dynamic";

//функция загрузки отчета и отображения статуса загрузки
export default function TaskReport() {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <TaskByUser />
      </Suspense>
    </>
  );
}
