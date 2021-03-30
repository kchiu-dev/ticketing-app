import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import "graphql-import-node";
import typeDefs from "../src/graphql/schema.graphql";
import resolvers from "../src/graphql/resolvers";

const app = express();

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({ schema });

app.use(cors());

server.applyMiddleware({ app });

export { app };
