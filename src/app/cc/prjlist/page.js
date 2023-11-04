import { Suspense } from "react";
import { PageWrapper } from "./page-cc";

export const dynamic = "force-dynamic";

//внешняя функция для загрузки доски проекта и отражения статуса загрузки (Loading...) до момента подготовки данных
export default async function cc() {
  //отображение экрана загрузки страницы с доской проекта
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <PageWrapper />
      </Suspense>
    </>
  );
}
