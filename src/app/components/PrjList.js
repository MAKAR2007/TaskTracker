"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//Компонент кнопки перехода к проектам с домашнего экрана при наличии авторизации
export default function PrjList() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <button
          onClick={() => router.push("/cc")}
          className="rounded-md bg-accent-600  px-3  py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
        >
          Перейти к проектам
        </button>
      ) : null}
    </>
  );
}
