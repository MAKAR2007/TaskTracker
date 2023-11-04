//******************* */
//не используется на данном этапе - подготовлена для развития функционала проекта
//******************* */

// фнукция обмена данными с базой данных на уровне серверных компонентов
//планируется к использованию в дальнейшем при увеличении количества запросов к данным со стороны других компонентов (не из пользовательского интерфейса)
import { getClient } from "@/app/utils/graphql/RSC/client";
import { PRJ_QUERY } from "../utils/graphql/queries";

import { ApolloWrapper } from "../utils/graphql/CC/ApolloWrapper";
import Board from "../components/Board";

export const dynamic = "force-dynamic";

export default async function rsc() {
  const { data } = await getClient().query({
    query: PRJ_QUERY,
  });
  const allProjects = data.projects;
  const allUsers = data.users;

  return (
    <ApolloWrapper>
      <div>RSC</div>
      <Board allProjects={allProjects} allUsers={allUsers} />
    </ApolloWrapper>
  );
}
