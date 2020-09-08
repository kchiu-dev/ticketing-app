import { OrderCreatedEvent, Publisher, Subjects } from "@kchiu-dev/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
