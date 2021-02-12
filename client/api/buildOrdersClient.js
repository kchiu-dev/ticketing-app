import axios from "axios";

export default ({ req }) => {
  const ordersURL = process.env.NEXT_PUBLIC_ORDERS_URL;
  console.log(`client-orders-url is: ${ordersURL}`);
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      // Remote Cluster
      baseURL: ordersURL,
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
