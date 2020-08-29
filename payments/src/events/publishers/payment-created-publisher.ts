import { Subjects, Publisher, PaymentCreatedEvent } from "@sgtickets/common";

export class PaymnetCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
