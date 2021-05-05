import { Resolvers, Ticket } from "./types";
import { graphQLClientWrapper } from "../GraphQLClientWrapper";
import { UserInputError } from "apollo-server-express";
import { GraphQLClient, gql } from "graphql-request";

interface TicketData {
  getTicket: Ticket;
  allTickets: [Ticket];
}

const getClient = (): GraphQLClient => graphQLClientWrapper.client;

const resolvers: Resolvers = {
  Ticket: {
    __resolveReference: async ({ ticketId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      // Create a query.
      const query = gql`
        query {
          getTicket(ticketId: ${ticketId}) {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get ticket.
      let data;
      try {
        data = <TicketData>await client.request(query);
      } catch (error) {
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
      const query = gql`
        query {
          allTickets: queryTicket(filter: { has: ticketId }) {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get all tickets.
      let data;
      try {
        data = <TicketData>await client.request(query);
      } catch (error) {
        throw new UserInputError("Cannot fetch tickets");
      }

      return data.allTickets;
    },
    getTicket: async (_: any, { ticketId }) => {
      // Get an instance of Apollo Client.
      const client = getClient();

      // Create a query.
      const query = gql`
        query {
          getTicket(ticketId: ${ticketId}) {
            ticketId
            title
            price
          }
        }
      `;

      // Run query and get ticket.
      let data;
      try {
        data = <TicketData>await client.request(query);
      } catch (error) {
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

      const addition = inputData;

      // Create a mutation.
      const mutation = gql`
        mutation {
          addTicket(input: ${addition}) {
            ticket {
              ticketId
              title
              price
            }
          }
        }
      `;

      // Run mutation.
      let data;
      try {
        data = <Ticket>await client.request(mutation);
      } catch (error) {
        throw new UserInputError("Title can't be empty");
      }

      return data;
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
      const mutation = gql`
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
      let data;
      try {
        data = <Ticket>await client.request(mutation);
      } catch (errors) {
        throw new UserInputError("Invalid ticketId");
      }

      return data;
    },
  },
};

export default resolvers;
