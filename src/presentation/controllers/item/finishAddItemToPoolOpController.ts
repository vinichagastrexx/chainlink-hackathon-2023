import { Controller, HttpRequest, HttpResponse, Validation } from '../../protocols';
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/http-helper';
import { FinishAddItemToPoolOp } from '../../../domain/usecases/FinishAddItemToPoolOp';

export class FinishAddItemToPoolOpController implements Controller {
  constructor(private readonly finishAddItemToPoolOp: FinishAddItemToPoolOp, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }

      const { itemId, poolId } = httpRequest.body;

      const result = await this.finishAddItemToPoolOp.execute({
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
