import { app } from "./app";
import { graphQLClientWrapper } from "./GraphQLClientWrapper";

const start = async () => {
  console.log("Starting.............");

  if (!process.env.GATEWAY_DGRAPH_URL) {
    throw new Error("GATEWAY_DGRAPH_URL must be defined");
  }

  try {
    graphQLClientWrapper.connect(process.env.GATEWAY_DGRAPH_URL);
    console.log("Connected to Dgraph");
  } catch (err) {
    console.error(err);
  }

  app.listen(4002, () => {
    console.log("Listening on port 4002!!!!!!");
  });
};

start();
