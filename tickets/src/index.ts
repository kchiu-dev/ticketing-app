import { app } from "./app";
import { graphQLClientWrapper } from "./GraphQLClientWrapper";

const start = async () => {
  console.log("Starting.............");

  if (!process.env.DGRAPH_URI) {
    throw new Error("DGRAPH_URI must be defined");
  }

  try {
    graphQLClientWrapper.connect(process.env.DGRAPH_URI);
    console.log("Connected to Dgraph");
  } catch (err) {
    console.error(err);
  }

  app.listen(4001, () => {
    console.log("Listening on port 4001!!!!!!");
  });
};

start();
