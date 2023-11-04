//функция представляет собой точку api для авторизации с опцими из соответсвующего файла

import NextAuth from "next-auth";
import { options } from "./options";

//в параетрах опций задается тип и настроки авторизации
const handler = NextAuth(options);

export { handler as GET, handler as POST };
