import { Resolvers, OrderStatus, Order } from "./types";
import { apolloClientWrapper } from "../ApolloClientWrapper";
import { UserInputError } from "apollo-server-express";
import {
  ApolloClient,
  ApolloQueryResult,
  FetchResult,
  gql,
} from "@apollo/client";

interface OrderData {
  getOrder: Order;
  allOrders: [Order];
}

const getClient = (): ApolloClient<any> => apolloClientWrapper.client;

const resolvers: Resolvers = {
  Order: {
    __resolveReference: async ({ orderId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      
        // Create a query.
        const query = `
          query {
            getOrder(orderId: ${orderId}) {
              orderId
              status
              ticket
            }
          }
        `;

        // Run query and get order.
        const { data, errors } = <ApolloQueryResult<OrderData>>(
          await client.query({
            query: gql`
              ${query}
            `,
          })
        );

        if (errors) {
          throw new UserInputError("Invalid orderId");
        }

        return data.getOrder;
    },
    //@ts-ignore
    ticket: ({ ticket }: any) => {
      return { __typename: "Ticket", ticketId: ticket };
    },
  },
  Query: {
    allOrders: async () => {
      // Get an instance of Apollo Client.
      const client = getClient();

        // Create a query.
        const query = `
          query {
            queryOrder(filter: { has : orderId } ){
              orderId
              status
              ticket
            }
          }
        `;

        // Run query and get all orders.
        const { data } = <ApolloQueryResult<OrderData>>await client.query({
          query: gql`
            ${query}
          `,
        });

        return data.allOrders;
    },
    getOrder: async (_: any, { orderId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

        // Create a query.
        const query = `
          query {
            getOrder(orderId: ${orderId}) {
              orderId
              status
              ticket
            }
          }
        `;

        // Run query and get order.
        const { data, errors } = <ApolloQueryResult<OrderData>>(
          await client.query({
            query: gql`
              ${query}
            `
          })
        );

        if (errors) {
          throw new UserInputError("Invalid orderId");
        }

        return data.getOrder;
    },
  },
  Mutation: {
    createOrder: async (_: any, { data: inputData }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      const addition = { 
        ...inputData, 
        status: OrderStatus.Created 
      }

      // Create a mutation.
      const mutation = `
        mutation {
          addOrder(input: ${addition}) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Run mutation.
      const { data, errors } = <FetchResult<Order>>await client.mutate({
        mutation: gql`
          ${mutation}
        `,
      });

      if (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      return <Order>data;
    },
    cancelOrder: async (_: any, { orderId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      const patch = {
        filter: {
          orderId,
        },
        set: {
          status: OrderStatus.Cancelled
        }
      };

      // Create a mutation.
      const mutation = `
        mutation {
          updateOrder(input: ${patch}) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Run mutation.
      const { data, errors } = <FetchResult<Order>>await client.mutate({
        mutation: gql`
          ${mutation}
        `,
      });

      if (errors) {
        throw new UserInputError("Invalid orderId");
      }

      return <Order>data;
    },
    completeOrder: async (_: any, { orderId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      const patch = {
        filter: {
          orderId,
        },
        set: {
          status: OrderStatus.Complete
        },
      };

      // Create a mutation.
      const mutation = `
        mutation {
          updateOrder(input: ${patch}) {
            order {
              orderId
              status
              ticket
            }
          }
        }
      `;

      // Run mutation.
      const { data, errors } = <FetchResult<Order>>await client.mutate({
        mutation: gql`
          ${mutation}
        `,
      });

      if (errors) {
        throw new UserInputError("Invalid orderId");
      }

      return <Order>data;
    },
  },
};

export default resolvers;
