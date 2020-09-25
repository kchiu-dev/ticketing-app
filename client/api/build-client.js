import axios from "axios";
import https from "https";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    if (process.env.NEXT_PUBLIC_ENV === "staging") {
      return axios.create({
        // Deal with SSL certificate issues
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        baseURL:
          // Local Cluster
          "https://ticketing-app-dev.tk",
        headers: req.headers,
      });
    } else {
      return axios.create({
        baseURL:
          // Production Cluster
          "http://www.ticketing-app.tk",
        headers: req.headers,
      });
    }
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
