"use client";
import { createContext, useContext, useState } from "react";

const Context = createContext();

//компонент "памяти" выбранного проекта для использования в различных не иерархических компонентах
export function SelectedProvider({ children }) {
  const [selected, setSelected] = useState();

  return (
    <Context.Provider value={[selected, setSelected]}>
      {children}
    </Context.Provider>
  );
}

//конфигурируемая функция доступа к компоненту "памяти" ( Hook)
export function useSelectedContext() {
  return useContext(Context);
}
