import nodemailer, { Transporter } from 'nodemailer';
import { CustomError } from '../../domain/errors/custom.error';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    mailerService: string,
    mailerUser: string,
    mailerPassword: string
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerUser,
        pass: mailerPassword,
      },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;

    try {
       await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

}
