
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Disable default body parser
  });

  // Enable Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      // Formatear errores de validación de forma amigable
      const messages = errors.map(error => {
        const constraints = error.constraints || {};
        return Object.values(constraints)[0] || 'Error de validación';
      });
      return new HttpException(
        {
          message: messages,
          error: 'Bad Request',
          statusCode: 400,
        },
        400
      );
    },
  }));

  // Configure body parser with increased limit for images
  const express = require('express');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS with specific configuration
  // Orígenes permitidos: se cargan desde la variable de entorno CORS_ORIGINS
  // Formato en .env: CORS_ORIGINS=https://tudominio.com,https://www.tudominio.com
  const corsOriginsEnv = process.env.CORS_ORIGINS || '';
  const corsOriginsList = corsOriginsEnv
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const allowedOrigins: (string | RegExp)[] = [
    /^http:\/\/localhost:\d+$/, // Cualquier puerto local en desarrollo
    /\.netlify\.app$/,          // Cualquier subdominio de Netlify
    /\.onrender\.com$/,         // Cualquier subdominio de Render
    ...corsOriginsList,         // Dominios configurados via variable de entorno
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true); // Allow non-browser requests
      }

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) {
        return callback(null, origin);
      }

      console.warn(`CORS bloqueado para origen no permitido: ${origin}`);
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Add a simple root route before setting the global prefix
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      message: 'Rifas Platform Backend API',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        api: '/api',
        health: '/api/health'
      }
    });
  });

  // Add health check endpoint
  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  app.setGlobalPrefix('api'); // Set a global prefix for all routes

  const port = process.env.PORT || 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';

  console.log(`🚀 Backend starting...`);
  console.log(`📡 Environment: ${nodeEnv}`);
  console.log(`🌐 Port: ${port}`);
  console.log(`🔗 API Base: http://localhost:${port}/api`);

  await app.listen(port);
}
bootstrap();
