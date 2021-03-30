import { EmailMessage } from '../email-message';
import { IMailer } from './IMailer';
import sendgrid from '@sendgrid/mail';

export class SendGrid implements IMailer {
    private static instance: SendGrid;
    private constructor() {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);
    }

    async send(mesage: EmailMessage): Promise<void> {
        await sendgrid.send(mesage);
    }

    static getInstance(): SendGrid {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new SendGrid();
        return this.instance;
    }
}