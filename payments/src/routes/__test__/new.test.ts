import mongoose from "mongoose";
import request from "supertest";

import { OrderStatus } from "@kch-chiu/common";

import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Authorization", global.signin())
    .send({
      orderId: mongoose.Types.ObjectId().toHexString(),
      orderTicket: {
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 80
      }
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Authorization", global.signin())
    .send({
      orderId: order.id,
      orderTicket: {
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 80
      }
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Authorization", global.signin(userId))
    .send({
      orderId: order.id,
      orderTicket: {
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 80
      }
    })
    .expect(400);
});

it("returns a 201 with a defined stripeId", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  const checkoutSession = await request(app)
    .post("/api/payments")
    .set("Authorization", global.signin(userId))
    .send({
      orderId: order.id,
      orderTicket: {
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 80
      }
    })
    .expect(201);

  const { id: stripeId } = checkoutSession.body;
  expect(stripeId).toBeDefined();

  const payment = await Payment.findOne({
    stripeId,
  });
  expect(payment).not.toBeNull();
});
