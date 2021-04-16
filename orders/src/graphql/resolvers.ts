import { Resolvers, OrderStatus, Order } from "./types";
import { OrderDbObject } from "../datasources/mongodb/types";
import { ObjectID } from "mongodb";
import { mongodbWrapper } from "../mongodbWrapper";
import { UserInputError } from "apollo-server-express";

const getCollection = () =>
  mongodbWrapper.database.collection<OrderDbObject>("orders");

const fromInput = (input: string): Omit<Order, "orderId" | "status"> => ({
  ticket: input as any,
});

const fromDbObject = (dbObject: OrderDbObject): Order => ({
  orderId: dbObject._id.toHexString(),
  status: dbObject.status as OrderStatus,
  ticket: dbObject.ticketId as any,
});

const resolvers: Resolvers = {
  Order: {
    __resolveReference: async ({ orderId }) => {
      const dbObject = (await getCollection().findOne({
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
      await getCollection().find().map(fromDbObject).toArray(),
    getOrder: async (_: any, { orderId }) => {
      const dbObject = (await getCollection().findOne({
        _id: ObjectID.createFromHexString(orderId),
      })) as OrderDbObject;
      return fromDbObject(dbObject);
    },
  },
  Mutation: {
    createOrder: async (_: any, { data }) => {
      const { ticketId } = data;

      const { ticket } = fromInput(ticketId);

      if (!ticket) {
        throw new UserInputError("Invalid ticketId");
      }

      const dataEntry: Omit<OrderDbObject, "_id"> = {
        status: "CREATED",
        ticketId,
      };

      const document = await getCollection().insertOne(dataEntry);
      return fromDbObject({
        _id: document.insertedId,
        status: "CREATED",
        ticketId,
      });
    },
    cancelOrder: async (_: any, { orderId }) => {
      const result = await getCollection().findOneAndUpdate(
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
    },
    completeOrder: async (_: any, { orderId }) => {
      const result = await getCollection().findOneAndUpdate(
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
    },
  },
};

export default resolvers;
