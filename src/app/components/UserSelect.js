"use client";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

//компонент выпадающего списка пользователей для меню
// получает список пользователей, указатель на выбранного пользователя, функцию управления выбором, функцию отслеживания изменения и параметр изменения пользователя задачи
export default function UserSelect({
  people,
  setSharedState,
  sharedState,
  isChanged,
  setIsChanged,
}) {
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <Listbox
          value={sharedState}
          onChange={(e) => {
            setSharedState(e);
            setIsChanged(true);
          }}
        >
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button
                  className={`${
                    session.user.role == "manager" ||
                    session.user.role == "administrator"
                      ? "bg-white focus:ring-2 focus:ring-accent-600"
                      : "bg-bgmain-100 focus:ring-gray-300 "
                  } relative  w-full cursor-default rounded-md py-1.5  pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none  focus:ring-accent-600  sm:text-sm sm:leading-6`}
                >
                  <span className="block truncate">{sharedState.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                {(session && session.user.role == "manager") ||
                session.user.role == "administrator" ? (
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {people.map((person) => (
                        <Listbox.Option
                          key={person.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-accent-600 text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9",
                            )
                          }
                          value={person}
                        >
                          {({ sharedState, active }) => (
                            <>
                              <span
                                className={classNames(
                                  sharedState ? "font-semibold" : "font-normal",
                                  "block truncate",
                                )}
                              >
                                {person.name}
                              </span>

                              {sharedState ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-accent-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                ) : null}
              </div>
            </>
          )}
        </Listbox>
      )}
    </>
  );
}
