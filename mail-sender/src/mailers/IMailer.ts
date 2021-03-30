import { EmailMessage } from '../email-message';

export interface IMailer {
    send(mesage: EmailMessage): Promise<void>
}