export class SendEmailDTO {
  constructor(
    public recepient: string,
    public title: string,
    public description: string,
  ) {}
}
