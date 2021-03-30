import { CustomError } from '../custom-error';

export class RepositoryNotFoundError extends CustomError {
    statusCode = 404;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, RepositoryNotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
