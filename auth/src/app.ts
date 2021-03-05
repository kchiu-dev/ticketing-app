import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { errorHandler, NotFoundError } from "@kch-chiu/common";

import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";

const app = express();
app.use(json());

app.use(signinRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
