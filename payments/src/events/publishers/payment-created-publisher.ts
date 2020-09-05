import { Subjects, Publisher, PaymentCreatedEvent } from "../../../../common";

export class PaymnetCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
