import { NextApiResponse } from 'next';
import { ZodSchema } from 'zod';
import { respondBadRequest } from './responses';

// wrap the validation with a try-catch block and return 404 if validation fails
export const validateSchemaOnRuntime = async <T = unknown>(
  schema: ZodSchema,
  body: T,
  res: NextApiResponse,
) => {
  try {
    const result: T = await schema.parseAsync(body);
    return result;
  } catch (e) {
    // run when validation fails
    respondBadRequest(res, e);
    return false;
  }
};
