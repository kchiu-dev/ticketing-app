import { Publisher, Subjects, TicketUpdatedEvent } from "@kch-chiu/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
