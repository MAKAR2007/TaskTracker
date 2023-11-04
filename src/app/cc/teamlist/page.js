import { Suspense } from "react";
import TeamWrap from "./teamwrap";

export const dynamic = "force-dynamic";

//внешняя функция отображающая статус загрузки списка сотрудников
export default function Team() {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <TeamWrap />
      </Suspense>
    </>
  );
}
