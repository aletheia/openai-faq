import {autoInjectable} from 'tsyringe';
import {Answer} from '../domain/Answer';
import {Question} from '../domain/question';
import {Logger} from '../infrastructure/Logger';
import {Service} from '../core/Service';
import {OpenAIAdapter} from '../adapter/OpenAIAdapter';

@autoInjectable()
export class QuestionService extends Service {
  private aiAdapter: OpenAIAdapter;

  constructor(logger: Logger, aiAdapter: OpenAIAdapter) {
    super(logger);
    this.aiAdapter = aiAdapter;
  }

  askQuestion(question: Question): Promise<Answer> {
    throw new Error('Method not implemented.');
  }
}
