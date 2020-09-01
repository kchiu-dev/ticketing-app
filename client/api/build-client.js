import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL:
        // Local Cluster
        // "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        // Production Cluster
        "http://www.ticketing-app.tk",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
