import axios from "axios";

export default ({ req }) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  console.log(`base-url is: ${baseURL}`);
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      // Remote Cluster
      baseURL: `${baseURL}`,
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
