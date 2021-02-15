import buildClient from "../../api/buildClient";

const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

export const getServerSideProps = async (context) => {
  const ordersClient = buildClient(context, 'orders');
  const { data } = await ordersClient.get("/api/orders");

  return { props: { orders: data } };
};

export default OrderIndex;
