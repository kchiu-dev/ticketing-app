import Router from "next/router";
import buildClient from "../../api/buildClient";
import useRequest from "../../hooks/use-request";
import Header from "../../components/header";
import { useState, useEffect } from "react";

const TicketShow = ({ ticket }) => {
  const [currentUser, setCurrentUser] = useState();
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

  useEffect(() => {
    const currentUserSession = sessionStorage.getItem("user");
    currentUserSession ? setCurrentUser(currentUserSession) : Router.push("/");
  }, []);

  return currentUser ? (
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
  ) : (
    <div>Loading</div>
  );
};

export const getServerSideProps = async (context) => {
  const ticketsClient = buildClient(context, "tickets");

  const ticketsRelativeURL = process.env.NEXT_PUBLIC_TICKETS_RELATIVEURL;

  const { ticketId } = context.query;
  const { data: ticket } = await ticketsClient.get(
    `${ticketsRelativeURL}/${ticketId}`
  );

  return { props: { ticket } };
};

export default TicketShow;
