"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

//компонент кнопки регистрации и создания пользователя
export default function AddUserBtn() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      {session && session.user.role == "administrator" ? (
        <button
          onClick={() => router.push("/cc/register")}
          className="rounded-md bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
        >
          Создать пользователя +
        </button>
      ) : null}
    </>
  );
}
