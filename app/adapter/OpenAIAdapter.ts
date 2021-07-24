import {Adapter} from '../core/Adapter';
import {Answer} from '../domain/Answer';
import {Question} from '../domain/question';

export class OpenAIAdapter extends Adapter {
  getAnswer(question: Question): Promise<Answer> {
    throw new Error('Method not implemented.');
  }
}
