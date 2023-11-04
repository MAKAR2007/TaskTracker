import { Suspense } from "react";
import ReportByUserPrj from "./report2wrap";
import { useSession } from "next-auth/react";

export const dynamic = "force-dynamic";
//функция загрузки отчета и отображения статуса загрузки
export default function ConsolidatedReportPrj() {
  return (
    <>
      <Suspense fallback={<>Loading...</>}>
        <ReportByUserPrj />
      </Suspense>
    </>
  );
}
