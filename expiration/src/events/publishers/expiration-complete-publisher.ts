import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "../../../../common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
