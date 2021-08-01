import {inject, injectable} from 'tsyringe';
import {Logger} from '../infrastructure';
import {Config} from '../infrastructure/Config';

@injectable()
export class Module {
  constructor(
    @inject(Logger) protected logger: Logger,
    @inject(Config) protected config: Config
  ) {}
}

@injectable()
export class Controller extends Module {}

@injectable()
export class Service extends Module {}

@injectable()
export class Adapter extends Module {}
