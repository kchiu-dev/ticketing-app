import { Resolvers, OrderStatus, Order } from "./types";
import { OrderDbObject } from "../datasources/mongodb/types";
import { ObjectID } from "mongodb";
import { mongodbWrapper } from "../mongodbWrapper";

const getCollection = () =>
  mongodbWrapper.database.collection<OrderDbObject>("orders");

const fromDbObject = (dbObject: OrderDbObject): Order => ({
  orderId: dbObject._id.toHexString(),
  status: dbObject.status as OrderStatus,
  ticket: dbObject.ticket as any,
});

const resolvers: Resolvers = {
  Order: {
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
      const { ticket }: any = data;

      const dataEntry: Omit<OrderDbObject, "_id"> = {
        status: "CREATED",
        ticket,
      };

      const document = await getCollection().insertOne(dataEntry);
      return fromDbObject({
        _id: document.insertedId,
        status: "CREATED",
        ticket,
      });
    },
    cancelOrder: async (_: any, { orderId }) => {
      const result = await getCollection().findOneAndUpdate(
        {
          _id: ObjectID.createFromHexString(orderId),
        },
        { $set: { status: "CANCELLED" } },
        {
          returnOriginal: false,
        }
      );

      return fromDbObject(result.value as OrderDbObject);
    },
  },
};

export default resolvers;
