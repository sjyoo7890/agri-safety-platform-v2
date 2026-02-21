import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import serverlessExpress from '@codegenie/serverless-express';
import { AppModule } from '../backend/src/app.module';
import { HttpExceptionFilter } from '../backend/src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../backend/src/common/interceptors/logging.interceptor';

let cachedHandler: any;

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:80'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('농작업 안전관리 플랫폼 API')
    .setDescription('지능형 농작업 안전관리 플랫폼 REST API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  return serverlessExpress({ app: expressApp });
}

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(req, res);
}
