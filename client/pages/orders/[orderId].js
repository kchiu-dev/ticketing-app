import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import buildClient from "../../api/buildClient";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB);

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const paymentsRelativeURL = process.env.NEXT_PUBLIC_PAYMENTS_RELATIVEURL;
  const { doRequest, errors } = useRequest({
    url: `${paymentsRelativeURL}`,
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
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
    console.log(`Stripe Key: ${process.env.NEXT_PUBLIC_STRIPE_PUB}`);
    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const { id: session } = doRequest();

    console.log(`My session: ${session}`);

    // When the customer click on the button, redirect them to Checkout.
    // const result = await stripe.redirectToCheckout({
    //   sessionId: session,
    // });

    if (result.error) {
      // If 'redirectToCheckout' fails due to a browser or network
      // error, display the localized error message to your customer
      // using 'result.error.message'.
    }
  };

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      {/*<StripeCheckout*/}
      {/*  token={({ id }) => doRequest({ token: id })}*/}
      {/*  stripeKey=process.env.STRIPE_KEY*/}
      {/*  amount={order.ticket.price * 100}*/}
      {/*  email={currentUser.email}*/}
      {/*/>*/}
      <button role="link" onClick={handleClick}>
        Checkout
      </button>
      {errors}
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const ordersClient = buildClient(context, 'orders');

  const ordersRelativeURL = process.env.NEXT_PUBLIC_ORDERS_RELATIVEURL;
  const { orderId } = context.query;
  const { data } = await ordersClient.get(`${ordersRelativeURL}${orderId}`);

  return { props: { order: data } };
};

export default OrderShow;
