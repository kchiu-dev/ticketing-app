import Link from "next/link";
import { useState, useEffect } from "react";
import buildApiClient from "../../../ssr/buildApiClient";
import Router from "next/router";

const OrderSuccess = ({ order }) => {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const currentUserSession = sessionStorage.getItem("user");
    currentUserSession ? setCurrentUser(currentUserSession) : Router.push("/");
  });
  return currentUser ? (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div>
          <h5>Your Order for {order.ticket.title} has been completed!</h5>
        </div>
        <div className="d-flex justify-content-around vw-100">
          <Link href="/tickets/new">
            <button className="btn btn-primary">Create another ticket</button>
          </Link>
          <Link href="/">
            <button className="btn btn-primary">Return to home page</button>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export const getServerSideProps = async (context) => {
  const ordersClient = buildApiClient(context, "orders");

  const ordersRelativeURL = process.env.NEXT_PUBLIC_ORDERS_RELATIVEURL;

  const { orderId } = context.query;
  const { data: order } = await ordersClient.get(
    `${ordersRelativeURL}/${orderId}`
  );

  return { props: { order } };
};

export default OrderSuccess;
