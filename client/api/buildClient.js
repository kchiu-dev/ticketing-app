import axios from "axios";

export default ({ req }, service) => {
  let baseURL;
  switch (service) {
    case "tickets":
      baseURL = process.env.NEXT_PUBLIC_TICKETS_BASEURL;
      break;
    case "orders":
      baseURL = process.env.NEXT_PUBLIC_ORDERS_BASEURL;
      break;
    default:
      baseURL = "/";
  }
  // We are on the server
  return axios.create({
    // Remote Cluster
    baseURL,
    headers: req.headers,
  });
};
