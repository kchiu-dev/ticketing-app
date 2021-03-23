import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

import { errorHandler, NotFoundError } from "@kch-chiu/common";

const app = express();

const gateway = new ApolloGateway({
  serviceList: [{ name: "tickets", url: "http://localhost:4001" }],
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.applyMiddleware({ app });

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
