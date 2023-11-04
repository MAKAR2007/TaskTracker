"use client";

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "@/app/utils/graphql/mutations";
import bcryptjs from "bcryptjs";
import Logo from "@/app/components/Logo";
import RegisterForm from "@/app/components/RegisterForm";
import { PRJ_QUERY } from "@/app/utils/graphql/queries";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

//функция отображающая форму регистрации
export default function RegisterScreen() {
  const router = useRouter();
  const redirect = usePathname();
  const { data: session } = useSession();
  const user = null;

  //функция реализующая запрос к Apollo Server на добавление пользователя в базу данных
  const [addUser] = useMutation(ADD_USER, {
    refetchQueries: [{ query: PRJ_QUERY }],
  });

  //функция подготовки и реализации запроса на добавление данных пользователя (или изменение данных пользователя) в базу данных
  const submitHandler = async (
    { name, email, password, role, image, department },
    e,
  ) => {
    e.preventDefault();

    let nPassword = bcryptjs.hashSync(password);
    try {
      await addUser({
        variables: {
          name,
          password: nPassword,
          email,
          role,
          image,
          department,
        },
      });
    } catch (error) {
      console.log(error);
    }
    if (session?.user.role == "administrator") {
      router.push("/cc/teamlist");
    } else {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      router.push("/cc");
      if (result.error) {
        toast.error("Ошибка авторизации:" + result.error);
      }
    }
  };

  //фнкция проверяет авторизацию в случае ее наличия, только новый пользователь или авторизованный администратр может получить доступ к странице регистрации
  //получает данные маршрутизации и сессии
  useEffect(() => {
    if (session?.user && session?.user.role !== "administrator") {
      router.push("/cc");
    }
  }, [router, session, redirect]);

  //отображение экрана регистрационной формы
  return (
    <div className="h-screen  bg-bgmain-100">
      <div className="mx-auto  max-w-xl px-4 ">
        <div className="flex h-screen max-w-5xl flex-col items-center justify-around py-8">
          <div className="">
            <Logo />
          </div>
          <ToastContainer position="bottom-center" limit={1} />
          <h1 className="mb-4 text-xl">Зарегистрировать сотрудника</h1>
          <p className="mb-4 text-sm text-gray-400">
            Заполните поля для получения доступа к Ментору задач. Администратор
            создаст для вас учетную запись, после чего вы получите логин и
            пароль по электронной почте, указанной при регистрации.
          </p>
          <RegisterForm submitHandler={submitHandler} user={user} />
        </div>
      </div>
    </div>
  );
}
