import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/app/utils/db";
import User from "@/app/models/user";
import bcryptjs from "bcryptjs";

//параметра для авторизации. В данном случае используется авторизация на GitHub или по электронной почте и паролю

export const options = {
  providers: [
    //GitHub is an example of OAth provider
    GitHubProvider({
      profile(profile) {
        //console.log (profile);
        return {
          ...profile,
          role: profile.role ?? "user",
          id: profile.id.toString(),
          image: profile.avatar_url,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Авторизация по эл.почте и паролю",
      credentials: {
        email: {
          label: "эл.почта",
          type: "text",
          placeholder: "Введите адрес электронной почты",
        },
        password: {
          label: "Пароль",
          type: "password",
          placeholder: "Введите пароль",
        },
      },
      async authorize(credentials) {
        //функция авторизации по эл.почте и паролю
        //здесь извлекаются данные пользователя
        //Docs : https://next-auth.js.org/configuration/providers/credentials
        /*
        const user = {
          id: '50',
          name: 'Nick',
          password: '123456',
          role: 'admin',
        };
        */
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();

        if (
          credentials?.email === user.email &&
          bcryptjs.compareSync(credentials.password, user.password)
        ) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role ?? "user",
            image: user.image ?? null,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    //https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      if (user) token.image = user.image;
      return token;
    },
    // для использования роли пользователя пр авторизации она должна быть добавлена в ссессию из токена
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      if (session?.user) session.user.image = token.image;
      return session;
    },
  },
};
