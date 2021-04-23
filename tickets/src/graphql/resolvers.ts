import { Resolvers, Ticket } from "./types";
import { dgraphClientWrapper } from "../DgraphClientWrapper";
import { UserInputError } from "apollo-server-express";
import { Txn } from "dgraph-js-http";

interface TicketDbObject {
  uid: string;
  title: string;
  price: number;
}

const getTransaction = (forRead: boolean): Txn =>
  forRead
    ? dgraphClientWrapper.client.newTxn({ readOnly: true, bestEffort: true })
    : dgraphClientWrapper.client.newTxn();

const fromDbObject = (dbObject: TicketDbObject): Ticket => ({
  ticketId: dbObject.uid,
  title: dbObject.title,
  price: dbObject.price,
});

const resolvers: Resolvers = {
  Ticket: {
    __resolveReference: async ({ ticketId }) => {
      // Create a new transaction.
      const forRead = true;
      const txn = getTransaction(forRead);

      let ticket;

      try {
        // Create a query.
        const query = `
        {
          getTicket(ticketId: ${ticketId}) {
            ticketId
            title
            price
          }
        }
        `;

        // Run query and get ticket.
        const res = await txn.query(query);
        ticket = <TicketDbObject>res.data;

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up transaction.
        await txn.discard();
      }

      return fromDbObject({
        ...ticket,
      });
    },
  },
  Query: {
    allTickets: async () => {
      // Create a new transaction.
      const forRead = true;
      const txn = getTransaction(forRead);

      let allTickets;

      try {
        // Create a query.
        const query = `
        {
          dbAllTickets(func: has(uid)) {
            uid
            title
            price
          }
        }
        `;

        // Run query and get all tickets.
        const res = await txn.query(query);
        allTickets = <TicketDbObject[]>res.data;

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }
      return allTickets.map(fromDbObject);
    },
    getTicket: async (_: any, { ticketId }) => {
      // Create a new transaction.
      const forRead = true;
      const txn = getTransaction(forRead);

      let ticket;

      try {
        // Create a query.
        const query = `
        {
          dbTicket(func: eq(uid, ${ticketId})) {
            uid
            title
            price
          }
        }
        `;

        // Run query and get ticket.
        const res = await txn.query(query);
        ticket = <TicketDbObject>res.data;

        if (!ticket) {
          throw new UserInputError("Invalid ticketId");
        }

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return fromDbObject(ticket);
    },
  },
  Mutation: {
    createTicket: async (_: any, { data }) => {
      // Create a new transaction.
      const forRead = false;
      const txn = getTransaction(forRead);

      let ticketId;

      const { price } = data;

      if (price <= 0) {
        throw new UserInputError("Price must be greater than 0");
      }

      try {
        // Run mutation and get ticketId.
        const assigned = await txn.mutate({
          setJson: data,
        });
        ticketId = assigned.data.uids["blank-0"];

        console.log("All created nodes (map from blank node names to uids):");
        Object.keys(assigned.data.uids).forEach((key) =>
          console.log(`${key} => ${assigned.data.uids[key]}`)
        );
        console.log();

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return fromDbObject({
        uid: ticketId,
        ...data,
      });
    },
    updateTicket: async (_: any, { ticketId, data }) => {
      // Create a new transaction.
      const forRead = false;
      const txn = getTransaction(forRead);

      const { price } = data;

      if (price <= 0) {
        throw new UserInputError("Price must be greater than zero");
      }

      try {
        // Create a query.
        const query = `
        {
          getTicket(ticketId: ${ticketId}) {
            ticketId
          }
        }
        `;

        // Run query.
        await txn.query(query);

        // Run mutation.
        await txn.mutate({
          setJson: {
            uid: ticketId,
            ...data,
          },
        });

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return fromDbObject({
        uid: ticketId,
        ...data,
      });
    },
  },
};

export default resolvers;
