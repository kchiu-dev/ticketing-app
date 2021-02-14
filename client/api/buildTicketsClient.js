import axios from "axios";

export default ({ req }) => {
  const ticketsURL = process.env.NEXT_PUBLIC_TICKETS_URL;
  // We are on the server
  return axios.create({
    // Remote Cluster
    baseURL: ticketsURL,
    headers: req.headers,
  });
};
