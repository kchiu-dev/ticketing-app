import Router from "next/router";
import buildClient from "../../api/buildClient";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const ticketsClient = buildClient(context, 'tickets');
  const { ticketId } = context.query;
  const { data } = await ticketsClient.get(`/api/tickets/${ticketId}`);

  return { props: { ticket: data } };
};

export default TicketShow;
