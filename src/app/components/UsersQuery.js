import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { USERS_QUERY } from "../utils/graphql/queries";
//компонент загрузки пользователей из базы данных
export const UsersQuery = () => {
  const { data } = useSuspenseQuery(USERS_QUERY);
  const users = data.users;
  return users;
};
