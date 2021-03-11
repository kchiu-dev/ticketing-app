import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import useRequest from "../../hooks/use-request";
import buildApiClient from "../../ssr/buildApiClient";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB);

const OrderShow = ({ order }) => {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  const [timeLeft, setTimeLeft] = useState(0);
  const paymentsRelativeURL = process.env.NEXT_PUBLIC_PAYMENTS_RELATIVEURL;
  const { id: orderId, ticket: orderTicket } = order;
  const { doRequest, errors } = useRequest({
    url: `${paymentsRelativeURL}`,
    method: "post",
    body: {
      orderId,
      orderTicket,
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  const handleClick = async (event) => {
    event.preventDefault();

    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Return sessionId to create the Checkout Session
    const { id: sessionId } = await doRequest();

    // When the customer click on the button, redirect them to Checkout using the sessionId.
    const result = await stripe.redirectToCheckout({
      sessionId,
    });

    if (result.error) {
      // If 'redirectToCheckout' fails due to a browser or network
      // error, display the localized error message to your customer
      // using 'result.error.message'.
    }
  };

  return session ? (
    <div>
      Time left to pay: {timeLeft} seconds
      <button role="link" onClick={handleClick}>
        Checkout
      </button>
      {errors}
    </div>
  ) : (
    <div>Access Denied</div>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const apiClient = buildApiClient(context);

  const ordersRelativeURL = process.env.NEXT_PUBLIC_ORDERS_RELATIVEURL;

  const { orderId } = context.query;
  const { data: order } = await apiClient.get(
    `${ordersRelativeURL}/${orderId}`
  );

  return { props: { session, order } };
};

export default OrderShow;
