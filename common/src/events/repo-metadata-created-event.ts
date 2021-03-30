import { Subjects } from "./subjects";
import { RepoMetadata } from '../interfaces/repo-metadata';


export interface RepoMetadataCreatedEvent {
    subject: Subjects.RepoMetadataCreated;
    data: RepoMetadata
}
