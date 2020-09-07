import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@kchiu-dev/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
