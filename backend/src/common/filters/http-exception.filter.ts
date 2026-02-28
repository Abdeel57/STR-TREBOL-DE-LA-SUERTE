import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
  details?: any; // Solo en desarrollo
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly isDevelopment = process.env.NODE_ENV !== 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar el status code y mensaje
    let statusCode: number;
    let message: string;
    let error: string | undefined;
    let details: any = undefined;

    if (exception instanceof HttpException) {
      // Errores HTTP conocidos (400, 401, 403, 404, etc.)
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message || 'Ha ocurrido un error';
        error = responseObj.error || exception.name;
        
        // En desarrollo, incluir detalles adicionales
        if (this.isDevelopment && responseObj.details) {
          details = responseObj.details;
        }
      } else {
        message = exception.message || 'Ha ocurrido un error';
      }
    } else if (exception instanceof Error) {
      // Errores de JavaScript/TypeScript
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = this.isDevelopment 
        ? exception.message 
        : 'Ha ocurrido un error interno del servidor';
      error = exception.name;
      
      // En desarrollo, incluir stack trace
      if (this.isDevelopment) {
        details = {
          stack: exception.stack,
          name: exception.name,
        };
      }
    } else {
      // Errores desconocidos
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Ha ocurrido un error inesperado';
      error = 'Internal Server Error';
    }

    // Crear respuesta de error
    const errorResponse: ErrorResponse = {
      success: false,
      statusCode,
      message: this.getUserFriendlyMessage(message, statusCode),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Agregar error type solo si es necesario
    if (error && this.isDevelopment) {
      errorResponse.error = error;
    }

    // Agregar detalles solo en desarrollo
    if (details && this.isDevelopment) {
      errorResponse.details = details;
    }

    // Logging según el tipo de error
    this.logError(exception, statusCode, request, message);

    // Enviar respuesta
    response.status(statusCode).json(errorResponse);
  }

  private getUserFriendlyMessage(message: string | string[], statusCode: number): string {
    // Si el mensaje es un array (validación de class-validator), tomar el primero
    if (Array.isArray(message)) {
      return message[0] || 'Error de validación';
    }

    // Mensajes amigables para códigos comunes
    if (statusCode === HttpStatus.NOT_FOUND) {
      return 'El recurso solicitado no fue encontrado';
    }

    if (statusCode === HttpStatus.UNAUTHORIZED) {
      return 'No estás autorizado para realizar esta acción';
    }

    if (statusCode === HttpStatus.FORBIDDEN) {
      return 'No tienes permisos para acceder a este recurso';
    }

    if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
      return 'Has realizado demasiadas peticiones. Por favor, espera un momento';
    }

    if (statusCode === HttpStatus.BAD_REQUEST) {
      return message || 'La solicitud es inválida';
    }

    if (statusCode >= 500) {
      return 'Ha ocurrido un error en el servidor. Por favor, intenta más tarde';
    }

    // Devolver el mensaje original si es amigable
    return message || 'Ha ocurrido un error';
  }

  private logError(exception: unknown, statusCode: number, request: Request, message: string) {
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';

    // Log según la severidad
    if (statusCode >= 500) {
      // Errores del servidor - críticos
      this.logger.error(
        `❌ ${method} ${url} - ${statusCode} - ${message}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
        {
          ip,
          userAgent,
          statusCode,
        }
      );
    } else if (statusCode >= 400) {
      // Errores del cliente - advertencias
      this.logger.warn(
        `⚠️ ${method} ${url} - ${statusCode} - ${message}`,
        {
          ip,
          userAgent,
          statusCode,
        }
      );
    } else {
      // Otros errores - información
      this.logger.log(
        `ℹ️ ${method} ${url} - ${statusCode} - ${message}`,
        {
          ip,
          userAgent,
          statusCode,
        }
      );
    }
  }
}

