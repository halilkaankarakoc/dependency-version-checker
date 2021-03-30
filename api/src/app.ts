import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { versionCheckingRouter } from './routes/check-version';
import { errorHandler, NotFoundError } from '@dependency-version-checker/common';

const app = express();
app.use(json());


app.use(versionCheckingRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);
export { app };


