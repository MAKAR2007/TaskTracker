"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

//Компонент кнопки регистрации пользователя для администратора и ссылки регистрации для домашней страницы
export default function Signup() {
  const { data: session } = useSession();

  return (
    <>
      {!session ? (
        <div className="mb-4 mt-16  max-w-screen-md">
          Если у вас еще нет учетной записи или логина для доступа к нашим
          сервисам, зарегистрируйтесь, перейдя по ссылке
          <p>
            <Link className="text-accent-600" href={`/cc/register`}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      ) : (
        <div className=" invisible mb-4 mt-16  max-w-screen-md">
          Если у вас еще нет учетной записи или логина для доступа к нашим
          сервисам, зарегистрируйтесь, перейдя по ссылке
          <p>
            <Link className="text-accent-600" href={`/cc/register`}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
