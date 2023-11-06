"use client";
import { Suspense, useEffect } from "react";
//import { signIn } from "next-auth/react";
//import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import bcryptjs from "bcryptjs";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { UPDATE_USER } from "@/app/utils/graphql/mutations";
import { USER_QUERY } from "@/app/utils/graphql/queries";
import RegisterForm from "@/app/components/RegisterForm";

export const dynamic = "force-dynamic";

//функция редактирования пользователя по идентификатору id
//id - идентификатор пользователя для редактирования
export default function EditUser({ params: { id } }) {
  //загрузка данных ползователя по идентификатору из базы данных
  const { data } = useSuspenseQuery(USER_QUERY, { variables: { id } });
  const user = data.user;
  const router = useRouter();

  //функция записи обновленных данных  пользователя в базу данных
  const [updateUser] = useMutation(UPDATE_USER);

  //функция подготовки данных для записи в базу данных
  const submitHandler = async (
    { name, email, password, role, image, department },
    e,
  ) => {
    e.preventDefault();
    let nPassword = bcryptjs.hashSync(password);
    try {
      await updateUser({
        variables: {
          id: user.id,
          name,
          password: nPassword,
          email,
          role,
          image,
          department,
        },
      });

      router.push("/cc/teamlist");
    } catch (error) {
      console.log(error);
    }
  };

  //функция обображения экрана редактирования данных пользователя
  return (
    <Suspense fallback={<>Loading...</>}>
      <div className=" mx-auto h-screen max-w-5xl bg-bgmain-100   2xl:ml-72 2xl:max-w-full">
        <div className="mx-auto max-w-screen-md py-10">
          <div>
            <ToastContainer position="bottom-center" limit={1} />
            <h1 className="flex flex-col items-center justify-around pb-3 text-2xl font-semibold">
              Редактирование профиля
            </h1>
            <p className=" text-center text-gray-600">
              Отредактируйте требуемые поля
            </p>
          </div>{" "}
        </div>
        <div className=" overflow-x-auto bg-bgmain-100">
          <RegisterForm submitHandler={submitHandler} user={user} />
        </div>
      </div>
    </Suspense>
  );
}
