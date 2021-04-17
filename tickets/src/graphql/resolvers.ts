import { Resolvers, Ticket } from "./types";
import { TicketDbObject } from "../datasources/mongodb/types";
import { ObjectID } from "mongodb";
import { ticketsMongoClientWrapper } from "../MongoClientWrapper";
import { UserInputError } from "apollo-server-express";

const getTicketsCollection = () =>
  ticketsMongoClientWrapper.database.collection<TicketDbObject>("tickets");

const fromDbObject = (dbOjbect: TicketDbObject): Ticket => ({
  ticketId: dbOjbect._id.toHexString(),
  title: dbOjbect.title,
  price: dbOjbect.price,
});

const resolvers: Resolvers = {
  Ticket: {
    __resolveReference: async ({ ticketId }) => {
      const dbObject = (await getTicketsCollection().findOne({
        _id: ObjectID.createFromHexString(ticketId),
      })) as TicketDbObject;
      return fromDbObject(dbObject);
    },
  },
  Query: {
    allTickets: async () =>
      await getTicketsCollection().find().map(fromDbObject).toArray(),
    getTicket: async (_: any, { ticketId }) => {
      const dbObject = (await getTicketsCollection().findOne({
        _id: ObjectID.createFromHexString(ticketId),
      })) as TicketDbObject;
      return fromDbObject(dbObject);
    },
  },
  Mutation: {
    createTicket: async (_: any, { data }) => {
      const { title, price } = data;

      if (price <= 0) {
        throw new UserInputError("Price must be greater than 0");
      }

      const dataEntry: Omit<TicketDbObject, "_id"> = {
        title,
        price,
      };

      const document = await getTicketsCollection().insertOne(dataEntry);
      return fromDbObject({
        _id: document.insertedId,
        ...data,
      });
    },
    updateTicket: async (_: any, { ticketId, data }) => {
      try {
        const result = await getTicketsCollection().findOneAndUpdate(
          {
            _id: ObjectID.createFromHexString(ticketId),
          },
          { $set: data },
          {
            returnOriginal: false,
          }
        );

        return fromDbObject(result.value as TicketDbObject);
      } catch {
        throw new UserInputError("Invalid ticketId");
      }
    },
  },
};

export default resolvers;
