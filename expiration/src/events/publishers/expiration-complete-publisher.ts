import { ExpirationCompleteEvent, Publisher, Subjects } from "@kch-chiu/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
