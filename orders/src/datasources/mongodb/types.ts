export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Order = {
  __typename?: "Order";
  orderId: Scalars["ID"];
  status: OrderStatus;
  ticket: Scalars["ID"];
};

export enum OrderStatus {
  Created = "CREATED",
  Cancelled = "CANCELLED",
  AwaitPayment = "AWAIT_PAYMENT",
  Complete = "COMPLETE",
}

export type AdditionalEntityFields = {
  path?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

import { ObjectID } from "mongodb";
export type OrderDbObject = {
  _id: ObjectID;
  status: string;
  ticket: string;
};
