import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';
import * as hpp from 'hpp';
import { AppModule } from './app.module';
import { EnvironmentKey } from './config';
import { HttpExceptionFilter } from './error/http-exception.filter';
import { AppLoggerService } from './modules/logger/logger.service';
import {
  swaggerDocumentOptions,
  swaggerPath,
  swaggerSetupOptions,
} from './swegger';

async function bootstrap() {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  const configService = app.get(ConfigService);
  const logger = new AppLoggerService(configService);

  app.useLogger(logger);
  app.use(logger.morganLogger());
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(hpp());
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform request payloads to DTOs
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw errors for unknown properties
    }),
  );

  // Bind the custom exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  /** check if there is Public decorator for each path (action) and its method (findMany / findOne) on each controller */
  Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (
        Array.isArray(method.security) &&
        method.security.includes('isPublic')
      ) {
        method.security = [];
      }
    });
  });

  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  // ----- Start server
  const port = configService.get<number>(EnvironmentKey.PORT);
  const NODE_ENV = configService.get<string>(EnvironmentKey.NODE_ENV);

  await app.listen(port, async () => {
    logger.debug(`=================================`);
    logger.debug(`======= ENV: ${NODE_ENV} =======`);
    logger.debug(`🚀 Server is running on: ${await app.getUrl()}`);
    logger.debug(`=================================`);
  });
}

bootstrap();
