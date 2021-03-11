import Router from "next/router";
import { useSession, getSession } from "next-auth/client";
import buildApiClient from "../../ssr/buildApiClient";
import useRequest from "../../hooks/use-request";
import Header from "../../components/header";

const TicketShow = ({ ticket }) => {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

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

  return session ? (
    <div>
      <Header session={session} />
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
  const session = await getSession(context);
  const apiClient = buildApiClient(context);

  const ticketsRelativeURL = process.env.NEXT_PUBLIC_TICKETS_RELATIVEURL;

  const { ticketId } = context.query;
  const { data: ticket } = await apiClient.get(
    `${ticketsRelativeURL}/${ticketId}`
  );

  return { props: { session, ticket } };
};

export default TicketShow;
