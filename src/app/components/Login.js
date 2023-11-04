"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
//компонент отображения кнопки войти и имени пользователя
export default function Login() {
  const { status, data: session } = useSession();
  return (
    <>
      {status === "loading" ? (
        <span className=" block px-3 py-2 lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900">
          Загрузка...
        </span>
      ) : session?.user ? (
        <button
          type="button"
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          className="block  sm:flex lg:mx-2  lg:font-semibold lg:leading-6 lg:text-gray-900"
        >
          {session.user.image && (
            <Image
              src={session.user.image}
              width="36"
              height="36"
              className=" mx-2  inline-block rounded-full "
              alt="another image"
            />
          )}
          <span className=" pr-2 pt-2 lg:block ">
            {session?.user?.name}&nbsp;
          </span>{" "}
          <span className="block pt-2 lg:inline-block">
            &nbsp;&nbsp;&rarr;&nbsp;Выйти&nbsp;
          </span>
        </button>
      ) : (
        <a
          href="/login"
          className="block px-3 py-2 lg:mx-2 lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
        >
          <span className="pr-2" aria-hidden="true">
            &rarr;
          </span>
          Войти
        </a>
      )}
    </>
  );
}
