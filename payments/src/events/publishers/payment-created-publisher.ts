import { Subjects, Publisher, PaymentCreatedEvent } from "@kch-chiu/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
