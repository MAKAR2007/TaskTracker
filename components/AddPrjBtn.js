"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddPrjBtn() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <>
      {session && session.user.role == "administrator" ? (
        <button
          onClick={() => router.push("/cc/project")}
          className="bg-accent-600 focus-visible:outline-accent-600 hover:bg-accent-500 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Создать проект +
        </button>
      ) : null}
    </>
  );
}
