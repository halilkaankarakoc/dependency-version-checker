import { Subjects } from './subjects';
import { RepoMetadata } from '../interfaces/repo-metadata';

export interface DependenciesOutdatedEvent {
    subject: Subjects.DependenciesOutDated;
    data: RepoMetadata;
}
