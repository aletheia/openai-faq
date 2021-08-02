import 'reflect-metadata';
import {container, instanceCachingFactory} from 'tsyringe';
import {Config, Logger} from './infrastructure';

export const getContainer = () => {
  container.register(Config, {useValue: new Config()}).register(Logger, {
    useFactory: instanceCachingFactory(container => {
      const config = container.resolve(Config);
      return new Logger(config);
    }),
  });

  return container;
};
