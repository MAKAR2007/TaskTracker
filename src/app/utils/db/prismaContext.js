//утилита для предоставленя доступа к схеме данных компонентам сервера и клиента Apollo

import prisma from "@/app/utils/db/prisma";

export async function createContext(req, res) {
  return {
    prisma,
  };
}
