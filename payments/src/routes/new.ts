import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@kch-chiu/common";

import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("orderId").not().isEmpty(), body("orderTicket").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, orderTicket } = req.body;

    const order = await Order.findById(orderId);
    const {
      id: ticketId,
      title: ticketTitle,
      price: ticketPrice,
    } = orderTicket;

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: ticketTitle,
            },
            unit_amount: ticketPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://ticketing-app-kch-chiu.cloud.okteto.net/orders/success`,
      cancel_url: `http://ticketing-app-kch-chiu.cloud.okteto.net/tickets/${ticketId}`,
    });

    const payment = Payment.build({
      stripeId: session.id,
    });
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.stripeId });
  }
);

export { router as createChargeRouter };
