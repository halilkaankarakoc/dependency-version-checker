import { CustomError } from '../custom-error';

export class FileNotFoundError extends CustomError {
    statusCode = 404;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, FileNotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
