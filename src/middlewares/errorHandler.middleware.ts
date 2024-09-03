import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (!err.isOperational) {
    console.error('Unexpected Error:', err);
    err = new AppError('Internal Server Error', 500);
  }

  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
  });
};
