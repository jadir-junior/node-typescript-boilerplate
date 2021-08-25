import ApiError, { APIError } from '@src/util/errors/api-error';

import { Error } from 'mongoose';
import { Response } from 'express';

export abstract class ErrorController {
  private handleClientErros(error: Error.ValidationError): {
    code: number;
    error: string;
  } {
    const duplicatedKindErrors = Object.values(error.errors).filter((error) => {
      if (
        error instanceof Error.ValidatorError ||
        error instanceof Error.CastError
      ) {
        //   return error.kind === CUSTOM_VALIDATION.DUPLICATED; // create enum custom_validation.duplicated
        return error; // delete
      } else {
        return null;
      }
    });

    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }

    return { code: 422, error: error.message };
  }

  protected sendCreateUpadateErrorResponse(
    res: Response,
    error: Error.ValidationError
  ): void {
    if (error instanceof Error.ValidationError) {
      const clientErrors = this.handleClientErros(error);
      res.status(clientErrors.code).send(
        ApiError.format({
          code: clientErrors.code,
          message: 'Something went wrong',
        })
      );
    } else {
      res
        .status(500)
        .send(ApiError.format({ code: 500, message: 'Something went wrong' }));
    }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}
