import ISendMailDTO from '../dtos/ISendmailDTO';

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
