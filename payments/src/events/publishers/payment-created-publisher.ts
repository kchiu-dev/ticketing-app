import { Subjects, Publisher, PaymentCreatedEvent } from "@kchiu-dev/common";

export class PaymnetCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
