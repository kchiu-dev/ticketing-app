import { OrderCreatedEvent, Publisher, Subjects } from "@kch-chiu/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
