import Router from "next/router";
import buildClient from "../../api/buildClient";
import useRequest from "../../hooks/use-request";
import Header from "../../components/header";

const TicketShow = ({ currentUser, ticket }) => {
  const ordersRelativeURL = process.env.NEXT_PUBLIC_ORDERS_RELATIVEURL;
  const { doRequest, errors } = useRequest({
    url: `${ordersRelativeURL}`,
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <h1>{ticket.title}</h1>
        <h4>Price: {ticket.price}</h4>
        {errors}
        <button onClick={() => doRequest()} className="btn btn-primary">
          Purchase
        </button>
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
    `${authRelativeURL}/currentuser`
  );
  const { currentUser } = currentUserData;
  const { ticketId } = context.query;
  const { data: ticket } = await ticketsClient.get(
    `${ticketsRelativeURL}/${ticketId}`
  );

  return { props: { currentUser, ticket } };
};

export default TicketShow;
