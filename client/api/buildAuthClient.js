import axios from "axios";

export default ({ req }) => {
  const authURL = process.env.NEXT_PUBLIC_AUTH_URL;
  // We are on the server
  return axios.create({
    // Remote Cluster
    baseURL: authURL,
    headers: req.headers,
  });
};
