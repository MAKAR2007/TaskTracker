import { Suspense } from "react";
import PrjWrap from "./prjwrap";

export const dynamic = "force-dynamic";

//функция  загрузки домашней страницы со списком проектов
export default function Projects() {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <PrjWrap />
      </Suspense>
    </>
  );
}
