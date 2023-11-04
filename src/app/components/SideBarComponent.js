"use client";
import {
  ChartPieIcon,
  Cog8ToothIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { USERS_QUERY } from "../utils/graphql/queries";

const navigation = [
  {
    name: "Доска проектов",
    href: "/cc",
    icon: HomeIcon,
  },
  { name: "Команда", href: "/cc/teamlist", icon: UsersIcon },
  { name: "Отчеты", href: "/cc/reports", icon: ChartPieIcon },
  { name: "Проекты", href: "/cc/prjlist", icon: FolderIcon },
];
const admtsks = [
  {
    id: 1,
    name: "Создать проект",
    href: "/cc/project",
    initial: "Пр",
  },

  {
    id: 2,
    name: "Создать нового пользователя",
    href: "/cc/register",
    initial: "Cс",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//компонент отображающий содержимое бокового навигатора
export default function SideBarComponent({ sidebarOpen, setSidebarOpen }) {
  const { data } = useSuspenseQuery(USERS_QUERY);
  const users = data.users;
  //console.log(users);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  let isActive = false;

  //экран содержимого бокового навигатора
  return (
    <>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 py-4 pb-2">
        <Logo />
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  pathname == item.href
                    ? (isActive = true)
                    : (isActive = false);

                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          isActive
                            ? "bg-gray-50 text-accent-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-accent-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                        )}
                      >
                        <item.icon
                          className={classNames(
                            isActive
                              ? "text-accent-600"
                              : "text-gray-400 group-hover:text-accent-600",
                            "h-6 w-6 shrink-0",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li>
              {session?.user.role == "administrator" ? (
                <>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Административная панель
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {admtsks.map((admtsk) => (
                      <li key={admtsk.name}>
                        <a
                          href={admtsk.href}
                          className={classNames(
                            admtsk.current
                              ? "bg-gray-50 text-accent-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-accent-600",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                          )}
                        >
                          <span
                            className={classNames(
                              admtsk.current
                                ? "border-accent-600 text-accent-600"
                                : "border-gray-200 text-gray-400 group-hover:border-accent-600 group-hover:text-accent-600",
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
                            )}
                          >
                            {admtsk.initial}
                          </span>
                          <span className="truncate">{admtsk.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </li>
          </ul>
        </nav>
        {session && (
          <button
            onClick={() => {
              let pUrl =
                "/cc/user/" +
                users.filter((user) => user.email == session?.user.email)[0].id;
              router.push(pUrl);
              setSidebarOpen(false);
            }}
            className="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
          >
            <Cog8ToothIcon className="h-8 w-8 text-gray-500" />
            <span>Редактировать профиль</span>
          </button>
        )}
      </div>
    </>
  );
}
