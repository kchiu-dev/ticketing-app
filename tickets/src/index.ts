import { app } from "./app";
import { mongodbWrapper } from "./mongodbWrapper";

const start = async () => {
  console.log("Starting.............");

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongodbWrapper.connect("tickets", process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(4001, () => {
    console.log("Listening on port 4001!!!!!!");
  });
};

start();
