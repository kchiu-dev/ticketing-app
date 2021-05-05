import { app } from "./app";
import { apolloClientWrapper } from "./ApolloClientWrapper";

const start = async () => {
  console.log("Starting.............");

  if (!process.env.DGRAPH_URI) {
    throw new Error("MONGO_ORDERS_URI must be defined");
  }

  try {
    apolloClientWrapper.connect(process.env.DGRAPH_URI);
    console.log("Connected to Dgraph");
  } catch (err) {
    console.error(err);
  }

  app.listen(4002, () => {
    console.log("Listening on port 4002!!!!!!");
  });
};

start();
