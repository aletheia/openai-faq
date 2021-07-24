/* eslint-disable @typescript-eslint/no-explicit-any */
import {singleton} from 'tsyringe';
import {createLogger, Logger as WinstonLogger} from 'winston';
import {Console} from 'winston/lib/winston/transports';

export interface LoggerOptions {
  level?: string;
  transports?: Array<any>;
  exitOnError?: boolean;
}

@singleton()
export class Logger {
  private _logger: WinstonLogger;

  constructor(options?: LoggerOptions) {
    const defaultOptions = {
      level: 'info',
      transports: [
        new Console({
          level: 'info',
        }),
      ],
    };

    options = Object.assign(defaultOptions, options);

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
