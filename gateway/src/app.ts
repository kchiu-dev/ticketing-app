import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

const app = express();

const gateway = new ApolloGateway();

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app });

export { app };
