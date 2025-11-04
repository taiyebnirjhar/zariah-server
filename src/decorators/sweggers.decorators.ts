import { applyDecorators, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

const PublicAuthMiddleware = SetMetadata(IS_PUBLIC_KEY, true);
const PublicAuthSwagger = SetMetadata('swagger/apiSecurity', ['isPublic']);

// decorator to mark a route as public
export const PublicAPI = () =>
  applyDecorators(PublicAuthMiddleware, PublicAuthSwagger);
