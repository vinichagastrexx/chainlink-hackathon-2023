import { Validation } from '../../../../presentation/protocols';
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators';

export const makeSendAddItemToPoolValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['itemId', 'poolId']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
