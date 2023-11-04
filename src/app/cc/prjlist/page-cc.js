"use client";

import { useSession } from "next-auth/react";
import Board from "../../components/Board";
import { redirect } from "next/navigation";

// функция для проверки авторизации перед загрузкой проектной доски
export const PageWrapper = () => {
  //  функция проверки авторизации
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/cc/prjlist");
    },
  });

  if (!session?.user) return;

  //обображение экрана с проектной доской
  return (
    <>
      <Board />;
    </>
  );
};
