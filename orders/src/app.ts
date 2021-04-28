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
status: string @index(term) @upsert .
ticket: uid .

type Order {
  status
  ticket
}
`;

const server = new ApolloServer({ schema });

server.applyMiddleware({ app });

export { app, dgraphSchemaString };
