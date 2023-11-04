import SideBar from "../components/Sidebar";
import { ApolloWrapper } from "../utils/graphql/CC/ApolloWrapper";

//функция layout задающая общие параметры для всех страниц раздела
//в качестве параметра получает странцы раздела
export default async function Layout({ children }) {
  return (
    <ApolloWrapper>
      <SideBar />
      {children}
    </ApolloWrapper>
  );
}
