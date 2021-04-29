import { Resolvers, Ticket } from "./types";
import { dgraphClientWrapper } from "../DgraphClientWrapper";
import { UserInputError } from "apollo-server-express";
import { Txn, Response } from "dgraph-js-http";

interface QueryResponse extends Omit<Response, "data"> {
  data: {
    queryResponse: any;
  };
}

const getTransaction = (forRead: boolean): Txn =>
  forRead
    ? dgraphClientWrapper.client.newTxn({ readOnly: true, bestEffort: true })
    : dgraphClientWrapper.client.newTxn();

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
          queryResponse(func: has(title)) @filter(uid_in(~title, ${ticketId})) {
            ticketId: uid
            title
            price
          }
        }
        `;

        // Run query and get ticket.
        const { data } = <QueryResponse>await txn.query(query);
        ticket = <Ticket>data.queryResponse;

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up transaction.
        await txn.discard();
      }

      return ticket;
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
          queryResponse(func: has(title)) {
            ticketId: uid
            title
            price
          }
        }
        `;

        // Run query and get all tickets.
        const { data } = <QueryResponse>await txn.query(query);
        allTickets = <Ticket[]>data.queryResponse;

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }
      return allTickets;
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
          queryResponse(func: has(title)) @filter(uid_in(~title, ${ticketId})) {
            ticketId: uid
            title
            price
          }
        }
        `;

        // Run query and get ticket.
        const { data } = <QueryResponse>await txn.query(query);
        ticket = <Ticket>data.queryResponse;

        if (!ticket) {
          throw new UserInputError("Invalid ticketId");
        }

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return ticket;
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

      return {
        ticketId,
        ...data,
      };
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
          queryResponse(func: has(title)) @filter(uid_in(~title, ${ticketId})) {
            ticketId: uid
            title
            price
          }
        }
        `;

        // Run query.
        const { data } = <QueryResponse>await txn.query(query);
        const ticket = <Ticket>data.queryResponse;

        if (!ticket) {
          throw new UserInputError("Invalid ticketId");
        }

        // Run mutation.
        await txn.mutate({
          setJson: {
            ticketId,
            ...data,
          },
        });

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return {
        ticketId,
        ...data,
      };
    },
  },
};

export default resolvers;
