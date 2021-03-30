import { Subjects } from './subjects';
import { EmailMetadata } from '../interfaces/email-metadata';

export interface CheckVersionCompletedEvent {
    subject: Subjects.CheckVersionCompleted;
    data: EmailMetadata;
}
