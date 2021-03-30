import { Subjects } from './subjects';
import { RepoMetadata } from '../interfaces/repo-metadata';

export interface ExpirationCompletedEvent {
    subject: Subjects.ExpirationCompleted;
    data: {
        repo: RepoMetadata;
    };
}
