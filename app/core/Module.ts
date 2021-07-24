import {inject, injectable} from 'tsyringe';
import {Logger} from '../infrastructure/Logger';

@injectable()
export class Module {
  protected logger: Logger;
  constructor(@inject() logger: Logger) {
    this.logger = logger;
  }
}
