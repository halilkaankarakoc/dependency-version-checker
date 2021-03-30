import { CustomError } from '../custom-error';

export class RateLimitError extends CustomError {
    statusCode = 403;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, RateLimitError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
