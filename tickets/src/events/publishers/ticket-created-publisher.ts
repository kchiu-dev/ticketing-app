import { Publisher, Subjects, TicketCreatedEvent } from "@kch-chiu/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
