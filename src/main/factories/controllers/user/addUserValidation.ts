import { Validation } from '../../../../presentation/protocols';
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators';

export const makeUserValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['walletAddress']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
