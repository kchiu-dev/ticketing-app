import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import "graphql-import-node";
import typeDefs from "../src/graphql/schema.graphql";
import resolvers from "../src/graphql/resolvers";
import { print } from "graphql";

const app = express();

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

const schemaString = print(typeDefs);

const server = new ApolloServer({ schema });

server.applyMiddleware({ app });

export { app, schemaString };
