"use client";
// this is for client component implementation only
import { SessionProvider } from "next-auth/react";

//компонент авторизации для всех страниц сайта
export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
