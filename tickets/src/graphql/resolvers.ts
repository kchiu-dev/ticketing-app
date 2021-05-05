import { Resolvers, Ticket } from "./types";
import { apolloClientWrapper } from "../ApolloClientWrapper";
import { UserInputError } from "apollo-server-express";
import {
  ApolloClient,
  ApolloQueryResult,
  FetchResult,
  gql,
} from "@apollo/client";

interface TicketData {
  getTicket: Ticket;
  allTickets: [Ticket];
}

const getClient = (): ApolloClient<any> => apolloClientWrapper.client;

const resolvers: Resolvers = {
  Ticket: {
    __resolveReference: async ({ ticketId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      // Create a query.
      const query = `
        query {
          getTicket(ticketId: ${ticketId}) {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get ticket.
      const { data, errors } = <ApolloQueryResult<TicketData>>(
        await client.query({
          query: gql`
            ${query}
          `,
        })
      );

      if (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      return data.getTicket;
    },
  },
  Query: {
    allTickets: async () => {
      // Get an instance of Apollo Client.
      const client = getClient();

      // Create a query.
      const query = `
        query {
          queryTicket(filter: { has : ticketId } ){
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get all tickets.
      const { data } = <ApolloQueryResult<TicketData>>await client.query({
        query: gql`
          ${query}
        `,
      });

      return data.allTickets;
    },
    getTicket: async (_: any, { ticketId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      // Create a query.
      const query = `
        query {
          getTicket(ticketId: ${ticketId}) {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get ticket.
      const { data, errors } = <ApolloQueryResult<TicketData>>(
        await client.query({
          query: gql`
            ${query}
          `,
        })
      );

      if (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      return data.getTicket;
    },
  },
  Mutation: {
    createTicket: async (_: any, { data: inputData }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      const { price } = inputData;

      if (price <= 0) {
        throw new UserInputError("Price must be greater than 0");
      }

      // Create a mutation.
      const mutation = `
        mutation {
          addTicket(input: ${inputData}) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Run mutation and get ticketId.
      const { data, errors } = <FetchResult<Ticket>>await client.mutate({
        mutation: gql`
          ${mutation}
        `,
      });

      if (errors) {
        throw new UserInputError("Title can't be empty");
      }

      return <Ticket>data;
    },
    updateTicket: async (_: any, { ticketId, data: inputData }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      const { price } = inputData;

      if (price <= 0) {
        throw new UserInputError("Price must be greater than zero");
      }

      const patch = {
        filter: {
          ticketId,
        },
        set: {
          ...inputData,
        },
      };

      // Create a mutation.
      const mutation = `
        mutation {
          updateTicket(input: ${patch}) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Run mutation.
      const { data, errors } = <FetchResult<Ticket>>await client.mutate({
        mutation: gql`
          ${mutation}
        `,
      });

      if (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      return <Ticket>data;
    },
  },
};

export default resolvers;
