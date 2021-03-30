import { DependenciesOutdatedEvent, Subjects, Publisher } from '@dependency-version-checker/common';

export class DependenciesOutdatedPublisher extends Publisher<DependenciesOutdatedEvent> {
    subject: Subjects.DependenciesOutDated = Subjects.DependenciesOutDated;
}
