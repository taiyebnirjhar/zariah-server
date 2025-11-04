import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerPath = '/api/docs';

export const swaggerDocumentOptions = new DocumentBuilder()
  .setTitle('DashForge API')
  .setDescription(
    '\n\n## Congratulations! Your service resource is ready.\n  \nPlease note that all endpoints are secured with JWT Bearer authentication.\nBy default, your service resource comes with one user with the username "admin" and password "admin".',
  )
  .addBearerAuth()
  .build();

export const swaggerSetupOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'dashforge-backend',
};
