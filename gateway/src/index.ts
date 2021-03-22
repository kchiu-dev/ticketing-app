import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

const app = express();

const gateway = new ApolloGateway({
  serviceList: [{ name: "tickets", url: "http://tickets-srv:3000" }],
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.applyMiddleware({ app });

app.listen(4000, () => {
  console.log("Listening on port 4000!");
});
