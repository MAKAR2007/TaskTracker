"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import Logo from "./Logo";
import Login from "./Login";

import SideBarComponent from "./SideBarComponent";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

//компонент бокового навигатора, вызвающий в частности элементы и компоненты этого навигатора из компонента SideBarComponents
export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <div className="">
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50 2xl:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button
                          type="button"
                          className="-m-2.5 p-2.5"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <SideBarComponent
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden 2xl:fixed 2xl:inset-y-0 2xl:z-50 2xl:flex 2xl:w-72 2xl:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <SideBarComponent />
          </div>

          <div className="sticky top-0 z-40 mx-auto flex max-w-5xl items-center justify-between gap-x-6 bg-white px-4 py-4  sm:px-6 2xl:max-w-full 2xl:shadow-none ">
            <div>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-accent-600 2xl:invisible"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Открыть навигацию слева</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="2xl:hidden">
              <Logo />
            </div>
            <div className="flex items-center">
              <Login />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
