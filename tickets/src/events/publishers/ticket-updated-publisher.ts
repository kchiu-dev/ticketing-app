import { Publisher, Subjects, TicketUpdatedEvent } from "@kchiu-dev/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
