import axios from "axios";

export default ({ req }) => {
  // We are on the server
  return axios.create({
    // Remote Cluster
    baseURL: process.env.NEXT_PUBLIC_CLIENT_BASEURL,
    headers: req.headers,
  });
};
