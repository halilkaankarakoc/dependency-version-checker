import { Publisher, Subjects, RepoMetadataCreatedEvent } from '@dependency-version-checker/common';

export class RepoMetadataCreatedPublisher extends Publisher<RepoMetadataCreatedEvent> {
    subject: Subjects.RepoMetadataCreated = Subjects.RepoMetadataCreated;
}
