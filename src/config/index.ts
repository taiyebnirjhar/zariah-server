import { defaultEnvValues } from '@/config/defaultEnvValues';
import { getDescription } from '@/decorators/description.decorator';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { writeFileSync } from 'fs';
import * as path from 'path';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'staging',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = defaultEnvValues.NODE_ENV as Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number = defaultEnvValues.PORT;

  @IsString()
  MONGODB_URI: string = defaultEnvValues.MONGODB_URI;

  @IsString()
  JWT_SECRET: string = defaultEnvValues.JWT_SECRET;

  @IsString()
  REDIS_HOST: string = defaultEnvValues.REDIS_HOST;

  @IsNumber()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number = defaultEnvValues.REDIS_PORT;

  @IsString()
  @IsOptional()
  REDIS_USERNAME?: string = defaultEnvValues.REDIS_USERNAME;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string = defaultEnvValues.REDIS_PASSWORD;

  @IsString()
  JWT_EXPIRATION: string = defaultEnvValues.JWT_EXPIRATION;
}

function generateEnvExample() {
  const metadata = plainToInstance(EnvironmentVariables, {});
  const keys = Object.keys(metadata);

  let output = `# Auto-generated .env.example\n`;
  output += `# Generated on ${new Date().toISOString()}\n\n`;

  keys.forEach((key) => {
    const value = metadata[key];

    const description =
      getDescription(EnvironmentVariables.prototype, key) || '';
    output += `${description ? `# ${description}\n` : ''}${key}=${value ? value : 'REQUIRED'}\n\n`;
  });

  const filePath = path.join(process.cwd(), '.env.example');
  writeFileSync(filePath, output, 'utf8');
  const logger = new Logger(ConfigService.name);
  logger.log(`.env.example file generated successfully \nat ${filePath}\n`);
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error(
      'Environment variable validation failed. Generating .env.example...',
    );
    generateEnvExample();
    throw new Error(
      errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('\n'),
    );
  } else {
    generateEnvExample();
  }

  return validatedConfig;
}

function createEnumFromKeys<T>(instance: T): { [K in keyof T]: K } {
  return Object.keys(instance).reduce(
    (acc, key) => {
      acc[key] = key;
      return acc;
    },
    {} as { [K in keyof T]: K },
  );
}

// Create the enum from EnvironmentVariables
export const EnvironmentKey = createEnumFromKeys(new EnvironmentVariables());
