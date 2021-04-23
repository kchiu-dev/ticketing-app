import { Resolvers, OrderStatus, Order } from "./types";
import { dgraphClientWrapper } from "../DgraphClientWrapper";
import { UserInputError } from "apollo-server-express";
import { Txn } from "dgraph-js-http";

interface OrderDbObject {
  uid: string;
  status: OrderStatus,
  ticket: string
}

const getTransaction = (forRead: boolean): Txn =>
  forRead
    ? dgraphClientWrapper.client.newTxn({ readOnly: true, bestEffort: true})
    : dgraphClientWrapper.client.newTxn();

const fromDbObject = (dbObject: OrderDbObject): Order => ({
  orderId: dbObject.uid,
  status: dbObject.status,
  ticket: dbObject.ticket as any,
});

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
          getOrder(orderId: ${orderId}) {
            orderId
            status
            ticket
          }
        }
        `;

        // Run query and get order.
        const res = await txn.query(query);
        order = <OrderDbObject>res.data;

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up transaction.
        await txn.discard();
      }

      return fromDbObject({
        ...order,
      });
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
          dbAllOrders(func: has(uid)) {
            uid
            status
            ticket
          }
        }
        `;

        // Run query and get all orders.
        const res = await txn.query(query);
        allOrders = <OrderDbObject[]>res.data;

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }
      return allOrders.map(fromDbObject);
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
          dbOrder(func: eq(uid, ${orderId})) {
            uid
            status
            ticket
          }
        }
        `;

        // Run query and get order.
        const res = await txn.query(query);
        order = <OrderDbObject>res.data;

        if (!order) {
          throw new UserInputError("Invalid orderId");
        }

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return fromDbObject(order);
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
          getTicket(ticketId: ${ticketId}) {
            ticketId
          }
        }
        `;

        // Run query.
        await txn.query(query);

        // Run mutation and get orderId.
        const assigned = await txn.mutate({
          setJson: {
            status: OrderStatus.Created,
            ticket: ticketId,
          }
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

      return fromDbObject({
        uid: orderId,
        status: OrderStatus.Created,
        ticket: ticketId
      });
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
          getOrder(orderId: ${orderId}) {
            orderId
            status
            ticket
          }
        }
        `;

        // Run query and get order.
        const res = await txn.query(query);
        order = <OrderDbObject>res.data;

        // Run mutation.
        await txn.mutate({
          setJson: {
            uid: orderId,
            status: OrderStatus.Cancelled,
            ticket: order.ticket
          }
        });

        // Commit transaction.
        await txn.commit();
      } finally {
        // Clean up.
        await txn.discard();
      }

      return fromDbObject({
        uid: orderId,
        status: OrderStatus.Cancelled,
        ticket: order.ticket
      });
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
          getOrder(orderId: ${orderId}) {
            orderId
            status
            ticket
          }
        }
        `;

        // Run query and get order.
        const res = await txn.query(query);
        order = <OrderDbObject>res.data;

        // Run mutation.
        await txn.mutate({
          setJson: {
            uid: orderId,
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

      return fromDbObject({
        uid: orderId,
        status: OrderStatus.Complete,
        ticket: order.ticket,
      });
    },
  },
};

export default resolvers;
