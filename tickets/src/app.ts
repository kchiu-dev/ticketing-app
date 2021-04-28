import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildFederatedSchema } from "@apollo/federation";
import "graphql-import-node";
import * as typeDefs from "../src/graphql/schema.graphql";
import resolvers from "../src/graphql/resolvers";
import * as dgraphSchema from "../src/dgraph/dgraph-schema.graphql";
import { print } from "graphql";

const app = express();

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

const dgraphSchemaString = `
title: string @index(term) @upsert .
price: float @index(float) @upsert .

type Ticket {
  title: String
  price: Float
}
`;

const server = new ApolloServer({ schema });

server.applyMiddleware({ app });

export { app, dgraphSchemaString };
