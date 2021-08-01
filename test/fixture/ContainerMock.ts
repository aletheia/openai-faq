/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import {container} from 'tsyringe';
import {Config, Logger} from '../../app/infrastructure';

const mockLogger = (logger: Logger) => {
  const doNotLogInfo = jest.spyOn(logger, 'info');
  doNotLogInfo.mockImplementation(() => {});
  const doNotLogDebug = jest.spyOn(logger, 'debug');
  doNotLogDebug.mockImplementation(() => {});
};

export const getContainer = () => {
  const config = new Config();
  const logger = new Logger(config);
  mockLogger(logger);

  container.registerInstance<Logger>(Logger, logger);
  return container;
};
