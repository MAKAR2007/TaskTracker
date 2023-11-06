import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

//компонент формы регистрации/создания и редактирования пользователя
// принимает функцию обработки регистрации и данные пользователя, использующиеся в случае сценария редактирования
function RegisterForm({ submitHandler, user }) {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onTouched", defaultValues: { url: "https://" } });

  //функция подготовки данных и экрана для сценария редактирования существующего пользователя
  //получает параметры текущей сессии, данные пользователя и функцию установки значения полей формы
  useEffect(() => {
    if (session && user) {
      let str = String(user.role).toLowerCase();
      setValue("name", user.name);
      setValue("image", user.image);
      setValue("department", user.department);
      setValue("role", str);
      setValue("email", user.email);
      setValue("password", user.password);
    }
  }, [session, setValue, user]);

  //экран формы регистрации
  return (
    <form
      className="mx-auto w-full max-w-screen-md  "
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className=" bg-white p-6 ">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Имя
          </label>
          <input
            type="text"
            name="name"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
            id="name"
            autoFocus
            {...register("name", {
              required: "Введите имя сотрудника",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="department"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Отдел
          </label>
          <input
            type="text"
            name="department"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
            id="department"
            {...register("department", {
              required: "Введите название отдела",
            })}
          />
          {errors.department && (
            <div className="text-red-500">{errors.department.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="url"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Аватар
          </label>
          <input
            type="url"
            {...register("image", {
              required: "Введите ссылку на фото сотрудника",
              pattern: {
                value:
                  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})+$/i,
                message: "Пожалуйста, введите корректный URL",
              },
            })}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
            id="image"
          />
          {errors.image && (
            <div className="text-red-500">{errors.image?.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Роль
          </label>
          {!session || session?.user.role == "administrator" ? (
            <select
              type="text"
              id="role"
              name="role"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
              //defaultValue="role"
              //onChange={(e) => setPriority(e.target.value)}
              {...register("role")}
            >
              <option key="user" value="user">
                user
              </option>
              <option key="manager" value="manager">
                manager
              </option>
              <option key="administrator" value="administrator">
                administrator
              </option>
            </select>
          ) : (
            <select
              type="text"
              id="role"
              name="role"
              disabled
              className="mt-2 block w-full rounded-md border-0 bg-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
              //defaultValue="role"
              //onChange={(e) => setPriority(e.target.value)}
              {...register("role")}
            >
              <option key="user" value="user">
                user
              </option>
              <option key="manager" value="manager">
                manager
              </option>
              <option key="administrator" value="administrator">
                administrator
              </option>
            </select>
          )}
          {errors.role && (
            <div className="text-red-500">{errors.role.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email
          </label>
          {!session || session?.user.role == "administrator" ? (
            <input
              type="email"
              {...register("email", {
                required: "Введите адрес электронной почты",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message:
                    "Пожалуйста, введите корректный адрес электронной почты",
                },
              })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
              id="email"
              email="email"
            ></input>
          ) : (
            <input
              type="email"
              {...register("email", {
                required: "Введите адрес электронной почты",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message:
                    "Пожалуйста, введите корректный адрес электронной почты",
                },
              })}
              className="mt-2 block w-full rounded-md border-0 bg-gray-300 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
              id="email"
              email="email"
              disabled
            ></input>
          )}
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Пароль
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Пожалуйста введите пароль из 8ми и более символов",
              minLength: {
                value: 8,
                message:
                  "Пароль должен состоять из 8ми и более символов, включая буквы, цифры и хотя бы 1 специальный символ",
              },
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/i,
                message: "Пожалуйста, введите корректный пароль",
              },
            })}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
            id="password"
          ></input>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Повторите пароль
          </label>
          <input
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent-600 sm:text-sm sm:leading-6"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message:
                  "Повторно введите пароль, состоящий из 6ти и более символов",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">Пароль не совпадает</div>
            )}
        </div>
        <div className="mb-4">
          <button className="w-full rounded-md bg-accent-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600">
            Сохранить
          </button>
        </div>
      </div>
    </form>
  );
}

RegisterForm.propTypes = {};

export default RegisterForm;
