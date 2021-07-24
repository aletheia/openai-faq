import {Module} from './module';
import {inject, injectable} from 'tsyringe';
import {Logger} from '../infrastructure/Logger';

@injectable()
export class Service extends Module {}
