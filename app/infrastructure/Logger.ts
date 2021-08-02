/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject, injectable, singleton} from 'tsyringe';
import {createLogger, Logger as WinstonLogger, format} from 'winston';
import {Console, File} from 'winston/lib/winston/transports';
import {Config} from './Config';
import {ILogger} from './ILogger';

enum ConfigKeys {
  LOG_LEVEL = 'LOG_LEVEL',
  LOG_FORMAT = 'LOG_FORMAT',
  LOG_FILE = 'LOG_FILE',
}

@injectable()
@singleton()
export class Logger implements ILogger {
  private _logger: WinstonLogger;

  constructor(@inject(Config) private config: Config) {
    let logFormat = format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    );

    const logFormatOption = this.config.get(ConfigKeys.LOG_FORMAT);
    if (logFormatOption && logFormatOption.toLowerCase() === 'json') {
      logFormat = format.json();
    }

    const logLevel = this.config.get(ConfigKeys.LOG_LEVEL)
      ? this.config.get(ConfigKeys.LOG_LEVEL)
      : 'info';

    const transports = [];
    const logFilename = this.config.get(ConfigKeys.LOG_FILE);
    if (logFilename) {
      transports.push(new File({filename: logFilename, level: logLevel}));
    } else {
      transports.push(new Console({level: logLevel}));
    }

    const options = {
      level: logLevel,
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.align(),
        logFormat,
        format.splat()
      ),
      transports,
    };

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
