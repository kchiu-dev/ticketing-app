import Link from "next/link";
import buildClient from "../api/buildClient";
import Header from "../components/header";

const LandingPage = ({ currentUser, tickets }) => {
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
  const authClient = buildClient(context, "auth");
  const ticketsClient = buildClient(context, "tickets");

  const authRelativeURL = process.env.NEXT_PUBLIC_AUTH_RELATIVEURL;
  const ticketsRelativeURL = process.env.NEXT_PUBLIC_TICKETS_RELATIVEURL;
  const { data: currentUserData } = await authClient.get(
    `${authRelativeURL}currentuser`
  );
  const { currentUser } = currentUserData;
  const { data: tickets } = await ticketsClient.get(`${ticketsRelativeURL}`);

  return { props: { currentUser, tickets } };
};

export default LandingPage;
