import Router from "next/router";
import { useState, useEffect } from "react";
import buildApiClient from "../../ssr/buildApiClient";
import Header from "../../components/header";

const OrderIndex = ({ orders }) => {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const currentUserSession = sessionStorage.getItem("user");
    currentUserSession ? setCurrentUser(currentUserSession) : Router.push("/");
  }, []);

  return currentUser ? (
    <div>
      <Header currentUser={currentUser} />
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              {order.ticket.title} - {order.status}
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export const getServerSideProps = async (context) => {
  const ordersClient = buildApiClient(context, "orders");

  const ordersRelativeURL = process.env.NEXT_PUBLIC_ORDERS_RELATIVEURL;

  const { data: orders } = await ordersClient.get(`${ordersRelativeURL}`);

  return { props: { orders } };
};

export default OrderIndex;
