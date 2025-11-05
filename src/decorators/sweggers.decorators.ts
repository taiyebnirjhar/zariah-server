import { mapMongooseTypeToJsType } from '@/utils/map-mongoose-typ-to-js.util';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Schema } from 'mongoose';

export const IS_PUBLIC_KEY = 'isPublic';

const PublicAuthMiddleware = SetMetadata(IS_PUBLIC_KEY, true);
const PublicAuthSwagger = SetMetadata('swagger/apiSecurity', ['isPublic']);

// decorator to mark a route as public
export const PublicAPI = () =>
  applyDecorators(PublicAuthMiddleware, PublicAuthSwagger);

/**
 * SwaggerQueryParams Decorator
 * Dynamically generates Swagger query parameters based on a Mongoose schema.
 * @param schema - The Mongoose schema to extract keys and types from.
 * @param excludeKeys - Keys to exclude from the schema properties.
 * @returns A method decorator.
 */
export function SwaggerGetMultipleQueryParams(
  schema: Schema,
  excludeKeys: string[] = [],
) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    if (!schema || typeof schema !== 'object' || !schema.paths) {
      throw new Error('Invalid Mongoose schema provided.');
    }
    const predefinedFields = [
      {
        name: 'page',
        type: Number,
        required: false,
        description: 'Page number for pagination.',
      },
      {
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of items per page.',
      },
      {
        name: 'fields',
        type: String,
        required: false,
        description: `Comma-separated list of fields to include in the response (e.g., ${'`'} ${Object.keys(schema.paths).slice(0, 2).join(',')}${'`'}).`,
      },
      {
        name: 'sort',
        type: String,
        required: false,
        description: `Comma-separated list of fields to sort by, in priority order (e.g., ${'`'} ${Object.keys(schema.paths).slice(0, 2).join(',')}${'`'}).`,
      },
      {
        name: 'search',
        type: String,
        required: false,
        description:
          'Search string to filter results based on the collection’s content.',
      },
      {
        name: 'populate',
        type: String,
        required: false,
        description:
          'Comma-separated list of relational objects to populate (e.g., `any relational field in this object/document`).',
      },
    ];

    // Extract schema keys, filter out excluded keys, and map types
    const schemaKeys = Object.keys(schema.paths)
      .filter((key) => !excludeKeys.includes(key))
      .map((key) => ({
        name: key,
        type: mapMongooseTypeToJsType(schema.paths[key]),
        required: false,
        description: `Filter by ${key}.`,
      }));

    // Merge predefined fields and class fields
    const queryParams = [...predefinedFields, ...schemaKeys];

    // Apply ApiQuery decorators to each query parameter
    const decorators = queryParams.map((param) =>
      ApiQuery({
        name: param.name,
        type: param.type,
        required: param.required,
        description: param.description,
      }),
    );

    applyDecorators(...decorators)(target, propertyKey, descriptor);
  };
}
/**
 * SwaggerQueryParams Decorator
 * Dynamically generates Swagger query parameter for a single object.
 * @returns A method decorator.
 */
export function SwaggerGetSingleQueryParams() {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const predefinedFields = [
      {
        name: 'fields',
        type: String,
        required: false,
        description:
          'Comma-separated list of fields to include in the response (e.g., `id,createAt`).',
      },
      {
        name: 'populate',
        type: String,
        required: false,
        description:
          'Comma-separated list of relational objects to populate (e.g., `any relational field in this object/document`).',
      },
    ];

    const queryParams = [...predefinedFields];

    // Apply ApiQuery decorators to each query parameter
    const decorators = queryParams.map((param) =>
      ApiQuery({
        name: param.name,
        type: param.type,
        required: param.required,
        description: param.description,
      }),
    );

    applyDecorators(...decorators)(target, propertyKey, descriptor);
  };
}
