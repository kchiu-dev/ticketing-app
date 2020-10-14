import { Publisher, Subjects, TicketUpdatedEvent } from "@kch-chiu/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
