import {inject, injectable} from 'tsyringe';
import {Logger} from '../infrastructure/Logger';
import {Config} from '../infrastructure/Config';

@injectable()
export class Module {
  constructor(
    @inject(Logger) protected logger: Logger,
    @inject(Config) protected config: Config
  ) {}
}
