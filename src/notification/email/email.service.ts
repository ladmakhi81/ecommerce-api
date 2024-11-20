import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import { SendEmailDTO } from '../dtos';

@Injectable()
export class EmailServiceNotification implements OnModuleInit {
  emailTransporter: Transporter;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.emailTransporter = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this._getEmailSender(),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendEmail(dto: SendEmailDTO) {
    try {
      await this.emailTransporter.sendMail(this._prepareEmailOption(dto));
    } catch {
      console.log('Email Not Send, Please Try Again');
    }
  }

  private _prepareEmailOption(dto: SendEmailDTO): SendMailOptions {
    return {
      from: this._getEmailSender(),
      to: dto.recepient,
      subject: dto.title,
      text: dto.description,
    };
  }

  private _getEmailSender() {
    return this.configService.get('MAIL_USER');
  }
}
