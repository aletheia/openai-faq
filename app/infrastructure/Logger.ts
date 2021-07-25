/* eslint-disable @typescript-eslint/no-explicit-any */
import {injectable, singleton} from 'tsyringe';
import {createLogger, Logger as WinstonLogger, format} from 'winston';
import {Console} from 'winston/lib/winston/transports';
import {Config, ConfigKeys} from './Config';

export interface LoggerOptions {
  level?: string;
  transports?: Array<any>;
  exitOnError?: boolean;
}

@injectable()
@singleton()
export class Logger {
  private _logger: WinstonLogger;

  constructor(private config: Config) {
    const logFormat =
      this.config.get(ConfigKeys.LOG_FORMAT).toLowerCase() === 'json'
        ? format.json()
        : format.printf(
            info => `${info.timestamp} ${info.level}: ${info.message}`
          );

    const defaultOptions = {
      level: this.config.get(ConfigKeys.LOG_LEVEL),
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.align(),
        logFormat,
        format.splat()
      ),
      transports: [
        new Console({
          level: 'info',
        }),
      ],
    };

    const options = defaultOptions; //Object.assign(defaultOptions, options);

    this._logger = createLogger(options);
  }

  error(message: string, ...args: Array<any>): void {
    this._logger.error(message, ...args);
  }
  info(message: string, ...args: Array<any>): void {
    this._logger.info(message, ...args);
  }
  debug(message: string, ...args: Array<any>): void {
    this._logger.debug(message, ...args);
  }
  warn(message: string, ...args: Array<any>): void {
    this._logger.warn(message, ...args);
  }
}
