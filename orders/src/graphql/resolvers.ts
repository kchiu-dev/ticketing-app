import { Resolvers, OrderStatus, Order } from "./types";
import { graphQLClientWrapper } from "../GraphQLClientWrapper";
import { UserInputError } from "apollo-server-express";
import { GraphQLClient, gql } from "graphql-request";

interface OrderData {
  getOrder: Order;
  allOrders: [Order];
}

const getClient = (): GraphQLClient => graphQLClientWrapper.client;

const resolvers: Resolvers = {
  Order: {
    __resolveReference: async ({ orderId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      // Create a query.
      const query = gql`
          query {
            getOrder(orderId: ${orderId}) {
              orderId
              status
              ticket
            }
          }
        `;

      // Run query and get order.
      let data;
      try {
        data = <OrderData>await client.request(query);
      } catch (error) {
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
      const query = gql`
        query {
          queryOrder(filter: { has: orderId }) {
            orderId
            status
            ticket
          }
        }
      `;

      // Run query and get all orders.
      let data;
      try {
        data = <OrderData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Cannot fetch orders");
      }

      return data.allOrders;
    },
    getOrder: async (_: any, { orderId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      // Create a query.
      const query = gql`
          query {
            getOrder(orderId: ${orderId}) {
              orderId
              status
              ticket
            }
          }
        `;

      // Run query and get order.
      let data;
      try {
        data = <OrderData>await client.request(query);
      } catch (error) {
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
        status: OrderStatus.Created,
      };

      // Create a mutation.
      const mutation = gql`
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
      let data;
      try {
        data = <Order>await client.request(mutation);
      } catch (error) {
        throw new UserInputError("Invalid tickedId");
      }

      return data;
    },
    cancelOrder: async (_: any, { orderId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      const patch = {
        filter: {
          orderId,
        },
        set: {
          status: OrderStatus.Cancelled,
        },
      };

      // Create a mutation.
      const mutation = gql`
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
      let data;
      try {
        data = <Order>await client.request(mutation);
      } catch (errors) {
        throw new UserInputError("Invalid orderId");
      }

      return data;
    },
    completeOrder: async (_: any, { orderId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      const patch = {
        filter: {
          orderId,
        },
        set: {
          status: OrderStatus.Complete,
        },
      };

      // Create a mutation.
      const mutation = gql`
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
      let data;
      try {
        data = <Order>await client.request(mutation);
      } catch (errors) {
        throw new UserInputError("Invalid orderId");
      }

      return data;
    },
  },
};

export default resolvers;
