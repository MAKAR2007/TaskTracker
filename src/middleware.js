//Without a defined matcher, this one line applies next-auth
//to the entire project
//commented when adding role based authentication
//export { default } from 'next-auth/middleware';

//next is for role based authentication
//ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/************ */
//функция управления авторизацией
// подготовлена для последующего применения и обработки запросов к разделам сайта предполагающим определенные урвони доступа
/************ */

export default withAuth(
  //'withAuth' augments your 'Request' with the user's token.
  function midleware(request) {
    if (
      request.nextUrl.pathname.startsWith("/cc/admin") &&
      request.nextauth.token?.role !== "administrator"
    ) {
      return NextResponse.rewrite(new URL("/cc/denied", request.url));
    }
    /*
    if (
      request.nextUrl.pathname.startsWith("/cc") &&
      request.nextauth.token?.role !== "admin" &&
      request.nextauth.token?.role !== "manager"
    ) {
      return NextResponse.rewrite(
        new URL("/templateNextAuth/denied", request.url),
      );
    }*/
  },
  {
    callbacks: {
      //authorized: ({ token }) => token?.role === 'admin', //its limited as its true only if admin
      authorized: ({ token }) => !!token, //now we try to ensure token exists
    },
  },
);

//pages inside matcher can be viewed only if conditions above are met

//Applies next-auth only to matshing routes - can be regex
//Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/cc/admin"],
};
