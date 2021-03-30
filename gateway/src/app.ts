import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

const app = express();

const gateway = new ApolloGateway();

const server = new ApolloServer({
  gateway,
  subscriptions: false
});

app.use(cors());

server.applyMiddleware({ app });

export { app };
