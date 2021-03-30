import { SendGrid } from '../../mailers/sendgrid';
import { IMailer } from '../../mailers/IMailer';

export class MailerFactory {
    static getMailer(type: string): IMailer {
        if (type === 'sendgrid') {
            return SendGrid.getInstance();
        }
        return SendGrid.getInstance();
    }
}