import axios from "axios";

export default ({ req }) => {
  const env = process.env.NEXT_PUBLIC_ENV;
  if (typeof window === "undefined") {
    // We are on the server
    if (env === "development") {
      return axios.create({
        // Local Cluster        baseURL: http://172.18.0.3:30761
        baseURL:
          "http://172.18.0.3:30761",
        headers: req.headers,
      });
    } else {
      return axios.create({
        // Production Cluster   baseURL: https://ticketing-app.tk
        baseURL:
          "https://ticketing-app.tk",
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
