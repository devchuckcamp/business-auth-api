import { Request, Response, NextFunction } from 'express';
import { DomainError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError } from '../../domain/base/DomainError';

interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  details?: unknown;
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  let statusCode = 500;
  let errorType = 'Internal Server Error';
  let message = 'An unexpected error occurred';
  let details: unknown = undefined;

  if (error instanceof ValidationError) {
    statusCode = 400;
    errorType = 'Validation Error';
    message = error.message;
  } else if (error instanceof AuthenticationError) {
    statusCode = 401;
    errorType = 'Authentication Error';
    message = error.message;
  } else if (error instanceof AuthorizationError) {
    statusCode = 403;
    errorType = 'Authorization Error';
    message = error.message;
  } else if (error instanceof NotFoundError) {
    statusCode = 404;
    errorType = 'Not Found Error';
    message = error.message;
  } else if (error instanceof ConflictError) {
    statusCode = 409;
    errorType = 'Conflict Error';
    message = error.message;
  } else if (error instanceof DomainError) {
    statusCode = 400;
    errorType = 'Domain Error';
    message = error.message;
  } else if (error.name === 'ValidationError') {
    // Handle class-validator errors
    statusCode = 400;
    errorType = 'Validation Error';
    message = 'Request validation failed';
    details = error.message;
  }

  const errorResponse: ErrorResponse = {
    error: errorType,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  if (details) {
    errorResponse.details = details;
  }

  res.status(statusCode).json(errorResponse);
};