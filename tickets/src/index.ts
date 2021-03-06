import { app, dgraphSchemaString } from "./app";
import { dgraphClientWrapper } from "./DgraphClientWrapper";

const start = async () => {
  console.log("Starting.............");

  if (!process.env.DGRAPH_URI) {
    throw new Error("DGRAPH_URI must be defined");
  }

  try {
    dgraphClientWrapper.connect(process.env.DGRAPH_URI);
    console.log("Connected to Dgraph");
    await dgraphClientWrapper.setSchema(dgraphSchemaString);
    console.log("Tickets Schema Loaded to Dgraph");
  } catch (err) {
    console.error(err);
  }

  app.listen(4001, () => {
    console.log("Listening on port 4001!!!!!!");
  });
};

start();
