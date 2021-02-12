import axios from "axios";

export default ({ req }) => {
  const authURL = process.env.NEXT_PUBLIC_AUTH_URL;
  console.log(`client-auth-url is: ${authURL}`);
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      // Remote Cluster
      baseURL: authURL,
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
