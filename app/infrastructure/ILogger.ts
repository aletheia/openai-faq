/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILogger {
  error(message: string, ...args: Array<any>): void;
  info(message: string, ...args: Array<any>): void;
  debug(message: string, ...args: Array<any>): void;
  warn(message: string, ...args: Array<any>): void;
}
