import { Controller, HttpRequest, HttpResponse, Validation } from '../../protocols';
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/http-helper';
import { SendAddItemToPoolTx } from '../../../domain/usecases/SendAddItemToPoolTx';

export class SendAddItemToPoolTxController implements Controller {
  constructor(private readonly sendAddItemToPoolTx: SendAddItemToPoolTx, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }

      const { itemId, poolId } = httpRequest.body;

      const result = await this.sendAddItemToPoolTx.execute({
        itemId,
        poolId,
      });

      if (result.error) {
        return forbidden(result.error);
      }

      return ok(result.data);
    } catch (e) {
      return serverError(e);
    }
  }
}
