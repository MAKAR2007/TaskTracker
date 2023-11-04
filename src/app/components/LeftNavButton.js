import { Bars3Icon } from "@heroicons/react/24/outline";
import React from "react";
//компонент отображения кнопки открытия навигатора для маленьких экранов
export default function LeftNavButton() {
  return (
    <button
      type="button"
      className="-m-2.5 p-2.5 text-accent-600 2xl:invisible"
      onClick={() => setSidebarOpen(true)}
    >
      <span className="sr-only">Открыть навигацию слева</span>
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}
