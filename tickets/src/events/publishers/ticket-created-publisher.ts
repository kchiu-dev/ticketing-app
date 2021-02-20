import { Publisher, Subjects, TicketCreatedEvent } from "@kch-chiu/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
