import { app } from "./app";
import { ticketsMongoClientWrapper } from "./MongoClientWrapper";

const start = async () => {
  console.log("Starting.............");

  if (!process.env.MONGO_TICKETS_URI) {
    throw new Error("MONGO_TICKETS_URI must be defined");
  }

  try {
    await ticketsMongoClientWrapper.connect(
      "tickets",
      process.env.MONGO_TICKETS_URI
    );
    console.log("Connected to tickets MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(4001, () => {
    console.log("Listening on port 4001!!!!!!");
  });
};

start();
