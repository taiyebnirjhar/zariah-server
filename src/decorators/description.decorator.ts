import 'reflect-metadata';

export const DESCRIPTION_METADATA_KEY = Symbol('description');

/**
 * A custom decorator to add descriptions to environment variables.
 * @param description - The description of the environment variable.
 */
export function Description(description: string) {
  return Reflect.metadata(DESCRIPTION_METADATA_KEY, description);
}

/**
 * Helper function to retrieve the description of a property.
 * @param target - The class prototype.
 * @param propertyKey - The property key to get the description for.
 */
export function getDescription(
  target: any,
  propertyKey: string,
): string | undefined {
  return Reflect.getMetadata(DESCRIPTION_METADATA_KEY, target, propertyKey);
}
