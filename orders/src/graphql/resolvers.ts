import { Resolvers, OrderStatus, Order } from "./types";
import { OrderDbObject } from "../datasources/mongodb/types";
import { ObjectID } from "mongodb";
import {
  ordersMongoClientWrapper,
  ticketsMongoClientWrapper,
} from "../MongoClientWrapper";
import { UserInputError } from "apollo-server-express";

const getOrdersCollection = () =>
  ordersMongoClientWrapper.database.collection<OrderDbObject>("orders");

const getTicketsCollection = () =>
  ticketsMongoClientWrapper.database.collection("tickets");

const fromDbObject = (dbObject: OrderDbObject): Order => ({
  orderId: dbObject._id.toHexString(),
  status: dbObject.status as OrderStatus,
  ticket: dbObject.ticketId as any,
});

const resolvers: Resolvers = {
  Order: {
    __resolveReference: async ({ orderId }) => {
      const dbObject = (await getOrdersCollection().findOne({
        _id: ObjectID.createFromHexString(orderId),
      })) as OrderDbObject;
      return fromDbObject(dbObject);
    },
    //@ts-ignore
    ticket: ({ ticket }: any) => {
      return { __typename: "Ticket", ticketId: ticket };
    },
  },
  Query: {
    allOrders: async () =>
      await getOrdersCollection().find().map(fromDbObject).toArray(),
    getOrder: async (_: any, { orderId }) => {
      const dbObject = (await getOrdersCollection().findOne({
        _id: ObjectID.createFromHexString(orderId),
      })) as OrderDbObject;
      return fromDbObject(dbObject);
    },
  },
  Mutation: {
    createOrder: async (_: any, { data }) => {
      const { ticketId } = data;

      console.log(`ticketObjectID is: ${ObjectID.createFromHexString(ticketId)}`);
      
      if (!ObjectID.createFromHexString(ticketId)) {
        throw new UserInputError("Invalid ticketId");
      }

      try {
        await getTicketsCollection().findOne({
          _id: ObjectID.createFromHexString(ticketId),
        });

        const dataEntry: Omit<OrderDbObject, "_id"> = {
          status: "CREATED",
          ticketId,
        };

        const document = await getOrdersCollection().insertOne(dataEntry);
        return fromDbObject({
          _id: document.insertedId,
          status: "CREATED",
          ticketId,
        });
      } catch {
        throw new UserInputError("Invalid ticketId");
      }
    },
    cancelOrder: async (_: any, { orderId }) => {
      try {
        const result = await getOrdersCollection().findOneAndUpdate(
          {
            _id: ObjectID.createFromHexString(orderId),
          },
          {
            $set: { status: "CANCELLED" },
          },
          {
            returnOriginal: false,
          }
        );

        return fromDbObject(result.value as OrderDbObject);
      } catch {
        throw new UserInputError("Invalid orderId");
      }
    },
    completeOrder: async (_: any, { orderId }) => {
      try {
        const result = await getOrdersCollection().findOneAndUpdate(
          {
            _id: ObjectID.createFromHexString(orderId),
          },
          {
            $set: { status: "COMPLETE" },
          },
          {
            returnOriginal: false,
          }
        );

        return fromDbObject(result.value as OrderDbObject);
      } catch {
        throw new UserInputError("Invalid orderId");
      }
    },
  },
};

export default resolvers;
