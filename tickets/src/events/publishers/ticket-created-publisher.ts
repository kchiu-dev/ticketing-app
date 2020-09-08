import { Publisher, Subjects, TicketCreatedEvent } from "@kchiu-dev/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
