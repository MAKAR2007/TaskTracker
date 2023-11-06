"use client";

import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getError } from "@/app/utils/error";

import { usePathname, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import Signup from "../components/Signup";
import Logo from "../components/Logo";

//функция авторизации
export default function LoginScreen() {
  const router = useRouter();
  const redirect = usePathname();
  const { data: session } = useSession();

  //функция предварительной проверки наличия авторизаци для исключения повтороной авторизации
  // использует параметра маршрутизатора и сессии
  useEffect(() => {
    if (session?.user) {
      //console.log(redirect);
      router.push(redirect.startsWith("/login") ? "/cc" : redirect);
    }
  }, [redirect, router, session]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    //console.log(email, password);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        if (result.error == "CredentialsSignin") {
          toast.error("Неправильный пароль");
        } else {
          if (result.error.includes("null")) {
            toast.error("Пользователь не существует");
          } else {
            toast.error("Ошибка соединения : " + result.error);
          }
        }
      }
    } catch (err) {
      toast.error("Произошла ошибка : " + getError(err));
    }
  };

  // отображения экрана авторизации
  return (
    <div className="p h-screen bg-bgmain-100">
      <div className="mx-auto  max-w-xl px-4 ">
        <div className="flex h-screen max-w-5xl flex-col items-center justify-around py-8">
          <div className="">
            <Logo />
          </div>

          <ToastContainer position="bottom-center" limit={1} />
          <h1 className="mb-4 text-xl">Вход в учетную запись</h1>
          <form
            className="w-full max-w-screen-md "
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className=" bg-white p-6 ">
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Адрес эл. почты
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Пожалуйста, введите почту",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                      message: "Пожалуйста, введите корректную почту",
                    },
                  })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                  id="email"
                  autoFocus
                ></input>
                {errors.email && (
                  <div className="text-red-500">{errors.email.message}</div>
                )}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Пароль
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Пожалуйста, введите пароль",
                    minLength: {
                      value: 6,
                      message: "пароль должен быть длиннее 8 символов",
                    },
                  })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
                  id="password"
                  autoFocus
                ></input>
                {errors.password && (
                  <div className="text-red-500 ">{errors.password.message}</div>
                )}
              </div>
              <div className="mb-6 ">
                <button className="w-full rounded-md  bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600">
                  Войти
                </button>
              </div>
            </div>
          </form>
          <Signup />
        </div>
      </div>
    </div>
  );
}
