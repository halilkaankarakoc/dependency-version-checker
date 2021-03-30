import { CheckVersionCompletedEvent } from '@dependency-version-checker/common';
import {
    Subjects,
    Publisher,
} from '@dependency-version-checker/common';

export class CheckVersionCompletedPublisher extends Publisher<CheckVersionCompletedEvent> {
    subject: Subjects.CheckVersionCompleted = Subjects.CheckVersionCompleted;
}
