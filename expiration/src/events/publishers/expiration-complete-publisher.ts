import { ExpirationCompleteEvent, Publisher, Subjects } from "@kch-chiu/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
