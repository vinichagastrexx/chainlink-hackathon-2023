import { HttpResponse } from '../../protocols';
import { ServerError, UnauthorizedError } from '../../errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error.message,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error.message,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const serverError = (error: any): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.message),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});
