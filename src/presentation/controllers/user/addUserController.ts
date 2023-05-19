import { Controller, HttpRequest, HttpResponse, Validation } from '../../protocols';
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/http-helper';
import { AddUser } from '../../../domain/usecases/AddUser';
import { EmailInUseError } from '../../errors/emailInUseError';

export class AddUserController implements Controller {
  constructor(private readonly addUser: AddUser, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }
      const { walletAddress, username, email } = httpRequest.body;

      const newAccount = await this.addUser.execute({
        email,
        username,
        walletAddress,
      });
      if (newAccount.error) {
        return forbidden(new EmailInUseError());
      }

      return ok(newAccount.user);
    } catch (e) {
      return serverError(e);
    }
  }
}
