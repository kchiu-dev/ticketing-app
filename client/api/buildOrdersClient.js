import axios from "axios";

export default ({ req }) => {
  const ordersURL = process.env.NEXT_PUBLIC_ORDERS_URL;
  // We are on the server
  return axios.create({
    // Remote Cluster
    baseURL: ordersURL,
    headers: req.headers,
  });
};
