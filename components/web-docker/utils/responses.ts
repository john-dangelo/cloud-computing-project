/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export const respondGeneric = (res: NextApiResponse, code: StatusCodes, body: any) => {
  res.status(code).send(body);
};

export const respondNotFound = (res: NextApiResponse) => {
  respondGeneric(res, StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
};

export const respondBadRequest = (res: NextApiResponse, err: any) => {
  respondGeneric(res, StatusCodes.BAD_REQUEST, err);
};

export const respondInternalError = (res: NextApiResponse, err: any) => {
  respondGeneric(res, StatusCodes.INTERNAL_SERVER_ERROR, err);
};

export const respondUnauthorized = (res: NextApiResponse, err: any) => {
  respondGeneric(res, StatusCodes.UNAUTHORIZED, err);
};
