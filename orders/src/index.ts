import { app, schemaString } from "./app";
import { dgraphClientWrapper } from "./DgraphClientWrapper";

const start = async () => {
  console.log("Starting.............");

  if (!process.env.DGRAPH_URI) {
    throw new Error("MONGO_ORDERS_URI must be defined");
  }

  try {
    dgraphClientWrapper.connect(process.env.DGRAPH_URI);
    console.log("Connected to Dgraph");
    await dgraphClientWrapper.setSchema(schemaString);
    console.log("Orders Schema Loaded to Dgraph");
  } catch (err) {
    console.error(err);
  }

  app.listen(4002, () => {
    console.log("Listening on port 4002!!!!!!");
  });
};

start();
