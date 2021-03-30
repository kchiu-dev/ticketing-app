import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import "graphql-import-node";
import typeDefs from "../src/graphql/schema.graphql";
import resolvers from "../src/graphql/resolvers";

import { errorHandler, NotFoundError } from "@kch-chiu/common";

const app = express();

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({ schema, introspection: true, playground: true });

app.use(cors());

server.applyMiddleware({ app });

app.all("*", (_:any, __:any) => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
