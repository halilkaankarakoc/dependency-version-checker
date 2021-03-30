import { CustomError } from '../custom-error';

export class UnsupportedPackageManagerError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, UnsupportedPackageManagerError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
