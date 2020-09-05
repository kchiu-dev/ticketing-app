import { Subjects, Publisher, OrderCancelledEvent } from "../../../../common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
