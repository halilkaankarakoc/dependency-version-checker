import { ExpirationCompletedEvent,Subjects, Publisher } from '@dependency-version-checker/common';

export class ExpirationCompletePublisher extends Publisher<
    ExpirationCompletedEvent
> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
