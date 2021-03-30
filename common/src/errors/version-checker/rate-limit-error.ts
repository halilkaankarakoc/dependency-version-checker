import { CustomError } from '../custom-error';

export class RateLimitError extends CustomError {
    statusCode = 403;

    constructor() {
        super('Dependency Version Checker uses public api so it has a request limit... Please try again later.');

        Object.setPrototypeOf(this, RateLimitError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
