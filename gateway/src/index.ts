import express from 'express';
import { json } from "body-parser";
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';

const gateway = new ApolloGateway({
  serviceList: []
});

const server = new ApolloServer({ gateway, subscriptions: false });

const app = express();
app.use(json());

server.applyMiddleware({ app, path: '/api/gateway:4000' });

console.log('Gateway listening on /gateway:4000');