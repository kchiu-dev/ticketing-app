import { OrderCreatedEvent, Publisher, Subjects } from "@kch-chiu/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
