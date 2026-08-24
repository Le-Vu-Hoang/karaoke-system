import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      //# P2002: Unique constraint failed (e.g., Email or Phone number already exists)
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const targetField = exception.meta?.target ? (exception.meta.target as string[]).join(', ') : 'field';

        response.status(status).json({
          statusCode: status,
          error: 'Conflict',
          message: `Duplicate entry found for '${targetField}'. Please use a different value.`,
        });
        break;
      }

      //# P2025: Record not found (e.g., trying to update or delete a non-existent ID)
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;

        response.status(status).json({
          statusCode: status,
          error: 'Not Found',
          message: 'The requested record was not found in the database.',
        });
        break;
      }

      //# P2003: Foreign key constraint failed (e.g., creating a booking with an invalid room ID)
      case 'P2003': {
        const status = HttpStatus.BAD_REQUEST;
        const targetField = exception.meta?.field_name ? (exception.meta.field_name as string) : 'relation';

        response.status(status).json({
          statusCode: status,
          error: 'Bad Request',
          message: `Foreign key constraint failed on '${targetField}'. The related record does not exist.`,
        });
        break;
      }

      //# P2014: The change you are trying to make would violate the required relation
      case 'P2014': {
        const status = HttpStatus.BAD_REQUEST;

        response.status(status).json({
          statusCode: status,
          error: 'Bad Request',
          message: 'The action violates a required relation between records.',
        });
        break;
      }

      //# Default fallback for any other Prisma errors
      default:
        // By calling super.catch, NestJS will handle the unknown Prisma errors properly
        // It provides better stack traces in the console during development
        super.catch(exception, host);
        break;
    }
  }
}
