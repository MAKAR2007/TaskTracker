import { Suspense } from "react";
import ReportByUser from "./reportwrap";

export const dynamic = "force-dynamic";

//функция загрузки отчета и отображения статуса загрузки
export default function ConsolidatedReport() {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <ReportByUser />
      </Suspense>
    </>
  );
}
