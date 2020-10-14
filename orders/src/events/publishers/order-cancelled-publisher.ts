import { Subjects, Publisher, OrderCancelledEvent } from "@kch-chiu/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
