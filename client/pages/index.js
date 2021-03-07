import Link from "next/link";
import { useState, useEffect } from "react";
import buildApiClient from "../ssr/buildApiClient";
import Header from "../components/header";

const LandingPage = ({ tickets }) => {
  const [currentUser, setCurrentUser] = useState();
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  useEffect(() => {
    const currentUserSession = sessionStorage.getItem("user");
    setCurrentUser(currentUserSession);
  }, []);

  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <h2>Tickets</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const ticketsClient = buildApiClient(context, "tickets");

  const ticketsRelativeURL = process.env.NEXT_PUBLIC_TICKETS_RELATIVEURL;

  const { data: tickets } = await ticketsClient.get(`${ticketsRelativeURL}`);

  return { props: { tickets } };
};

export default LandingPage;
