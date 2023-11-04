//данная функция api создает ApolloServer, который обрабатывает запросы в формате graphql к базе данных

import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { prisma } from "@/app/utils/db/prisma";
import { typeDefs } from "@/app/utils/graphql/schema";
import { resolvers } from "@/app/utils/graphql/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res, prisma }),
});

export { handler as GET, handler as POST };
