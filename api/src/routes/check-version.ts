import express, { Request, Response } from 'express';
import { RepoMetadata } from '@dependency-version-checker/common';
import { RepoMetadataCreatedPublisher } from '../events/publishers/repo-metadata-created-publisher';
import { body } from 'express-validator';
import { validateRequest } from '@dependency-version-checker/common';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_PERIOD = 15;

router.post(
    '/api/checkVersion',
    [
        body('provider').notEmpty().withMessage(`"provider" cannot be empty.`),
        body('repoName').notEmpty().withMessage(`"repoName" cannot be empty.`),
        body('emailList').isArray({ min: 1 }).withMessage(`"emailList" must contain at least one email address.`),
        body('emailList.*').notEmpty().isEmail().withMessage(`Elements in "emailList" must be "email"`),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { provider, repoName, emailList } = req.body;
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_PERIOD);
        const repoMetadata: RepoMetadata = {
            provider,
            repoName,
            emailList,
            expiresAt: expiration
        };
        await new RepoMetadataCreatedPublisher(natsWrapper.client).publish(repoMetadata);
        res.send({ message: 'OK' });
    });

export { router as versionCheckingRouter };