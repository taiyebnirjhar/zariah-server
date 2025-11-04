import { Environment } from '@/config';
import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as colors from 'colors';
import * as fs from 'fs';
import * as morgan from 'morgan';
import * as path from 'path';
import pino from 'pino';
import * as rfs from 'rotating-file-stream';

colors.enable();

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly errorsDir = path.join('logs', 'errors');
  private readonly infosDir = path.join('logs', 'infos');
  private readonly warnDir = path.join('logs', 'warnings');
  private readonly debugDir = path.join('logs', 'debugs');

  private readonly infoLogger: pino.Logger;
  private readonly errorLogger: pino.Logger;
  private readonly warnLogger: pino.Logger;
  private readonly debugLogger: pino.Logger;

  constructor(private readonly configService: ConfigService) {
    // Create necessary directories
    [this.errorsDir, this.infosDir, this.warnDir, this.debugDir].forEach(
      (dir) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      },
    );

    const createStream = (filename: string, path: string) => {
      return rfs.createStream(filename, {
        interval: '1d',
        path: path,
        maxFiles: 7,
        maxSize: '100K',
      });
    };

    const createTarget = (level: string, destination: string) => {
      const isDevelopment =
        this.configService.get<string>('NODE_ENV') === Environment.Development;

      return isDevelopment
        ? [{ target: 'pino-pretty', level, options: { colorize: true } }]
        : [
            { target: 'pino-pretty', level, options: { colorize: true } },
            {
              level,
              target: 'pino/file',
              options: {
                destination,
                flags: 'a',
              },
            },
          ];
    };

    this.infoLogger = pino(
      {
        level: 'info',
        transport: {
          targets: createTarget(
            'info',
            path.join(this.infosDir, 'app.info.log'),
          ),
        },
        timestamp: () => `,"time":"${new Date().toLocaleString()}"`,
      },
      createStream('app.info.log', this.infosDir),
    );

    this.errorLogger = pino(
      {
        level: 'error',
        transport: {
          targets: createTarget(
            'error',
            path.join(this.errorsDir, 'app.error.log'),
          ),
        },
        timestamp: () => `,"time":"${new Date().toLocaleString()}"`,
      },
      createStream('app.error.log', this.errorsDir),
    );

    this.warnLogger = pino(
      {
        level: 'warn',
        transport: {
          targets: createTarget(
            'warn',
            path.join(this.warnDir, 'app.warn.log'),
          ),
        },
        timestamp: () => `,"time":"${new Date().toLocaleString()}"`,
      },
      createStream('app.warn.log', this.warnDir),
    );

    this.debugLogger = pino(
      {
        level: 'debug',
        transport: {
          targets: createTarget(
            'debug',
            path.join(this.debugDir, 'app.debug.log'),
          ),
        },
        timestamp: () => `,"time":"${new Date().toLocaleString()}"`,
      },
      createStream('app.debug.log', this.debugDir),
    );
  }

  log(message: any, ...optionalParams: any[]) {
    this.infoLogger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.errorLogger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.warnLogger.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.debugLogger.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.debugLogger.debug(message, ...optionalParams);
  }

  morganLogger() {
    morgan.token('pid', () => {
      return colors.blue(`PID: ${process.pid}`);
    });

    // Optionally colorize other tokens as well
    morgan.token('status', (req, res) => {
      const status = res.statusCode;
      const color =
        status >= 500
          ? colors.red
          : status >= 400
            ? colors.yellow
            : status >= 300
              ? colors.cyan
              : status >= 200
                ? colors.green
                : colors.white;
      return color(status.toString());
    });

    morgan.token('client-info', (req) => {
      return colors.yellow(req.headers['user-agent'] || 'unknown client');
    });

    morgan.token('method', (req) => {
      return colors.magenta(req.method as string);
    });

    morgan.token('url', (req) => {
      return colors.cyan(req.url as string);
    });
    return morgan(
      ':pid :method :url :status :res[content-length] - :response-time ms :client-info',
      {
        stream: {
          write: (message: string) => {
            const cleanMessage = message.trim().replace(/\x1b\[[0-9;]*m/g, '');
            this.infoLogger.info(`Request : ${cleanMessage} `);
          },
        },
      },
    );
  }
}
