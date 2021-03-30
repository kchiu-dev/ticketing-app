import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

import { errorHandler, NotFoundError } from "@kch-chiu/common";

const app = express();

const gateway = new ApolloGateway();

const server = new ApolloServer({
  gateway,
  subscriptions: false
});

app.use(cors());

app.all("*", (_:any, __: any) => {
  throw new NotFoundError();
});

app.use(errorHandler);

server.applyMiddleware({ app });

export { app };
