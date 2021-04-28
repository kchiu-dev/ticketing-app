import { Resolvers, OrderStatus, Order } from "./types";
import { dgraphClientWrapper } from "../DgraphClientWrapper";
import { UserInputError } from "apollo-server-express";
import { Txn } from "dgraph-js-http";

const getTransaction = (forRead: boolean): Txn =>
  forRead
    ? dgraphClientWrapper.client.newTxn({ readOnly: true, bestEffort: true })
    : dgraphClientWrapper.client.newTxn();

const resolvers: Resolvers = {
  Order: {
    __resolveReference: async ({ orderId }) => {
      // Create a new transaction
      const forRead = true;
      const txn = getTransaction(forRead);

      let order;

      try {
        // Create a query.
        const query = `
        {
          dgraphGetOrder(func: has(status)) @filter(uid_in(~status, ${orderId})) {
            orderId: uid
            status
            ticket
          }
        }
        `;

        // Run query and get order.
        const res = await txn.query(query);
        order = <Order>res.data;

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up transaction.
        await txn.discard();
      }

      return order;
    },
    //@ts-ignore
    ticket: ({ ticket }: any) => {
      return { __typename: "Ticket", ticketId: ticket };
    },
  },
  Query: {
    allOrders: async () => {
      // Create a new transaction.
      const forRead = true;
      const txn = getTransaction(forRead);

      let allOrders;

      try {
        // Create a query.
        const query = `
        {
          dgraphAllOrders(func: has(status)) {
            orderId: uid
            status
            ticket
          }
        }
        `;

        // Run query and get all orders.
        const res = await txn.query(query);
        allOrders = <Order[]>res.data;

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }
      return allOrders;
    },
    getOrder: async (_: any, { orderId }) => {
      // Create a new transaction.
      const forRead = true;
      const txn = getTransaction(forRead);

      let order;

      try {
        // Create a query.
        const query = `
        {
          dgraphGetOrder(func: has(status)) @filter(uid_in(~status, ${orderId})) {
            orderId: uid
            status
            ticket
          }
        }
        `;

        // Run query and get order.
        const res = await txn.query(query);
        order = <Order>res.data;

        if (!order) {
          throw new UserInputError("Invalid orderId");
        }

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return order;
    },
  },
  Mutation: {
    createOrder: async (_: any, { data }) => {
      // Create a new transaction.
      const forRead = false;
      const txn = getTransaction(forRead);

      let orderId;

      const { ticketId } = data;

      try {
        // Create a query.
        const query = `
        {
          dgraphGetTicket(func: has(title)) @filter(uid_in(~title, ${ticketId})) {
            ticketId: uid
          }
        }
        `;

        // Run query.
        const res = await txn.query(query);
        const ticket = res.data;

        if (!ticket) {
          throw new UserInputError("Invalid ticketId");
        }

        // Run mutation and get orderId.
        const assigned = await txn.mutate({
          setJson: {
            status: OrderStatus.Created,
            ticket: ticketId,
          },
        });
        orderId = assigned.data.uids["blank-0"];

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
        orderId,
        status: OrderStatus.Created,
        ticket: ticketId as any,
      };
    },
    cancelOrder: async (_: any, { orderId }) => {
      // Create a new transaction.
      const forRead = false;
      const txn = getTransaction(forRead);

      let order;

      try {
        // Create a query.
        const query = `
        {
          dgraphGetOrder(func: has(status)) @filter(uid_in(~status, ${orderId})) {
            orderId: uid
            status
            ticket
          }
        }
        `;

        // Run query and get order.
        const res = await txn.query(query);
        order = <Order>res.data;

        if (!order) {
          throw new UserInputError("Invalid orderId");
        }

        // Run mutation.
        await txn.mutate({
          setJson: {
            orderId,
            status: OrderStatus.Cancelled,
            ticket: order.ticket,
          },
        });

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return {
        orderId,
        status: OrderStatus.Cancelled,
        ticket: order.ticket as any,
      };
    },
    completeOrder: async (_: any, { orderId }) => {
      // Create a new transaction.
      const forRead = false;
      const txn = getTransaction(forRead);

      let order;

      try {
        // Create a query.
        const query = `
        {
          dgraphGetOrder(func: has(status)) @filter(uid_in(~status, ${orderId})) {
            orderId: uid
            status
            ticket
          }
        }
        `;

        // Run query and get order.
        const res = await txn.query(query);
        order = <Order>res.data;

        // Run mutation.
        await txn.mutate({
          setJson: {
            orderId,
            status: OrderStatus.Complete,
            ticket: order.ticket,
          },
        });

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return {
        orderId,
        status: OrderStatus.Complete,
        ticket: order.ticket as any,
      };
    },
  },
};

export default resolvers;
