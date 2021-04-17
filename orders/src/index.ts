import { app } from "./app";
import {
  ordersMongoClientWrapper,
  ticketsMongoClientWrapper,
} from "./MongoClientWrapper";

const start = async () => {
  console.log("Starting.............");

  if (!process.env.MONGO_ORDERS_URI) {
    throw new Error("MONGO_ORDERS_URI must be defined");
  }

  if (!process.env.MONGO_TICKETS_URI) {
    throw new Error("MONGO_TICKETS_URI must be defined");
  }

  try {
    await ordersMongoClientWrapper.connect(
      "orders",
      process.env.MONGO_ORDERS_URI
    );
    console.log("Connected to orders MongoDB");

    await ticketsMongoClientWrapper.connect(
      "tickets",
      process.env.MONGO_TICKETS_URI
    );
    console.log("Connected to tickets MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(4002, () => {
    console.log("Listening on port 4002!!!!!!");
  });
};

start();
